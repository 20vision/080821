import styles from "../styles/forumLayout/index.module.css"
import menuStyle from "../styles/defaultLayout/menu.module.css"
import {Menu} from "../components/DefaultLayout/Menu"
import onClickOutside from "react-onclickoutside";
import { useRouter } from "next/router";
import { useState } from 'react'
import { useForumStore } from "../store/forum";

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
    const menu = useForumStore(state => state.menu)
    const setMenu = useForumStore(state => state.setMenu)

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    return(
        <div className={styles.child}>
            <div className={`${styles.menuContainer} ${menuStyle.container}`}>
                <div className={styles.menu}>
                    <ForumMenuNav/>
                    <Menu opened={true} setMenu={setMenu} pathname={menu}/>
                </div>
            </div>
            <div className={styles.previewContainer}>
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

function ForumMenuNav(){
    return(
        <div>
            <h1>Forum</h1>
            
        </div>
    )
}