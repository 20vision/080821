import styles from '../../styles/modal/index.module.css'
import onClickOutside from "react-onclickoutside";
import { useModalStore } from '../../store/modalStore'
import ConnectWallet from './ConnectWallet';
import { motion } from "framer-motion"

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
    }

    return (
        <div className={styles.modalContainer}>
            <motion.div 
            initial={{ height: '0%', width: '0%' }}
            animate={{ height: '100%', width: '100%' }}
            className={styles.modalChild}
            >

                {modalComp}

            </motion.div>
        </div>
    )

}, clickOutsideConfig)
