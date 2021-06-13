import { ReactNode } from "react";
import classes from "./aspect-ratio.module.css";

type Props = {
  width: number;
  height: number;
  children?: ReactNode;
};

export default function AspectRatio({ width, height, children }: Props) {
  return (
    <div
      className={classes.container}
      style={{ paddingTop: `${(height / width) * 100}%` }}
    >
      <div className={classes.content}>{children}</div>
    </div>
  );
}
