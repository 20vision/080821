import style from '../../styles/component/subComponent.module.css'
import config from '../../public/config.json';
import { DateTime, Interval } from "luxon";

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
                        {data.subcomponents} Sub-Components
                    </div>
                    <span>
                    /{data.unique_pagename} · {DateTime.fromISO(data.created).toLocaleString(DateTime.DATE_MED)}
                    </span>
                </div>
            </div>
        </div>
    )
}