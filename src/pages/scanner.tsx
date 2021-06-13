import Head from "next/head";
import { useEffect } from "react";
import ScannerComponent from "../components/scanner";
import { loadOpenCV } from "../scanner";

export default function Scanner() {
  // OpenCV.js の読み込みは時間がかかるので、先読みしておく
  useEffect(() => {
    loadOpenCV();
  }, []);

  return (
    <section>
      <Head>
        <title>スキャナー | 護石ツールズ</title>
      </Head>
      <h1>スキャナー</h1>
      <h2>使い方</h2>
      <p>
        モンスターハンターライズで「<b>アイテムＢＯＸ</b>」または「
        <b>錬金結果</b>」の画面を録画してください。
        録画中に護石が一瞬でも表示されているとその護石のデータを取り込みます。
      </p>
      <details>
        <summary>録画ファイルの作成方法</summary>
        <p>
          録画ファイルの作成は{" "}
          <a
            href="https://support.nintendo.co.jp/app/answers/detail/a_id/35057"
            target="_blank"
            rel="noopener noreferrer"
          >
            Switch のキャプチャーボタン長押しによる 30 秒録画機能
          </a>
          などでおこなうことができます。30 秒以内で「アイテムＢＯＸ」内を 2
          ページ分表示することができるので、Switch
          の録画機能ですべてスキャンしたい場合は 2 ページずつ録画してください。
        </p>
        <p>
          キャプチャーデバイスなどのツールによる録画にも対応しています。1280x720
          以上の任意の解像度に対応しています。ただし、出力映像のトリミング以外の編集は避けてください。アスペクト比の変更、色味の調整、画角の変更などには対応していません。
        </p>
      </details>
      <p>
        注意:
        護石に装飾品がついていると不正なスキル・レベルをスキャンします。かならず事前に
        <b>すべての装備の装飾品を外してから</b>録画してください。
      </p>
      <details>
        <summary>一括で装飾品を外す方法</summary>
        <p>
          次の手順で一括解除できます。
          <ol>
            <li>アイテムＢＯＸ を開く</li>
            <li>装備管理 を開く</li>
            <li>装飾品の着脱 を開く</li>
            <li>装備ＢＯＸ を開く</li>
            <li>一括解除 (マイナスボタン)</li>
          </ol>
        </p>
      </details>
      <ScannerComponent />
    </section>
  );
}
