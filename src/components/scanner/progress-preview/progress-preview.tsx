import { useEffect, useRef } from "react";
import { ScanProgress } from "../../../scanner";
import AspectRatio from "../../aspect-ratio";
import classes from "./progress-preview.module.css";

type Props = {
  video: HTMLVideoElement;
  progress?: ScanProgress;
};

export default function ProgressPreview({ video, progress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.appendChild(video);
  }, [video]);

  return (
    <AspectRatio width={16} height={9}>
      <div ref={containerRef} className={classes.container} />
      <div className={classes.overlay}>
        {progress && (
          <>
            <div className={classes.title}>スキャン中</div>
            <Stat
              label="ファイル"
              n={progress.files.current + 1}
              d={progress.files.size}
            />
            <Stat
              label="フレーム"
              n={progress.frames.current + 1}
              d={progress.frames.size}
            />
          </>
        )}
      </div>
    </AspectRatio>
  );
}

function Stat({ label, n, d }: { label: string; n: number; d: number }) {
  return (
    <div>
      <span className={classes.label}>{label}：</span>
      <span className={classes.numerator}>{n}</span>
      <span className={classes.separator}>/</span>
      <span className={classes.denominator}>{d}</span>
    </div>
  );
}
