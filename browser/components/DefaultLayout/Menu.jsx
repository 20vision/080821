import { useMenuStore } from '../../store/defaultLayoutStore'
import Chevron from '../../assets/Chevron'
import styles from '../../styles/defaultLayout/menu.module.css'
import { motion } from "framer-motion"

export default function Index() {
    const opened = useMenuStore(state => state.opened)
    const variants = {
        opened: {
            height: '100%'
        },
        closed: {
            height: (typeof window !== 'undefined')?(((35 * 100) / window.screen.height)+'%'):null
        }
    }
    return (
        <div className={styles.container}>
            <motion.div 
                className={styles.dropdown}
                initial={"closed"}
                animate={opened ? "opened" : "closed"}
                variants={variants}
                transition={{ type: "spring", bounce: opened?0.25:0.13, duration: 0.8}}
            >

                <MenuNav/>
                { opened ? <Menu/> : null}
            </motion.div>
        </div>
    )
}


function MenuNav() {
    const opened = useMenuStore(state => state.opened)
    const toggle = useMenuStore(state => state.toggle)

    return (
        <div className={styles.navContainer}>
            <a onClick={toggle}><Chevron color="#FAFAFA" direction={(opened == true)?null:"180"}/></a>
            <div className={styles.header}>
                
                {opened == true ? <h1>Menu</h1>:<h1>Discover</h1>}

                <span className={styles.brand}>20Vision</span>
            </div>
        </div>
    )
}

function Menu() {
    return (
        <div className="menu">
            Hello
        </div>
    )
}

