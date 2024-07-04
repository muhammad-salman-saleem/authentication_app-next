import "@/styles/globals.css";
import type { AppProps } from "next/app";
import connect from "../config/dbConnect";
import { store } from "../app/store";
import { Provider } from "react-redux";

connect();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
