import '../styles/globals.css'
import {QueryClient, QueryClientProvider,} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import 'pintura/pintura.css';

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient()

  return(
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools/>
    </QueryClientProvider>
  ) 
}

export default MyApp
