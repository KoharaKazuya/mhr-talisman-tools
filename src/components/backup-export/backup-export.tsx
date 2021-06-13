import { useEffect, useState } from "react";
import { Talisman } from "../../core/mhr";
import { toJSON } from "../../core/serializer";
import { getAllUserTalismans } from "../../storage";
import CopyTargetText from "../copy-target-text";

export default function BackupImport() {
  const { talismans } = useUserTalismans();

  return (
    <section>
      <h2>エクスポート</h2>
      <p>
        バックアップ目的や外部ツールに取り込む目的で使用する場合、以下をコピーしてください。
      </p>
      {talismans && <CopyTargetText>{toJSON({ talismans })}</CopyTargetText>}
    </section>
  );
}

function useUserTalismans() {
  const [talismans, setTalismans] = useState<Talisman[]>();

  useEffect(() => {
    (async () => {
      const talismans = await getAllUserTalismans();
      setTalismans(talismans);
    })();
  }, []);

  return { talismans };
}
