import '../styles/globals.css'
import {QueryClient, QueryClientProvider,} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'pintura/pintura.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
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
    <WalletConnectionProvider>
      <QueryClientProvider client={queryClient}>
        {(modal > 0) ? <div className="ignore_click_outside_page"><Index/></div> : null}
        <Component {...pageProps}/>
        <ReactQueryDevtools/>
        <ToastContainer position="bottom-left" className={`ignore_click_outside_component-image_modal ignore_click_outside_modal ignore_click_outside_page`}/>
      </QueryClientProvider>
    </WalletConnectionProvider>
  ) 
}

export default MyApp
