import '../styles/globals.css'
import {QueryClient, QueryClientProvider,} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'pintura/pintura.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import Head from 'next/head'
const WalletConnectionProvider = dynamic(() => import('../components/User/Wallet/WalletConnectionProvider'), {
  ssr: false,
});
const Index = dynamic(() => import('../components/Modal/Index'), {
  ssr: false,
});
import { useModalStore } from "../store/modal"

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient()
  const modal = useModalStore(state => state.modal)
  return(
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link rel="manifest" href="/images/site.webmanifest"/>
        <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>
      <WalletConnectionProvider>
        <QueryClientProvider client={queryClient}>
          {(modal > 0) ? <div className="ignore_click_outside_page"><Index/></div> : null}
          <Component {...pageProps}/>
          <ReactQueryDevtools/>
          <ToastContainer position="bottom-left" className={`ignore_click_outside_component-image_modal ignore_click_outside_modal ignore_click_outside_page`}/>
        </QueryClientProvider>
      </WalletConnectionProvider>
    </>
  ) 
}

export default MyApp
