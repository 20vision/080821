import styles from "../styles/forumLayout/index.module.css"
import menuStyle from "../styles/defaultLayout/menu.module.css"
import {Menu} from "../components/DefaultLayout/Menu"
import onClickOutside from "react-onclickoutside";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'

export default function PageLayout( {children, page, missions} ) {
    return (
        <>  
            <div className={styles.container}>
                <Panel children={children} outsideClickIgnoreClass={'ignore_click_outside_page'}/>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Panel.handleClickOutside
}

var Panel = onClickOutside(({children}) => {
    const router = useRouter()
    const [menu, setMenu] = useState()

    useEffect(() => {
        if(menu){
            router.push(`/forum${menu}`)
        }
    }, [menu])

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={`hideScrollBar ${styles.child}`}>
            <div className={`${styles.menuContainer} ${menuStyle.container}`}>
                <div className={styles.menu}>
                    <h1>Forum</h1>
                    <Menu opened={true} setMenu={setMenu} pathname={menu}/>
                </div>
            </div>
            <div>
                <div className={styles.previewChild}>
                    {children}
                </div>
            </div>
            <div className={styles.postSelectionContainer}>
                <div className={styles.postSelection}>
                -post selection-
                </div>
            </div>

        </div>
    )
}, clickOutsideConfig)