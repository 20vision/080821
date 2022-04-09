import { useState, useEffect } from "react"
import axios from 'axios'

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
        }else if(newPagename.length > 50){
            setValidPagenameLoading(false)
            setPagenameError('Pagenames can have 50 characters at most')
        }else if(!regex.test(newPagename)){
            setValidPagenameLoading(false)
            setPagenameError('Pagenames can only contain letters, numbers, dots and underscores')
        }else{
            setTimer(setTimeout(() => {
                if(newPagename.length < 4){
                    setPagenameError('/'+newPagename.toLowerCase()+' is not available')
                    setValidPagenameLoading(false)
                }else{
                    axios.post('http://localhost:8080/get/pagename_unique',{pagename: newPagename}
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