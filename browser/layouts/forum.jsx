import styles from "../styles/forumLayout/index.module.css"
import menuStyle from "../styles/defaultLayout/menu.module.css"
import {Menu} from "../components/DefaultLayout/Menu"
import onClickOutside from "react-onclickoutside";
import { useRouter } from "next/router";
import NavPanel from "../components/NavPanel/Index"
import { useState, useEffect } from 'react'
import ResizeObserver, { useResizeDetector } from 'react-resize-detector';
import Link from "next/link";

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
    const {width, height, ref} = useResizeDetector()
    const [minHeight, setMinHeight] = useState(0)

    useEffect(() => {
        if(menu){
            router.push(`/forum${menu}`)
        }
    }, [menu])

    Panel.handleClickOutside = () => {
        router.push(`/`)
    };

    useEffect(() => {
        if(height > minHeight){
            setMinHeight(height)
        }
    }, [height])
    return(
        <div className={`hideScrollBar ${styles.child}`}>
            <div className={`${styles.menuContainer} ${menuStyle.container}`}>
                <div className={styles.menu}>
                    <h1>Forum</h1>
                    <Menu opened={true} setMenu={setMenu} pathname={menu}/>
                </div>
            </div>
            <div className={styles.previewChild} ref={ref} style={{minHeight: minHeight}}>
                {children}
            </div>
            <div className={styles.postSelectionContainer}>
                <div className={styles.postSelection}>
                    <a>
                        <div className={`${styles.button} ${(router.query.index[1] == null)?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>All</h2>
                        </div>
                    </a>
                    <a>
                        <div className={`${styles.button} ${router.query.index[1]=="missions"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Missions</h2>
                        </div>
                    </a>
                    <a href={`/forum/${router.query.index[0]}/topics`}>
                        <div className={`${styles.button} ${router.query.index[1]=="topics"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Topics</h2>
                        </div>
                    </a>
                    <a>
                        <div className={`${styles.button} ${router.query.index[1]=="papers"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Papers</h2>
                        </div>
                    </a>
                    <a href={`/forum/${router.query.index[0]}/page`} style={{marginBottom: 'auto'}}>
                        <div className={`${styles.button} ${router.query.index[1]=="page"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Page</h2>
                        </div>
                    </a>
                    <NavPanel/>
                </div>
            </div>

        </div>
    )
}, clickOutsideConfig)