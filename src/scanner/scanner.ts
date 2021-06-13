import { add, Offset, Rect } from "../core/coordinate";
import { createTalisman, Talisman } from "../core/mhr";
import {
  anchorRect,
  meldingResult,
  skillLevel1Rect,
  skillLevel2Rect,
  skillName1Rect,
  skillName2Rect,
  slot1Rect,
  slot2Rect,
  slot3Rect,
  typeRect,
  videoRect,
  videoSize,
} from "./config";
import {
  matchAnchor,
  matchSkillLevel,
  matchSkillName,
  matchSlotLevel,
  matchType,
} from "./matcher";

type Options = {
  abortSignal: AbortSignal;
  files: File[];
};
type Result = {
  video: HTMLVideoElement;
  on(type: "detect", callback: (t: Talisman) => void): void;
  on(type: "progress", callback: (p: ScanProgress) => void): void;
  on(type: "finish", callback: () => void): void;
  on(type: "error", callback: (e: unknown) => void): void;
  on(type: "unknown", callback: (e: ImageData) => void): void;
};
export type ScanProgress = {
  files: { current: number; size: number };
  frames: { current: number; size: number };
};

export function scan({ abortSignal, files }: Options): Result {
  const video = document.createElement("video");

  const handlers = new Map<string, Set<Function>>();
  const on = (type: string, callback: Function) => {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type)!.add(callback);
  };
  const emit = (type: string, event?: any) => {
    handlers.get(type)?.forEach((f) => f(event));
  };

  (async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      await withVideoSrc(video, file, async () => {
        let prevClips: ImageData[] | undefined;
        let stability = 0;
        const frames = Math.ceil(video.duration * 30);
        for (let t = 0; t < frames; t++) {
          if (abortSignal.aborted) throw new Error("scan aborted");

          emit("progress", {
            files: { current: i, size: files.length },
            frames: { current: t, size: frames },
          });

          // 動画中のフレームを設定する
          video.currentTime = t / 30;
          await new Promise(requestAnimationFrame);

          // 装備ＢＯＸの表示か錬金結果の表示か判定しつつ、
          // アンカー (= 「装備スキル」という文字) を検出して、見つからなければ
          // 護石を表示していないと判断し、スキップする
          const offset = await detectOffset(video);
          if (!offset) continue;

          // 現在のフレームの一部を切り取りとって画像データを取得する
          const clip = (r: Rect) => clipImageData(video, add(r, offset));
          const typeImage = clip(typeRect);
          const skill1Image = clip(skillName1Rect);
          const skill2Image = clip(skillName2Rect);
          const level1Image = clip(skillLevel1Rect);
          const level2Image = clip(skillLevel2Rect);
          const slot1Image = clip(slot1Rect);
          const slot2Image = clip(slot2Rect);
          const slot3Image = clip(slot3Rect);
          const clips = [
            typeImage,
            skill1Image,
            skill2Image,
            level1Image,
            level2Image,
            slot1Image,
            slot2Image,
            slot3Image,
          ];

          // 前フレームと差分が非常に小さければ、ユーザー操作がなかったと判断し重い処理をスキップする
          const changed = !prevClips || areClipsChanged(clips, prevClips);
          if (changed) stability = 0;
          prevClips = clips;
          stability += 1;
          // 画面が変更されたかつ安定した場合のみスキャンをする
          if (stability !== 2) continue;

          // 切り取った画像データとテンプレートを比較してデータを検出する
          const type = await matchType(typeImage);
          const skill1 = await matchSkillName(skill1Image);
          const skill2 = await matchSkillName(skill2Image);
          const level1 = await matchSkillLevel(level1Image);
          const level2 = await matchSkillLevel(level2Image);
          const slot1 = await matchSlotLevel(slot1Image);
          const slot2 = await matchSlotLevel(slot2Image);
          const slot3 = await matchSlotLevel(slot3Image);

          try {
            if (
              type === null ||
              skill1 === null ||
              level1 === null ||
              slot1 === null ||
              slot2 === null ||
              slot3 === null ||
              !skill1 ||
              (!skill2 && Boolean(level2))
            )
              throw new Error("Invalid scan: スキャン失敗データがあります");

            // スキャン結果から護石オブジェクトを作成する
            const talisman = createTalisman({
              name: type,
              skill1,
              skill2: skill2 ?? undefined,
              level1,
              level2: level2 ?? undefined,
              slot1: slot1 || undefined,
              slot2: slot2 || undefined,
              slot3: slot3 || undefined,
            });

            emit("detect", talisman);
          } catch (e) {
            // スキャン結果が明らかに不正な場合は画像を出力してスキップする
            emit("unknown", clipImageData(video, videoRect));
            continue;
          }
        }
      });
    }
  })()
    .then(() => emit("finish"))
    .catch((e) => emit("error", e));

  return { video, on };
}

async function withVideoSrc<T>(
  video: HTMLVideoElement,
  file: File,
  f: () => Promise<T>
): Promise<T> {
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = reject;
      video.src = url;
    });
    return await f();
  } finally {
    video.src = "";
    URL.revokeObjectURL(url);
  }
}

function clipImageData(video: HTMLVideoElement, rect: Rect): ImageData {
  const { x, y, width: w, height: h } = rect;

  const wr = video.videoWidth / videoSize.width;
  const hr = video.videoHeight / videoSize.height;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(video, x * wr, y * hr, w * wr, h * hr, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

async function detectOffset(video: HTMLVideoElement): Promise<Offset | null> {
  let offset: Offset | null = null;
  const anchorImage = clipImageData(video, anchorRect);
  if (await matchAnchor(anchorImage)) {
    offset = { x: 0, y: 0 };
  } else {
    const meldingAnchorImage = clipImageData(
      video,
      add(anchorRect, meldingResult)
    );
    if (await matchAnchor(meldingAnchorImage)) offset = meldingResult;
  }
  return offset;
}

function areClipsChanged(a: ImageData[], b: ImageData[]): boolean {
  if (a.length !== b.length) return true;

  for (let i = 0; i < a.length; i++) {
    if (a[i].width !== b[i].width || a[i].height !== b[i].height) return true;

    const ma = cv.matFromImageData(a[i]);
    cv.cvtColor(ma, ma, cv.COLOR_RGBA2GRAY);

    const mb = cv.matFromImageData(b[i]);
    cv.cvtColor(mb, mb, cv.COLOR_RGBA2GRAY);

    const diff = new cv.Mat();
    cv.absdiff(ma, mb, diff);
    const mean = cv.mean(diff)[0]; // grayscale なので 0 チャンネルのみ

    if (mean >= 10) return true;
  }
  return false;
}
