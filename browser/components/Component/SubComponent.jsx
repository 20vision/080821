import style from '../../styles/component/subComponent.module.css'
import config from '../../public/config.json';
import { DateTime } from "luxon";

export default function Subdata({data}){
    return(
        <div className={style.container}>
            <img src={config.FILE_SERVER_URL+'comp_images/'+data.uid.substring(0,data.uid.length-8)+'/'+data.uid.substring(data.uid.length-8)+'/512x512'+'.webp'}/>
            
            <div className={style.child}>
                <h1>{data.header}</h1>
                <div>
                    {data.body}
                </div>
                <div className={style.compFooter}>
                    <div>
                        <span style={{color: data.type == 'p'?'var(--blue)':data.type == 's'?'var(--yellow)':'var(--green)'}}>{data.type == 'p'?'Product':data.type == 's'?'Service':'Result'}</span>&nbsp;
                        <span>· {data.subcomponents} Components</span>
                    </div>
                    <span>
                    /{data.unique_pagename} · {DateTime.fromISO(data.created).toLocaleString(DateTime.DATE_MED)}
                    </span>
                </div>
            </div>
        </div>
    )
}