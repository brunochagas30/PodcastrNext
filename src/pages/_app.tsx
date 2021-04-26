import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>

      <Player />
    </div>
  );
}
// app é algo global, que fica em volta de todas as paginas. Sempre que tem algo que precisa em todas as páginas, pode colocar no _app
// A parte de fontes não é muito interessante pq ele recarrega todas as vezes...
export default MyApp;
