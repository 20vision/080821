import PageLayout from '../../../layouts/page'
import axios from 'axios'
import {useInfiniteQuery} from 'react-query'
import {usePageSelectedStore} from '../../../store/pageSelected'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function index({page, missions}) {
  const setPageSelection = usePageSelectedStore(state => state.setPageSelection)

  useEffect(() => {
    if(page){
      setPageSelection(page)
    }
  }, [page])

  const router = useRouter()

  const papers = useInfiniteQuery(
    `papers/${page.unique_pagename}`,
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
    <PageLayout page={page} missions={missions}>
    </PageLayout>
  )
}


export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`http://localhost:4000/get/page/${context.params.page}?missions=true`)
    return{
      props: {
        page: res.data.page,
        missions: res.data.missions
      }
    }
  }catch(error){
    return {
      notFound: true
    }
  }
}

