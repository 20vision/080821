import axios from 'axios'
import { useState, useEffect } from 'react'

const useAvatarToUrl = () => {
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState()
    const [err, setErr] = useState()

    useEffect(() => {
        if(image){
            setLoading(true)
            setErr(null)
            let formData = new FormData()
            formData.append("file", image)

            axios.post('http://localhost:4000/update/profile_picture',formData,{
                withCredentials: true
            }
            ).then(response => {
                setUrl(response.data.url)
            })
            .catch(error =>{
                if(error.response.status == 422){
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