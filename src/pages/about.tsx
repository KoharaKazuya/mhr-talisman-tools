import Head from "next/head";

export default function About() {
  return (
    <section>
      <Head>
        <title>このサイトについて | 護石ツールズ</title>
      </Head>
      <h1>このサイトについて</h1>
      <section>
        <h2>開発</h2>
        <p>
          <a
            href="https://github.com/KoharaKazuya/mhr-talisman-tools"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
      </section>
      <section>
        <h2>謝辞</h2>
        <p>
          スキャンのための画像データは
          <a
            href="https://github.com/toropippi/RiseGOSEKIcapture"
            target="_blank"
            rel="noreferrer"
          >
            RiseGOSEKIcapture
          </a>
          のものを使用させていただいています。
        </p>
        <p>
          出現確率の計算のためのデータは
          <a
            href="https://www.reddit.com/r/MonsterHunterMeta/comments/mn1gmo/talisman_melding_probabilities_and_system_guide/"
            target="_blank"
            rel="noreferrer"
          >
            Talisman Melding Probabilities and System Guide : MonsterHunterMeta
          </a>
          および
          <a
            href="https://hyperwiki.jp/mhr/alchemy/"
            target="_blank"
            rel="noreferrer"
          >
            hyperWiki
          </a>
          を参考にさせていただいています。
        </p>
      </section>
    </section>
  );
}
