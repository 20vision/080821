import styles from '../../styles/modal/index.module.css'
import onClickOutside from "react-onclickoutside";
import { useModalStore } from '../../store/modal'
import { motion } from "framer-motion"

import UserPages from './UserPages';
import ConnectWallet from './ConnectWallet';
import User from "./User"

export default function Modal() {
    return (
        <motion.div 
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        className={styles.opacity}>

            <ClickOutside/>
            
        </motion.div>
    )
}



const clickOutsideConfig = {
    handleClickOutside: () => ClickOutside.handleClickOutside
};
const ClickOutside = onClickOutside(() =>{
    const modal = useModalStore(state => state.modal)
    const setModal = useModalStore(state => state.setModal)

    ClickOutside.handleClickOutside = () => setModal(0);

    let modalComp
    if(modal == 1){
        modalComp = <ConnectWallet/>
    }else if(modal == 2){
        modalComp = <User/>
    }else if(modal == 3){
        modalComp = <UserPages/>
    }

    return (
        <div className={styles.modalContainer}>
            <motion.div 
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className={styles.modalChild}
            >

                {modalComp}

            </motion.div>
        </div>
    )

}, clickOutsideConfig)
