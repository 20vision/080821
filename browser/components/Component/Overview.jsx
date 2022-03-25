import styles from '../../styles/component/overview.module.css'
import pageLayoutStyle from "../../styles/pageLayout/index.module.css"
import Link from 'next/link'
import config from '../../public/config.json';
import { useEffect } from 'react';

export default function Overview({comp, subs}){

    useEffect(() => {
        console.log(subs)
    })

    return(
        <div className={styles.parent}>
            <div style={{display:'flex'}}>
                {subs.length>0?
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{flexGrow: '1'}}/>
                        <Start type={comp.type}/>
                        <Branch type={comp.type}/>
                    </div>
                :
                    null
                }
                <div className={`${styles.componentParent}`}>
                    <ContentRow data={comp}/>
                </div>
            </div>
            {subs && subs.map((sub, index) => {
                return(
                    <div key={index} style={{display:'flex'}}>
                        {index == subs.length-1?
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Branch type={comp.type}/>
                                <div style={{marginTop: '-7px'}}>
                                    <Split type={comp.type}/>
                                </div>
                                <div style={{flexGrow: '1'}}/>
                            </div>
                        :
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Branch type={comp.type}/>
                                <div style={{marginTop: '-7px'}}>
                                    <Split type={comp.type}/>
                                </div>
                                <div style={{flexGrow: '1'}}/>
                            </div>
                        }
                        <div className={`${styles.subParent}`}>
                            <ContentRow data={sub}/>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const ContentRow = ({data}) => {
    return(
        <Link href={`/${data.unique_pagename}/${data.mission_title}/${data.uid}`}>
            <a>
                <div className={pageLayoutStyle.dependent}>
                    <div className={pageLayoutStyle.info}>
                        <div className={pageLayoutStyle.header}>
                            <h3>{data.header}</h3>
                        </div>
                        <div className={pageLayoutStyle.footer}>
                            <span style={{fontSize: 12,color: data.type == 'p'?'var(--blue)':data.type == 's'?'var(--yellow)':'var(--green)'}}>{data.type == 'p'?'Product':data.type == 's'?'Service':'Result'}</span>&nbsp;
                            <span style={{fontSize: 12}}>· /{data.unique_pagename}</span>
                        </div>
                    </div>
                    <img  src={config.FILE_SERVER_URL+'comp_images/'+data.uid.substring(0,data.uid.length-8)+'/'+data.uid.substring(data.uid.length-8)+'/512x512'+'.webp'}/>
                </div>
            </a>
        </Link>
    )
}

const Branch = ({type}) => {
    return (
        <div style={{
            flexGrow: '1',
            width: '3px',
            backgroundColor: typeToColor(type)
        }}/>
    )
}

const Split = ({type, width}) => {
    let color = typeToColor(type)
    return (
        <svg width="24" height="24" fill="none" strokeLinecap="round" strokeLinejoin="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m0.98061 0.97828c0.019391 19.022 11.029 17.019 11.029 17.019" fill="none" stroke={color?color:"#444"} stroke-linecap="round" stroke-linejoin="miter" stroke-width={width?width:'3'}/>
        </svg>
    )
}

const Start = ({type}) => {
    let color = typeToColor(type)
    return (
        <div style={{marginLeft: -2.5, marginBottom: -4, borderRadius: 4, width: 8, height: 8, backgroundColor: color}}/>
        // <svg width="24" height="24" fill="none" strokeLinecap="round" strokeLinejoin="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //     <circle cx="16.005" cy="15.012" r={width?width*(4/3):"4"} fill={color?color:"#444"}/>
        // </svg>
    )
}

const typeToColor = (type) => {
    return (type == 'p')?'var(--blue)':(type == 's')?'var(--yellow)':'var(--green)'
}