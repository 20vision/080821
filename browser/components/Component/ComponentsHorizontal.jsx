
import styles from "../../styles/pageLayout/index.module.css"
import Link from "next/link"
import config from "../../public/config.json"
import PageIcon from "../../assets/PageIcon/PageIcon"

export default function ComponentsHorizontal({data}){
    return(
        <div className={styles.dependent}>
            <div className={styles.info} style={{flexGrow: 1}}>
                <div className={styles.header}>
                    <h3>{data.header}</h3>
                </div>
                <div className={styles.footer}>
                    <span style={{fontSize: 12,color: data.type == 'p'?'var(--blue)':data.type == 's'?'var(--yellow)':'var(--green)'}}>{data.type == 'p'?'Product':data.type == 's'?'Service':'Result'}</span>&nbsp;
                    <span style={{fontSize: 12}}>· /{data.unique_pagename}</span>
                </div>
            </div>
            <img src={config.FILE_SERVER_URL+'comp_images/'+data.uid.substring(0,data.uid.length-8)+'/'+data.uid.substring(data.uid.length-8)+'/512x512'+'.webp'}/>
            <div className={styles.page_icon}>
                {data && data.page_icon.length > 6 ?
                    <img src={config.FILE_SERVER_URL+data.page_icon+'48x48.webp'} style={{width: 45, height: 45, borderRadius: 10}}/>
                :
                    <PageIcon color={'#'+data.page_icon}/>
                }
            </div>
        </div>
    )
}