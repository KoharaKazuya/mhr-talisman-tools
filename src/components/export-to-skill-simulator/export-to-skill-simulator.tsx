import { useEffect, useState } from "react";
import { Talisman } from "../../core/mhr";
import { toSkillSimulatorText } from "../../core/serializer";
import { getAllUserTalismans } from "../../storage";
import CopyTargetText from "../copy-target-text";

export default function ExportToSkillSimulator() {
  const { talismans } = useUserTalismans();

  return (
    <section>
      <h2>エクスポート (スキルシミュレーター)</h2>
      <p>
        スキャンした護石のデータを
        <a
          href="https://mhrise.wiki-db.com/sim/"
          target="_blank"
          rel="noreferrer"
        >
          スキルシミュレータ(泣)
        </a>
        で使用する場合は、以下をコピーしてください。
      </p>
      {talismans && (
        <CopyTargetText>{toSkillSimulatorText(talismans)}</CopyTargetText>
      )}
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
