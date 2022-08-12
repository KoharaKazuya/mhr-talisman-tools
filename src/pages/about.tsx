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
          ツールの仕組みは
          <a
            href="https://github.com/toropippi/RiseGOSEKIcapture"
            target="_blank"
            rel="noreferrer"
          >
            RiseGOSEKIcapture
          </a>
          のアイデアから影響を受けました。
        </p>
        <p>
          出現確率の計算のためのデータは
          <a
            href="https://teddit.sethforprivacy.com/r/MonsterHunterMeta/comments/vnrktj/rmonsterhuntermetas_megathread_sunbreak_edition/"
            target="_blank"
            rel="noreferrer"
          >
            /r/MonsterHunterMeta&rsquo;s Megathread, Sunbreak Edition! Check
            here for sets &amp; builds! : MonsterHunterMeta
          </a>
          ,
          <a
            href="https://teddit.sethforprivacy.com/r/MonsterHunterMeta/comments/ud4j20/odds_for_any_charm/"
            target="_blank"
            rel="noreferrer"
          >
            Odds for any charm : MonsterHunterMeta
          </a>
          ,
          <a
            href="https://docs.google.com/spreadsheets/d/1XzmYu4TorITdiTXISp-te5Ee_E4HieCOCjVk-x-VLXg/edit#gid=708636111"
            target="_blank"
            rel="noreferrer"
          >
            alchemy(sunBreakPreRelease) - Google スプレッドシート
          </a>
          ,
          <a
            href="https://mhrise.kiranico.com/"
            target="_blank"
            rel="noreferrer"
          >
            Kiranico | Monster Hunter Rise: Sunbreak
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
