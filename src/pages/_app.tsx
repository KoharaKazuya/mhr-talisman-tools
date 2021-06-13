import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../components/header";
import { pageview } from "../lib/gtag";

export default function App({ Component, pageProps }: AppProps) {
  useGoogleAnalytics();

  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

function useGoogleAnalytics() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
