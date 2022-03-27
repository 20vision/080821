import styles from '../../styles/component/overview.module.css'
import pageLayoutStyle from "../../styles/pageLayout/index.module.css"
import config from '../../public/config.json';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRef } from 'react';

export default function Overview({comp, subs}){

    return(
        <div>
            <Link href={`#main`}>
                <a>
                    <div style={{display:'flex'}}>
                        {subs && subs.length>0?
                            <div style={{display: 'flex', flexDirection: 'column',width: '8px', paddingLeft: '3px'}}>
                                <div style={{flexGrow: '1'}}/>
                                <Start type={comp.type}/>
                                <Branch type={comp.type}/>
                            </div>
                        :
                            null
                        }
                        <div className={`${styles.componentParent}`}>
                            <ContentRow data={comp} subcomponents={subs && subs.length}/>
                        </div>
                    </div>
                </a>
            </Link>
            {subs && subs.map((sub, index) => {
                return(
                    <Link href={`#sub_${sub.child_component_index}`} key={index}>
                        <a>
                            <div style={{display:'flex',marginLeft:'3px'}} key={index}>
                                {index == subs.length-1?
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Branch type={comp.type}/>
                                        <div style={{marginTop: '-7px'}}>
                                            <Split type={comp.type}/>
                                        </div>
                                        <div style={{flexGrow: '1'}}/>
                                    </div>
                                :
                                    <div style={{display: 'flex', flexDirection: 'column', position: 'relative', marginRight: 15}}>
                                        <Branch type={comp.type}/>
                                        <div style={{position: 'absolute',top:'calc(50% - 12px)'}}>
                                            <Split type={comp.type}/>
                                        </div>
                                    </div>
                                }
                                <div className={`${styles.subParent}`} style={{borderBottom: index!=subs.length-1?'1px solid var(--lighter_grey)':null}}>
                                    <ContentRow data={sub} pagination={subs.length-index}/>
                                </div>
                            </div>
                        </a>
                    </Link>
                )
            })}
            <div style={{width: '100%', height: '35px'}}/>
        </div>
    )
}

const ContentRow = ({data, subcomponents, pagination}) => {
    return(
        <div className={pageLayoutStyle.dependent}>
            <div className={pageLayoutStyle.info}>
                <div className={pageLayoutStyle.header}>
                    <h3>{pagination?<span style={{opacity: '0.75'}}>-{pagination}|&nbsp;</span>:null}<span>{data.header}</span></h3>
                </div>
                <div className={pageLayoutStyle.footer}>
                    <span style={{fontSize: 12,fontWeight: 'bold',color: data.type == 'p'?'var(--blue)':data.type == 's'?'var(--yellow)':'var(--green)'}}>{data.type == 'p'?'Product':data.type == 's'?'Service':'Result'}</span>&nbsp;
                    <span style={{fontSize: 12}}>· {subcomponents!=null?subcomponents:data.subcomponents} Components</span>
                </div>
            </div>
            <img src={config.FILE_SERVER_URL+'comp_images/'+data.uid.substring(0,data.uid.length-8)+'/'+data.uid.substring(data.uid.length-8)+'/512x512'+'.webp'}/>
        </div>
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
            <path d="m0.98061 0.97828c0.019391 19.022 11.029 17.019 11.029 17.019" fill="none" stroke={color?color:"#444"} strokeLinecap="round" strokeLinejoin="miter" strokeWidth={width?width:'3'}/>
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