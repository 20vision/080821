import stylesDefault from "../styles/pageLayout/index.module.css"
import { useMenuStore } from '../store/defaultLayout'
import {Menu} from "../components/DefaultLayout/Menu"
import NavPanel from "../components/NavPanel/Index"
import Overview from "../components/Component/Overview";
import PageIcon from '../assets/PageIcon/PageIcon'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PageLayout( {children, comp, subs} ) {
    const [menu, setMenu] = useState('/')

    return (
        <div style={{color: 'var(--white)'}}>
            <div className={stylesDefault.zoomcontainer}>

                <div className={stylesDefault.pageInfo} style={{height: '90vh'}}>
                    <div className={stylesDefault.homescreen}>
                        <div className={stylesDefault.menu} style={{width: 350, marginRight: 'auto', marginLeft: 'auto', marginTop: 0}}>
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
                    <div style={{filter: `drop-shadow( 0px -20px 5px rgb(46, 46, 46, 1))`, marginTop: 'auto'}}>
                        <NavPanel/>
                    </div>
                </div>

            </div>
        </div>
    )
}