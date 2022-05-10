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

export default function Index() {
    const [profile, isLoading, setUser] = useUserProfile()
    const router = useRouter()
    const page = usePageSelectedStore(state => state.page)

    if(!page && (router.pathname.split('/')[1] == 'forum')) return(<></>)


    if(config.HTTP_SERVER_URL != 'http://localhost:8080'){
        return null
    }else{
        return(
            <>
            {isLoading || !profile.username?
                null
            :
                <div className={styles.container}>
                    <div className={styles.child} style={{color: 'var(--white)'}}>
                        {profile.username?
                            <>
                                {router.pathname.split('/')[1] == 'zoomout'?     
                                    <ForumNav router={router}/>
                                :router.query.component?
                                    <ComponentNav router={router}/>
                                :router.query.mission?
                                    <MissionNavWithRole router={router}/>
                                :
                                    <PageNavWithRole router={router}/>
                                }
                            </>
                        :
                            <PageNav router={router}/>
                        }
                    </div>
                </div>
            }
            </>
        )
    }
}

function MissionNavWithRole({router}){
    const setModal = useModalStore(state => state.setModal)
    return(
        <>  
            <a onClick={() => setModal(7)}>
                <Plus color="#FAFAFA"/>
                <div>Component</div>
            </a>

            <a onClick={() => setModal(5)}>
                <DollarSign color="#FAFAFA"/>
                <div>Token</div>
            </a>

            <Link href={`/zoomout?page=${router.query.page}&mission=${router.query.mission}`}>
                <a>
                    <ZoomOut color="#FAFAFA"/>
                    <div>Zoom Out</div>
                </a>
            </Link>

            <a>
                <Tool color="#FAFAFA"/>
                <div>Manage</div>
            </a>
        </>
    )
}

function ComponentNav({router}){
    const setModal = useModalStore(state => state.setModal)
    const setEditMode = useComponentStore(state => state.setEditMode)
    const editMode = useComponentStore(state => state.editMode)
    const [profile, isLoading, setUser] = useUserProfile()
    const [saved, setSaved] = useState()

    useEffect(() => {
        async function AsyncFunction(){
            try{
                console.log((await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/saved`, {withCredentials: true})).data)
                setSaved((await axios.get(`${config.HTTP_SERVER_URL}/get/component/${router.query.component}/saved`, {withCredentials: true})).data==0?false:true)
            }catch(err){
                console.log(err)
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
                </>
            :
                <>
                    {saved==false?
                        <a onClick={() => {
                            axios.post(`${config.HTTP_SERVER_URL}/post/component/save`, {uid: router.query.component}, {withCredentials: true})
                            .then(async response => {
                                //toast.success('Saved Component')
                                setSaved(true)
                            })
                            .catch(error => {
                                console.log(error)
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
                                console.log(error)
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
            }

            {/* <a onClick={() => setModal(5)}>
                    <DollarSign color="#FAFAFA"/>
                    <div>Token</div>
                </a> */}

            {/* <Link href={`/zoomout?page=${router.query.page}&mission=${router.query.mission}&component=${router.query.component}`}>
                <a>
                    <ZoomOut color="#FAFAFA"/>
                    <div>Zoom Out</div>
                </a>
            </Link> */}
            <a onClick={() => {
                setEditMode(!editMode)
            }}>
                {editMode?<Check color="#FAFAFA"/>:<Tool color="#FAFAFA"/>}
                <div>{editMode?'Finish':'Edit'}</div>
            </a>
        </>
    )
}

function PageNavWithRole({router}){
    const setModal = useModalStore(state => state.setModal)
    return(
        <>
            <a onClick={() => setModal(4)}>
                <Plus color="#FAFAFA"/>
                <div>Mission</div>
            </a>

            <a onClick={() => setModal(5)}>
                <DollarSign color="#FAFAFA"/>
                <div>Token</div>
            </a>

            <Link href={`/zoomout?page=${router.query.page}`}>
                <a>
                    <ZoomOut color="#FAFAFA"/>
                    <div>Zoom Out</div>
                </a>
            </Link>

            <a>
                <Tool color="#FAFAFA"/>
                <div>Manage</div>
            </a>
        </>
    )
}

function PageNav({router}){
    const setModal = useModalStore(state => state.setModal)
    return(
        <>
            <a>
                <UserPlus color="#FAFAFA"/>
                <div>Follow</div>
            </a>

            <a onClick={() => setModal(5)}>
                <DollarSign color="#FAFAFA"/>
                <div>Trade</div>
            </a>

            <Link href={`/zoomout?page=${router.query.page}`}>
                <a>
                    <ZoomOut color="#FAFAFA"/>
                    <div>Zoom Out</div>
                </a>
            </Link>

            <a>
                <Info color="#FAFAFA"/>
                <div>Info</div>
            </a>
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