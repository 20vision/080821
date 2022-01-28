import styles from "../styles/forumLayout/index.module.css"
import menuStyle from "../styles/defaultLayout/menu.module.css"
import {Menu} from "../components/DefaultLayout/Menu"
import onClickOutside from "react-onclickoutside";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import ResizeObserver, { useResizeDetector } from 'react-resize-detector';
import Plus from "../assets/Plus";

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
        console.log(router)
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
                    <a>
                        <div className={`${styles.button} ${router.query.index[1]=="topics"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Topics</h2>
                            <Plus color={router.query.index[1]=="topics"?'#FF5B77':'#FAFAFA4D'}/>
                        </div>
                    </a>
                    <a>
                        <div className={`${styles.button} ${router.query.index[1]=="papers"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Papers</h2>
                        </div>
                    </a>
                    <a>
                        <div className={`${styles.button} ${router.query.index[1]=="page"?styles.selected:null}`}>
                            <div className={styles.highlight}/>
                            <h2>Page</h2>
                        </div>
                    </a>
                </div>
            </div>

        </div>
    )
}, clickOutsideConfig)