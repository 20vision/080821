import axios from 'axios'
import {useRouter} from 'next/router'
import { useState, useEffect } from 'react'
import config from '../../public/config.json'

const useAvatarToUrl = ({isPage}) => {
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState()
    const [err, setErr] = useState()
    const router = useRouter()
    
    useEffect(() => {
        if(image){
            setLoading(true)
            setErr(null)
            let formData = new FormData()
            formData.append("file", image)

            axios.post(`${config.HTTP_SERVER_URL}/update/${isPage?'page_picture/'+router.query.page:'profile_picture'}`,formData,{
                withCredentials: true
            }
            ).then(response => {
                setUrl(response.data.url)
            })
            .catch(error =>{
                if(error && error.response && error.response.status == 422){
                    setErr(error.response.data)
                }else{
                    setErr('An error occured while uploading your file')
                }
            })
            .then(() =>{
                setLoading(false)
            })
        }
    }, [image])

    return [loading, url, setImage, err, setErr]
}

export default useAvatarToUrl