import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer, useState } from "react";
import { Talisman } from "../../core/mhr";
import { serialize } from "../../core/serializer";
import { scan as scanInner, ScanProgress } from "../../scanner";
import { addUserTalismans } from "../../storage";
import Dropzone from "./dropzone";
import ProgressPreview from "./progress-preview";
import Result from "./result";

export default function Scanner() {
  const { state, scan } = useScanner();
  return (
    <div>
      {state.type === "initial" && <Dropzone onDrop={scan} />}
      {state.type === "pending" && (
        <ProgressPreview video={state.video} progress={state.progress} />
      )}
      {state.type === "fulfilled" && <Result {...state} />}
      {state.type === "rejected" && <>Error: {String(state.error)}</>}
    </div>
  );
}

function useScanner() {
  const [state, dispatch] = useReducer(scanningReducer, { type: "initial" });

  const [controller, setController] = useState<AbortController>();
  useEffect(() => {
    const c = new AbortController();
    setController(c);
    return () => c.abort();
  }, []);

  const scan = useCallback(
    (files: File[]) => {
      if (!controller) return;

      const { video, on } = scanInner({
        abortSignal: controller.signal,
        files,
      });
      dispatch({ type: "started", video });

      new Promise<{ talismans: Talisman[]; unknownFrames: ImageData[] }>(
        (resolve, reject) => {
          const talismans: Talisman[] = [];
          const unknownFrames: ImageData[] = [];
          on("detect", (talisman) => talismans.push(talisman));
          on("finish", () => resolve({ talismans, unknownFrames }));
          on("error", reject);
          on("progress", (progress) =>
            dispatch({ type: "progress", progress })
          );
          on("unknown", (frame) => unknownFrames.push(frame));
        }
      )
        .then((result) => addUserTalismans(result.talismans).then(() => result))
        .then(({ talismans, unknownFrames }) => {
          // 重複除去
          const set = new Map();
          for (const t of talismans) set.set(serialize(t), t);
          talismans = Array.from(set.values());

          dispatch({ type: "succeeded", talismans, unknownFrames });
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: "failed", error });
        });
    },
    [controller]
  );

  // スキャン中はページからの離脱の前にユーザーに確認する
  const router = useRouter();
  useEffect(() => {
    if (state.type !== "pending") return;

    const confirmationMessage =
      "スキャン中のデータは破棄されますがよろしいですか？";
    const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = confirmationMessage);
    };
    const beforeRouteHandler = () => {
      if (!confirm(confirmationMessage)) {
        router.events.emit("routeChangeError");
        throw "route change cancelled";
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);
    router.events.on("routeChangeStart", beforeRouteHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      router.events.off("routeChangeStart", beforeRouteHandler);
    };
  }, [state, router]);

  return { state, scan };
}

type ScanningState =
  | { type: "initial" }
  | { type: "pending"; video: HTMLVideoElement; progress?: ScanProgress }
  | { type: "fulfilled"; talismans: Talisman[]; unknownFrames: ImageData[] }
  | { type: "rejected"; error: unknown };

type ScanningAction =
  | { type: "started"; video: HTMLVideoElement }
  | { type: "succeeded"; talismans: Talisman[]; unknownFrames: ImageData[] }
  | { type: "failed"; error: unknown }
  | { type: "progress"; progress: ScanProgress };

function scanningReducer(
  state: ScanningState,
  action: ScanningAction
): ScanningState {
  switch (action.type) {
    case "started":
      if (state.type !== "initial") return state;
      return { type: "pending", video: action.video };
    case "succeeded":
      if (state.type !== "pending") return state;
      return {
        type: "fulfilled",
        talismans: action.talismans,
        unknownFrames: action.unknownFrames,
      };
    case "failed":
      if (state.type !== "pending") return state;
      return { type: "rejected", error: action.error };
    case "progress":
      if (state.type !== "pending") return state;
      return { ...state, progress: action.progress };
    default:
      return state;
  }
}
