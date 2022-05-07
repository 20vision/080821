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
import { isBrowser } from 'react-device-detect';

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient()
  const modal = useModalStore(state => state.modal)

  if(isBrowser){
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
  }else{
    return(
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', left: 35, right: 35, top:35, bottom: 35, minWidth: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src="/images/mobileVersionPreview.png" style={{borderRadius: 35, opacity: '0.3', maxWidth: '100%', height: 'auto', maxHeight: '100%'}}/>
        </div>
        <div style={{position: 'absolute', top: 15, left: 15, display: 'flex', alignItems: 'center'}}><img src="/images/20Vision.png"/><h1 style={{color: '#FAFAFA'}}>20Vision</h1></div>
        <h1 style={{position: 'absolute', color: 'var(--white)', lineHeight: 1.5, fontSize: 30, margin: 35}}>
          Sorry, we are currently desktop only.<br/>
          Our mobile app is in development
        </h1>
      </div>
    )
  }
}

export default MyApp
