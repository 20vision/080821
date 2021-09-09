import PaperEditLayout from '../../../../layouts/paperEdit'
import {useQuery} from 'react-query' 
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState, useEffect, useContext, useCallback } from 'react'
import dynamic from 'next/dynamic'
const Edit = dynamic(
    () => import('../../../../components/PaperEdit/Index'),
    {ssr : false}
)


export default function edit() {
    const router = useRouter()
    const [papers, setPapers] = useState()

    const page = useQuery(
        `page/${router.query.page}`,
        async () => {
            const res = await axios.get(`http://localhost:4000/get/page/${router.query.page}?missions=false&role=0`,{withCredentials: true})
            return res.data.page
        },
        {
            enabled: router.isReady,
            refetchOnWindowFocus: false,
            refetchOnmount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 1000 * 60 * 60 * 24,
            onError: (error) => {
                if(error.response.status == '403'){
                    router.push(`/${router.query.page}`)
                }else{
                    console.error(error)
                }
            }
        }
    )

    return (
        <>
        {page.data?
            <PaperEditLayout page={page.data}>
                <Edit/>
            </PaperEditLayout>
        :
            null
        }
        </>
    )
}
