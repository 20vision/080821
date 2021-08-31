import PageLayout from '../../../layouts/page'
import axios from 'axios'
import {useInfiniteQuery} from 'react-query'
import { useRouter } from 'next/router'
import Preview from '../../../components/Paper/Preview'

export default function index({page}) {
  const router = useRouter()

  const papers = useInfiniteQuery(
    `papers/${page.unique_pagename}/${router.query.mission}`,
    async () => {
        const res = await axios.get(`http://localhost:4000/get/papers/${page.unique_pagename}/${router.query.mission}`)
        return res.data
    },
    {
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 1000 * 60 * 60 * 24,
        onError: (error) => {
          console.error(error)
        },
    }
  )

  return (
    <PageLayout page={page}>
      <Preview/>
    </PageLayout>
  )
}


export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`http://localhost:4000/get/page/${context.params.page}`)
    return{
      props: {
        page: res.data.page
      }
    }
  }catch(error){
    return {
      notFound: true
    }
  }
}

