import { useState, useEffect } from "react"
import axios from 'axios'
import config from '../../public/config.json'

const usePagenameValidation = () => {
    const regex = /^[a-zA-Z0-9_.]*$/

    const [newPagename, setNewPagename] = useState('')
    const [pagename, setPagename] = useState('')
    const [pagenameError, setPagenameError] = useState('')
    const [validPagenameLoading, setValidPagenameLoading] = useState(false)
    const [timer, setTimer] = useState(null)

    useEffect(() => {
        clearTimeout(timer)
        setTimer(null)
        setPagename('')
        setPagenameError('')
        setValidPagenameLoading(true)
        if(newPagename.length < 1){
            setValidPagenameLoading(false)
        }else if(newPagename.length > 30){
            setValidPagenameLoading(false)
            setPagenameError('Unique Pagenames can have 30 characters at most')
        }else if(!regex.test(newPagename)){
            setValidPagenameLoading(false)
            setPagenameError('Unique Pagenames can only contain letters, numbers, dots and underscores')
        }else{
            setTimer(setTimeout(() => {
                if(newPagename.length < 4){
                    setPagenameError('/'+newPagename.toLowerCase()+' is not available')
                    setValidPagenameLoading(false)
                }else{
                    axios.post(`${config.HTTP_SERVER_URL}/get/pagename_unique`,{pagename: newPagename}
                    ).then(response => {
                        setPagename(newPagename)
                    })
                    .catch(error =>{
                        if(error.response.status == 422){
                            setPagenameError('/'+newPagename+' is already taken')
                        }else{
                            setPagenameError('Error: ' + error.response.status+'\n'+error.response.data)
                        }
                    })
                    .then(() =>{
                        setValidPagenameLoading(false)
                    })
                }
            }, 1000))
        }
    }, [newPagename])

    return [setNewPagename, pagename, pagenameError, validPagenameLoading]
}

export default usePagenameValidation