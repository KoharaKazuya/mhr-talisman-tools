import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import TalismanForm from "../components/talisman-form";
import TalismansTable from "../components/talismans-table";
import { Talisman } from "../core/mhr";
import { addUserTalismans, getAllUserTalismans } from "../storage";

export default function Talismans() {
  const { talismans, add } = useUserTalismans();

  return (
    <section>
      <Head>
        <title>護石一覧 | 護石ツールズ</title>
      </Head>
      <h1>護石一覧</h1>
      {talismans?.length === 0 && (
        <p>
          <Link href="/scanner">
            <a>スキャナー</a>
          </Link>
          を使って録画ファイルから護石データを取り込むか、手動で護石データを入力してください。
        </p>
      )}
      {talismans && talismans.length > 0 && (
        <TalismansTable talismans={talismans} />
      )}
      <details>
        <summary>手動追加</summary>
        <TalismanForm onSubmit={add} />
      </details>
    </section>
  );
}

function useUserTalismans() {
  const [talismans, setTalismans] = useState<Talisman[]>();

  const refresh = useCallback(async () => {
    const talismans = await getAllUserTalismans();
    setTalismans(talismans);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    (talisman: Talisman) => {
      (async () => {
        await addUserTalismans([talisman]);
        await refresh();
      })();
    },
    [refresh]
  );

  return { talismans, add };
}
