import styles from '../../styles/modal/index.module.css'
import onClickOutside from "react-onclickoutside"
import { useModalStore } from '../../store/modal'
import { motion } from "framer-motion"
import { useRouter } from 'next/router'
import {useUserStore} from '../../store/user'
import UserPages from './UserPages'
import ConnectWallet from './ConnectWallet'
import Component from './Component'
import User from "./User"
import CreateTopicOrMission from './CreateTopicOrMission'
import Trade from './Trade'
import { useEffect } from 'react'

export default function Modal() {

    return (
        <motion.div 
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        className={`ignore_click_outside_page ${styles.opacity}`}>

            {typeof window !== "undefined"?
                <ClickOutside outsideClickIgnoreClass={'ignore_click_outside_modal'}/>
            :
                null
            }
            
        </motion.div>
    )
}



const clickOutsideConfig = {
    handleClickOutside: () => ClickOutside.handleClickOutside
};
const ClickOutside = onClickOutside(() =>{
    const modal = useModalStore(state => state.modal)
    const setModal = useModalStore(state => state.setModal)
    const router = useRouter()
    const profile = useUserStore(state => state.profile)

    ClickOutside.handleClickOutside = () => setModal(0);

    useEffect(() => {
        if((modal == 5 && (!router.query.page && !router.query.index[0])) ||
          ((modal == 6) && (profile.username == null))){
            setModal(0)
        }

        if(modal > 1 && (profile.username == null)){
            setModal(1)
        }
    }, [])


    return (
        <div className={styles.modalContainer}>
            <motion.div 
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className={styles.modalChild}
            >
                {modal == 1?
                    <h1>
                        Coming soon
                    </h1>
                :
                    null
                }
                {/* {modal == 1 ?
                    <ConnectWallet/>
                :modal == 2 ?
                    <User/>
                :modal == 3 ?
                    <UserPages/>
                :modal == 4 ?
                    <CreateTopicOrMission type='mission'/>
                :modal == 5 ?
                    <Trade/>
                :modal == 6 ?
                    <CreateTopicOrMission type='topic'/>
                :modal == 7 ?
                    <Component/>
                :
                    null} */}

            </motion.div>
        </div>
    )

}, clickOutsideConfig)
