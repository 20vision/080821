import axios from 'axios'

import {useUserStore} from '../../store/user'

import { useEffect, useState } from 'react'

const useUserProfile = () => {

    const profile = useUserStore(state => state.profile)
    const setUser = useUserStore(state => state.setUser)

    const [isLoading, setLoading] = useState(false)
    
    useEffect(() =>{
        if(profile.fetched == false){
            setLoading(true)
            axios.get('http://localhost:4000/get/user_profile',{
                withCredentials: true
            })
            .then(response => {
                let newProfile = null
                newProfile = response.data
                newProfile.fetched = true
                setUser(newProfile)
            })
            .catch(error => {
                console.error(error)
                let newProfile = {
                    username: null,
                    profilePicture: null,
                    fetched: true
                }
                setUser(newProfile)
            })
            .then(() => {
                setLoading(false)
            })
    
        }
    }, [profile])

    return [profile, isLoading, setUser]

}

export default useUserProfile