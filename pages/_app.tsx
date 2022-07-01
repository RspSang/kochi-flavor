import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GA_TRACKING_ID, pageview } from "@libs/client/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="mx-auto w-full max-w-xl font-notoSans">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
