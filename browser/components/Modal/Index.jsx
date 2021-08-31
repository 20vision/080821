import styles from '../../styles/modal/index.module.css'
import onClickOutside from "react-onclickoutside";
import { useModalStore } from '../../store/modal'
import { motion } from "framer-motion"

import UserPages from './UserPages';
import ConnectWallet from './ConnectWallet';
import User from "./User"
import CreateMission from './CreateMission';

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

    return (
        <div className={styles.modalContainer}>
            <motion.div 
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            className={styles.modalChild}
            >

                {modal == 1 ?
                    <ConnectWallet/>
                :modal == 2 ?
                    <User/>
                :modal == 3 ?
                    <UserPages/>
                :modal == 4 ?
                    <CreateMission/>
                :null}

            </motion.div>
        </div>
    )

}, clickOutsideConfig)
