import '../styles/globals.css'
import {QueryClient, QueryClientProvider,} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'pintura/pintura.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletProvider from '../components/User/WalletProvider';

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient()

  return(
    <QueryClientProvider client={queryClient}>
      <WalletProvider/>
      <Component {...pageProps} />
      <ReactQueryDevtools/>
      <ToastContainer position="bottom-left" className={`ignore_click_outside_paper-image_modal ignore_click_outside_modal ignore_click_outside_page`}/>
    </QueryClientProvider>
  ) 
}

export default MyApp
