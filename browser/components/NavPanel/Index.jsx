import styles from '../../styles/navPanel/index.module.css'

import Plus from '../../assets/Plus'
import DollarSign from '../../assets/DollarSign'
import Check from '../../assets/Check'
import MessageCircle from '../../assets/MessageCircle'
import Info from '../../assets/Info'
import Tool from '../../assets/Tool'
import Share from '../../assets/Share'
import UserPlus from '../../assets/UserPlus'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useModalStore } from '../../store/modal'
import { useRouter } from 'next/router'
import AddSub from '../../assets/AddSub'
import Loading from '../../assets/Loading/Loading'
import usePaperSocket from '../../hooks/Socket/usePaperSocket'
import Link from 'next/link'

import { useState } from 'react'

export default function Index() {
    const [profile, isLoading, setUser] = useUserProfile()
    const router = useRouter()

    return (
        <>
        {isLoading?
            null
        :
            <div className={styles.container}>
                <div className={styles.child}>
                    {profile.username?
                        <>
                            {router.pathname.split('/')[4] == 'edit'?
                                <PaperEdit/>             
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

function MissionNavWithRole({router}){
    return(
        <>  
            <a onClick={() => router.push(`/${router.query.page}/${router.query.mission}/new-paper/edit`)}>
                <Plus color="#FAFAFA"/>
                <div>Paper</div>
            </a>

            <a>
                <DollarSign color="#FAFAFA"/>
                <div>Trade</div>
            </a>

            <Link href={`/forum/${router.query.page}/mission/${router.query.mission}`}>
                <a>
                    <MessageCircle color="#FAFAFA"/>
                    <div>Forum</div>
                </a>
            </Link>

            <a>
                <Tool color="#FAFAFA"/>
                <div>Manage</div>
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
                <div>Trade</div>
            </a>

            <Link href={`/forum/${router.query.page}/page`}>
                <a>
                    <MessageCircle color="#FAFAFA"/>
                    <div>Forum</div>
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

            <Link href={`/forum/${router.query.page}/page`}>
                <a>
                    <MessageCircle color="#FAFAFA"/>
                    <div>Forum</div>
                </a>
            </Link>

            <a>
                <Info color="#FAFAFA"/>
                <div>Info ? or just display on left panel ?</div>
            </a>
        </>
    )
}


function PaperEdit(){
    const socket = usePaperSocket()
    const [saved, setSaved] = useState()

    return(
        <>
            <a>
                <Share color="#FAFAFA"/>
                <div>Publish</div>
            </a>

            <a>
                <Plus color="#FAFAFA"/>
                <div>Comment</div>
            </a>

            <a>
                <AddSub color="#FAFAFA"/>
                <div>Add Sub-</div>
            </a>

            {saved == true?

                <a>
                    <Check color="#FAFAFA"/>
                    <div>Saved</div>
                </a>

            :

                <a>
                    <Loading color="#FAFAFA"/>
                    <div>Saving...</div>
                </a>

            }
        </>
    )
}