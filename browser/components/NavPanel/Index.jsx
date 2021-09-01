import styles from '../../styles/navPanel/index.module.css'

import Plus from '../../assets/Plus'
import DollarSign from '../../assets/DollarSign'
import MessageCircle from '../../assets/MessageCircle'
import Info from '../../assets/Info'
import Tool from '../../assets/Tool'
import UserPlus from '../../assets/UserPlus'
import useUserProfile from '../../hooks/User/useUserProfile'
import { useModalStore } from '../../store/modal'
import { useRouter } from 'next/router'

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
                            {router.query.mission?
                                <MissionNavWithRole/>
                            :
                                <PageNavWithRole/>
                            }
                        </>
                    :
                        <PageNav/>
                    }
                </div>
            </div>
        }
        </>
    )
}

function MissionNavWithRole(){
    const router = useRouter()

    return(
        <>
            <a onClick={() => router.push(`/${router.query.page}/${router.query.mission.toLowerCase()}/new/edit`)}>
                <Plus color="#FAFAFA"/>
                <div>Paper</div>
            </a>

            <a>
                <DollarSign color="#FAFAFA"/>
                <div>Trade</div>
            </a>

            <a>
                <MessageCircle color="#FAFAFA"/>
                <div>Forum</div>
            </a>

            <a>
                <Tool color="#FAFAFA"/>
                <div>Manage</div>
            </a>
        </>
    )
}

function PageNavWithRole(){
    const setModal = useModalStore(state => state.setModal)

    return(
        <>
            <a onClick={() => setModal(4)}>
                <Plus color="#FAFAFA"/>
                <div>Mission</div>
            </a>

            <a>
                <DollarSign color="#FAFAFA"/>
                <div>Trade</div>
            </a>

            <a>
                <MessageCircle color="#FAFAFA"/>
                <div>Forum</div>
            </a>

            <a>
                <Tool color="#FAFAFA"/>
                <div>Manage</div>
            </a>
        </>
    )
}

function PageNav(){
    return(
        <>
            <a>
                <UserPlus color="#FAFAFA"/>
                <div>Follow</div>
            </a>

            <a>
                <DollarSign color="#FAFAFA"/>
                <div>Trade</div>
            </a>

            <a>
                <MessageCircle color="#FAFAFA"/>
                <div>Forum</div>
            </a>

            <a>
                <Info color="#FAFAFA"/>
                <div>Info ? or just display on left panel ?</div>
            </a>
        </>
    )
}