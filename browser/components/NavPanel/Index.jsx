import styles from '../../styles/navPanel/index.module.css'

import Plus from '../../assets/Plus'
import DollarSign from '../../assets/DollarSign'
import Check from '../../assets/Check'
import Info from '../../assets/Info'
import Tool from '../../assets/Tool'
import Share from '../../assets/Share'
import UserPlus from '../../assets/UserPlus'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useModalStore } from '../../store/modal'
import { useRouter } from 'next/router'
import AddSub from '../../assets/AddSub'
import Loading from '../../assets/Loading/Loading'
import Link from 'next/link'
import ZoomOut from '../../assets/ZoomOut'
import ZoomIn from '../../assets/ZoomIn'
import config from '../../public/config.json'
import { useEffect, useState } from 'react'
import { usePageSelectedStore } from '../../store/pageSelected'
import axios from 'axios'
import { toast } from 'react-toastify'
import DownloadCloud from '../../assets/DownloadCloud'
import UploadCloud from '../../assets/UploadCloud'
import { useComponentStore } from '../../store/component'
import Cloud from '../../assets/cloud'
import SavedToCloud from '../../assets/SavedToCloud'
import Trash from '../../assets/Trash'
import Flag from '../../assets/Flag'
import SolanaLogoMarkWhite from '../../assets/solanaLogoMarkWhite'
import UserCheck from '../../assets/UserCheck'
import User from '../../assets/User'
import Discover from '../../assets/Discover'

export default function Index({comp}) {
    const [profile, isLoading, setUser] = useUserProfile()
    const router = useRouter()
    const page = usePageSelectedStore(state => state.page)

    if(!page && (router.pathname.split('/')[1] == 'forum')) return(<></>)

    return(
        <div className={styles.container}>
            <div className={styles.child} style={{color: 'var(--white)'}}>
                {router.pathname.split('/')[1] == 'zoomout'?     
                    <ForumNav router={router}/>
                :router.query.component?
                    <ComponentNav router={router}/>
                :
                    <PageNav router={router} profile={profile} comp={comp}/>
                }
            </div>
        </div>
    )
}

// function MissionNavWithRole({router}){
//     const setModal = useModalStore(state => state.setModal)
//     return(
//         <>  
//             <a onClick={() => setModal(7)}>
//                 <Plus color="#FAFAFA"/>
//                 <div>Component</div>
//             </a>

//             <a onClick={() => setModal(5)}>
//                 <DollarSign color="#FAFAFA"/>
//                 <div>Token</div>
//             </a>

//             <Link href={`/zoomout?page=${router.query.page}&mission=${router.query.mission}`}>
//                 <a>
//                     <ZoomOut color="#FAFAFA"/>
//                     <div>Zoom Out</div>
//                 </a>
//             </Link>

//             <a>
//                 <Tool color="#FAFAFA"/>
//                 <div>Manage</div>
//             </a>
//         </>
//     )
// }

