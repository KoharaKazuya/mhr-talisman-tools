import { ReactNode } from "react";
import classes from "./copy-target-text.module.css";

type Props = {
  children?: ReactNode;
};

export default function CopyTargetText({ children }: Props) {
  return (
    <pre>
      <code className={classes.output}>{children}</code>
    </pre>
  );
}
