import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Talisman } from "../../core/mhr";
import { fromJSON } from "../../core/serializer";
import { setUserTalismans } from "../../storage";
import classes from "./backup-import.module.css";

export default function BackupImport() {
  const [text, setText] = useState("");
  const router = useRouter();

  const submit = useCallback(async () => {
    const confirmation = window.confirm(
      "現在保存されているすべての護石データを破棄し、入力した内容で上書きします。本当によろしいですか？"
    );
    if (!confirmation) return;

    let talismans: Talisman[];
    try {
      const data = fromJSON(text);
      talismans = data.talismans;
    } catch (e) {
      console.error(e);
      window.alert("インポートに失敗しました。入力データが不正です。");
      return;
    }

    await setUserTalismans(talismans);
    router.push("/talismans");
  }, [router, text]);

  return (
    <section>
      <h2>インポート</h2>
      <p>
        バックアップからデータを復元する場合、以下の入力蘭にバックアップの文字列を入力し、インポートボタンを押してください。
      </p>
      <div>
        <textarea
          className={classes.textarea}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </div>
      <button type="button" onClick={submit}>
        インポート
      </button>
    </section>
  );
}
