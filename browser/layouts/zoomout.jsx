import stylesDefault from "../styles/pageLayout/index.module.css"
import { useMenuStore } from '../store/defaultLayout'
import {Menu} from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";
import PageIcon from '../assets/PageIcon/PageIcon'
import { useRouter } from "next/router";
import { useState } from "react";

export default function PageLayout( {children, comp, subs} ) {
    const [menu, setMenu] = useState('/')

    return (
        <div className={stylesDefault.container} style={{color: 'var(--white)'}}>
            <div className={stylesDefault.child}>

                <div className={stylesDefault.pageInfo}>
                    <div className={stylesDefault.homescreen}>
                        <div className={stylesDefault.menu} style={{width: 350, marginRight: 'auto', marginLeft: 'auto'}}>
                            <Menu opened={true} setMenu={setMenu} pathname={menu}/>
                        </div>
                        
                    </div>
                </div>

                <div className={stylesDefault.previewContainer}>
                    <div className={stylesDefault.previewChild}>
                        <main>
                            {children}
                        </main>
                    </div>
                </div>

                <div className={stylesDefault.overviewParent}>
                    <div className={`hideScrollBar ${stylesDefault.overviewChild}`} id='overviewId'>
                        {comp?<Overview subs={subs} comp={comp}/>:null}
                    </div>
                    <div style={{filter: `
                    drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`}}>
                        <NavPanel/>
                    </div>
                </div>

            </div>
        </div>
    )
}