function ComponentNav({router}){
    const setModal = useModalStore(state => state.setModal)
    const setEditMode = useComponentStore(state => state.setEditMode)
    const editMode = useComponentStore(state => state.editMode)
    const [profile, isLoading, setUser] = useUserProfile()
    const [saved, setSaved] = useState()
    const [hasRole, setHasRole] = useState()

    useEffect(() => {
        if(!profile.username) return
        async function AsyncFunction(){
            try{
                setSaved((await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/saved`, {withCredentials: true})).data==0?false:true)
            }catch(err){
                console.log((err && err.response)?err.response:err)
            }
            try{
                if(hasRole == null) setHasRole((await axios.get(`${config.HTTP_SERVER_URL}/get/page/${router.query.page}/role`, {withCredentials: true})).data)
            }catch(err){
                console.log((err && err.response)?err.response:err)
            }
        }
        if(profile.username) AsyncFunction()
    }, [profile])

    return(
        <>  
            {editMode?
                <>
                    <a onClick={() => setModal(7)}>
                        <Plus color="#FAFAFA"/>
                        <div>Component</div>
                    </a>

                    <a onClick={() => setModal(8)}>
                        <DownloadCloud color="#FAFAFA"/>
                        <div>Add Sub-</div>
                    </a>

                    <a onClick={() => setModal(9)}>
                        <Trash color="#FAFAFA"/>
                        <div>Delete</div>
                    </a>
                </>
            :profile.username?
                <>
                    {saved==false?
                        <a onClick={() => {
                            axios.post(`${config.HTTP_SERVER_URL}/post/component/save`, {uid: router.query.component}, {withCredentials: true})
                            .then(async response => {
                                //toast.success('Saved Component')
                                setSaved(true)
                            })
                            .catch(error => {
                                console.log((error && error.response)?error.response:error)
                                toast.error('Could not save Component')
                            })
                        }}>
                            <UploadCloud color="#FAFAFA"/>
                            <div>Save</div>
                        </a>
                    :saved==true?
                        <a onClick={() => {
                            axios.post(`${config.HTTP_SERVER_URL}/update/component/save`, {uid: router.query.component}, {withCredentials: true})
                            .then(async response => {
                                //toast.success('U Component')
                                setSaved(false)
                            })
                            .catch(error => {
                                console.log((error && error.response)?error.response:error)
                                toast.error('Could not unsave Component')
                            })
                        }}>
                            <SavedToCloud color="#FAFAFA"/>
                            <div>Saved</div>
                        </a>
                    :
                        <a style={{opacity: 0.3}}>
                            <Cloud color="#FAFAFA"/>
                            <div>Loading...</div>
                        </a>
                    }
                </>
            :null}

            {hasRole?
                <a onClick={() => {
                    setEditMode(!editMode)
                }}>
                    {editMode?<Check color="#FAFAFA"/>:<Tool color="#FAFAFA"/>}
                    <div>{editMode?'Finish':'Edit'}</div>
                </a>
            :profile.username?
                // <a onClick={() => setModal(10)}>
                //     <Flag color="var(--white)"/>
                //     <div>Report</div>
                // </a>
                null
            :
                <a onClick={() => setModal(1)}>
                    <SolanaLogoMarkWhite/>
                    <div>Connect</div>
                </a>
            }

            {/* {router.pathname == '/'?
                

            } */}
        </>
    )
}

function PageNav({router, profile, comp}){
    const setModal = useModalStore(state => state.setModal)
    const [hasRole, setHasRole] = useState()
    const following = usePageSelectedStore(state => state.following)
    const setFollowing = usePageSelectedStore(state => state.setFollowing)
    
    useEffect(() => {
        setFollowing(null)
        if(!profile.username) return
        if(!router.query.page) return
        async function AsyncFunction(){
            try{
                setFollowing((await axios.get(`${config.HTTP_SERVER_URL}/get/following/${router.query.page}`, {withCredentials: true})).data)
            }catch(err){
                console.log((err && err.response)?err.response:err)
            }
        }
        if(profile.username) AsyncFunction()
    }, [profile.username, router.query.page])

    useEffect(() => {
        if(!profile.username) return
        async function AsyncFunction(){
            try{
                if(hasRole == null) setHasRole((await axios.get(`${config.HTTP_SERVER_URL}/get/page/${router.query.page}/role`, {withCredentials: true})).data)
            }catch(err){
                console.log((err && err.response)?err.response:err)
            }
        }
        if(profile.username) AsyncFunction()
    }, [profile])

    return(
        <>
            {profile && profile.username?
                <>
                    {hasRole?
                        <a onClick={() => {
                            if(router.query.mission) return setModal(7)
                            setModal(4)
                        }}>
                            <Plus color="#FAFAFA"/>
                            <div>{router.query.mission?'Component':'Mission'}</div>
                        </a>
                    :router.query.page?
                        <a onClick={() => {
                            const oldFollowing = following
                            setFollowing(!following)
                            axios.post(`${config.HTTP_SERVER_URL}/update/follow/${router.query.page}`, null, {withCredentials: true})
                            .then((response) => {
                                // if(response.data == true) toast.success('Followed')
                                // if(response.data == false) toast.success('Unfollowed')
                            })
                            .catch(err => {
                                toast.error('Follow error. Please try again later')
                                console.log((err && err.response)?err.response:err)
                                setFollowing(oldFollowing)
                            })
                        }}>
                            {(following == false)?
                                <UserPlus color="#FAFAFA"/>
                            :following == true?
                                <UserCheck color="#FAFAFA"/>
                            :
                                <User color="#FAFAFA"/>
                            }
                            <div>{following?'Following':'Follow'}</div>
                        </a> 
                    :null}
                </>
            :null
            }

            {/* <a onClick={() => setModal(5)}>
                <DollarSign color="#FAFAFA"/>
                <div>Token</div>
            </a> */}

            {comp?
                <Link href={`/${comp.unique_pagename}`}><a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    <div>Page</div>
                </a></Link>
            :profile && profile.username?
                <Link href={`/`}><a>
                    <Discover color="var(--white)"/>
                    <div>Discover</div>
                </a></Link>
            :null}

            {/* <Link href={`/zoomout?page=${router.query.page}`}>
                <a>
                    <ZoomOut color="#FAFAFA"/>
                    <div>Zoom Out</div>
                </a>
            </Link> */}

            {profile && profile.username && hasRole?
                <a onClick={() => setModal(11)}>
                    <Tool color="#FAFAFA"/>
                    <div>Manage</div>
                </a>
            :null}

            {!profile.username?<a onClick={() => setModal(1)}>
                <SolanaLogoMarkWhite/>
                <div>Connect</div>
            </a>:null}
        </>
    )
}

function ForumNav({router}){
    const setModal = useModalStore(state => state.setModal)
    return(
        <>  
            {/* <a onClick={() => setModal(6)}>
                <Plus color="#FAFAFA"/>
                <div>Topic</div>
            </a>

            <a onClick={() => setModal(5)}>
                <DollarSign color="#FAFAFA"/>
                <div>Token</div>
            </a> */}
        </>
    )
}