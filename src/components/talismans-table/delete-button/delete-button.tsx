import { useCallback, useState } from "react";
import { Talisman } from "../../../core/mhr";
import { addUserTalismans, removeUserTalismans } from "../../../storage";
import classes from "./delete-button.module.css";

type Props = {
  value: Talisman;
};

export default function DeleteButton({ value }: Props) {
  const { deleted, toggle } = useDelete(value);

  return (
    <button type="button" onClick={toggle} className={classes.button}>
      <img
        src={
          deleted
            ? `https://icongr.am/clarity/redo.svg?size=16&color=currentColor`
            : `https://icongr.am/clarity/remove.svg?size=16&color=currentColor`
        }
        width="16"
        height="16"
        className={classes.icon}
      />
    </button>
  );
}

function useDelete(talisman: Talisman) {
  const [deleted, setDeleted] = useState(false);

  const toggle = useCallback(() => {
    if (deleted) {
      addUserTalismans([talisman]);
      setDeleted(false);
    } else {
      removeUserTalismans([talisman]);
      setDeleted(true);
    }
  }, [deleted]);

  return { deleted, toggle };
}
