import { useState, useEffect } from "react"
import axios from 'axios'
import useUserProfile from './useUserProfile'

const useUsernameValidation = () => {
    const [profile, isLoading, setUser] = useUserProfile()
    const [username, setUsername] = useState('')
    const [valid, setValid] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(null)
    const regex = /^[a-z0-9_.]*$/

    function publishNewUsername(){
        if((valid == true )&&(username != profile.username)){
            setLoading(true)
            axios.post('http://localhost:8080/update/username',{username: username},{
            withCredentials: true
            }).then(response => {
                let newProfile = profile
                newProfile.username = username
                setUser(newProfile)
                setLoading(false)
            })
            .catch(error =>{
                setErrorMsg(error.response.data)
                setLoading(false)
            })
        }
    }

    useEffect(() => {
        setErrorMsg('')
        if(timer){
            clearTimeout(timer)
            setTimer(null)
        }
        if(profile.username != username){
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
                        axios.post('http://localhost:8080/get/username_unique',{username: username}
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
        }else{
            setLoading(false)
        }
    }, [username])

    return [username, setUsername, valid, errorMsg, loading, publishNewUsername]
}

export default useUsernameValidation