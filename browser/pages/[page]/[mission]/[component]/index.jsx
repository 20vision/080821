import { useEffect, useState } from 'react'
import ComponentLayout from '../../../../layouts/component'
import axios from 'axios'
import config from '../../../../public/config.json';
import style from '../../../../styles/component/index.module.css'
import SubComponent from '../../../../components/Component/SubComponent';
import { DateTime } from "luxon";
import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion';

export default function Component({component, subComponents, params}){
  const controls = useAnimation()
  const [page, setPage] = useState(null)
  
  useEffect(async() => {
    try{
      setPage((await axios.get(`${config.HTTP_SERVER_URL}/get/page/${params.page}?missions=false`)).data.page)
    }catch(error){
      console.error(error)
    }
  }, [])

  return(
    <ComponentLayout page={page} comp={component} subs={subComponents}>
      <div>
        <div id='main' className={style.compContainer}>
          <img
          src={config.FILE_SERVER_URL+'comp_images/'+component.uid.substring(0,component.uid.length-8)+'/'+component.uid.substring(component.uid.length-8)+'/512x512'+'.webp'}/>
          <div style={{margin: '0px 35px'}}>
            <h1>
              {component.header}
            </h1>
            <div>
              {component.body}
            </div>
            <div className={style.compFooter}>
              <div>
                <span style={{color: component.type == 'p'?'var(--blue)':component.type == 's'?'var(--yellow)':'var(--green)'}}>{component.type == 'p'?'Product':component.type == 's'?'Service':'Result'}</span>&nbsp;
                <span>· {component.mission_title.replace(/_/g, ' ')}</span>
              </div>
              <span>
                {DateTime.fromISO(component.created).toLocaleString(DateTime.DATE_MED)}
              </span>
            </div>
          </div>

        </div>
        <br/>
        {subComponents && subComponents.map((sub, index) => {
          return (
            <div id={`sub_${sub.child_component_index}`} key={index}>
              <Link href={`/${sub.unique_pagename}/${sub.mission_title}/${sub.uid}#main`}>
                <a>
                  <SubComponent data={sub}/>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </ComponentLayout>
  )
}

export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`${config.HTTP_SERVER_URL}/get/component/${context.params.component}`)
    return{
      props: {
        params: context.params,
        component: res.data.component,
        subComponents: res.data.subComponents
      }
    }
  }catch(error){
    console.log((error && error.response)?error.response:error)
    return {
      notFound: true
    }
  }
}