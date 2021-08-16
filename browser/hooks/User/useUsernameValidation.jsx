import { useState, useEffect } from "react"
import axios from 'axios'

const useUsernameValidation = () => {
    const [username, setUsername] = useState('')
    const [valid, setValid] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(null)
    const regex = /^[a-z0-9_.]*$/


    useEffect(() => {
        setErrorMsg('')
        clearTimeout(timer)
        setTimer(null)
        setValid(false)
        if(username.length < 1){
            setLoading(false)
        }else if(username.length > 30){
            setLoading(false)
            setErrorMsg('Usernames can have 30 characters at most')
        }else if(!regex.test(username)){
            setLoading(false)
            setErrorMsg('Usernames can only contain letters, numbers, dots and underscores')
        }else{
            setLoading(true)
            setTimer(setTimeout(() => {
                if(username.length < 4){
                    setErrorMsg('@'+username+' is not a valid username')
                    setLoading(false)
                }else{
                    axios.post('http://localhost:4000/get/username_unique',{username: username}
                    ).then(response => {
                        setValid(true)
                    })
                    .catch(error =>{
                        if(error.response.status == 422){
                            setErrorMsg('@'+username+' is already taken')
                        }else{
                            setErrorMsg('Error: ' + error.response.status+'\n'+error.response.data)
                        }
                    })
                    .then(() =>{
                        setLoading(false)
                    })
                }
            }, 1000))
        }
    }, [username])

    return [username, setUsername, valid, errorMsg, loading]
}

export default useUsernameValidation