import Head from "next/head";
import BackupExport from "../components/backup-export";
import BackupImport from "../components/backup-import";
import ExportToSkillSimulator from "../components/export-to-skill-simulator";

export default function Interop() {
  return (
    <section>
      <Head>
        <title>インポート＆エクスポート | 護石ツールズ</title>
      </Head>
      <h1>インポート＆エクスポート</h1>
      <BackupExport />
      <BackupImport />
      <ExportToSkillSimulator />
    </section>
  );
}
