import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UtilsProvider } from '../contexts/UtilsContext';
import { PolkadotProvider } from '../contexts/PolkadotContext';
import { UniqueVaraProvider } from '../contexts/UniqueVaraContext';
import { EnvironmentProvider } from '../contexts/EnvironmentContext';
import Header from '../components/layout/Header';
import '../public/css/daos.css';
import '../public/css/ideas.css';
import '../public/output.css';
import '../public/theme.css';

function MyApp({ Component, pageProps }) {
  return (
    <UtilsProvider>
      <UniqueVaraProvider>
      <PolkadotProvider>
        <EnvironmentProvider>
          <ThemeProvider defaultTheme={'dark'} enableColorScheme={false} attribute="class" enableSystem={false}>
            <Header />
            <Component {...pageProps} />
            <ToastContainer hideProgressBar={false} position="top-right" autoClose={3000} newestOnTop={false} closeOnClick rtl={false} draggable pauseOnHover theme="light" />
          </ThemeProvider>
        </EnvironmentProvider>
      </PolkadotProvider>
      </UniqueVaraProvider>
    </UtilsProvider>
  );
}

export default MyApp;
