import "../styles/globals.scss";  // If you're using global styles
import type { AppProps } from "next/app";
import TopBar from "../components/TopBar";  // Adjust the path based on your component

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;