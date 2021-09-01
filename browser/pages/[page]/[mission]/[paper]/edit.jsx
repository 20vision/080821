import PaperEditLayout from '../../../../layouts/paperEdit'
import {useQuery} from 'react-query' 
import { useRouter } from 'next/router'
import axios from 'axios'

export default function edit() {
    const router = useRouter()

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
                    router.push(`/${router.query.page}/${router.query.mission}`)
                }else{
                    console.error(error)
                }
            }
        }
    )

    return (
        <PaperEditLayout page={page}>
            <EditMain/>
        </PaperEditLayout>
    )
}

function EditMain(){
    return(
        <div>
            hello
        </div>
    )
}
