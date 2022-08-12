import { useLayoutEffect, useMemo, useRef } from "react";
import { Talisman } from "../../../core/mhr";
import TalismansTable from "../../talismans-table";
import classes from "./result.module.css";

type Props = {
  talismans: Talisman[];
  unknownFrames: ImageData[];
};

export default function Result({ talismans, unknownFrames }: Props) {
  const unknownFramesId = useMemo(
    () => String(Math.random()).substring(2),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 変数の一位性を文字列に変換する意図があるため
    [unknownFrames]
  );
  return (
    <div>
      <section>
        <h2>スキャン結果</h2>
        <div>以下の護石データを取り込みました</div>
        <TalismansTable talismans={talismans} />
      </section>
      {unknownFrames.length > 0 && (
        <section>
          <h2>スキャンできなかったシーン</h2>
          {unknownFrames.map((imageData, i) => (
            <Frame key={`${unknownFramesId}-${i}`} data={imageData} />
          ))}
          <div></div>
        </section>
      )}
    </div>
  );
}

function Frame({ data }: { data: ImageData }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(data, 0, 0);
  }, [data]);
  return <canvas ref={ref} className={classes.frame} />;
}
