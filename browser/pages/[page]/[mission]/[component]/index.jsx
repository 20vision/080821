import { useEffect, useState } from 'react'
import ComponentLayout from '../../../../layouts/component'
import axios from 'axios'
import config from '../../../../public/config.json';
import style from '../../../../styles/component/index.module.css'
import SubComponent from '../../../../components/Component/SubComponent';
import { DateTime, Interval } from "luxon";
import Link from 'next/link'

export default function Component({component, subComponents, params}){
  const [page, setPage] = useState(null)

  useEffect(async() => {
    try{
      setPage((await axios.get(`http://localhost:4000/get/page/${params.page}?missions=false`)).data.page)
    }catch(error){
      console.error(error)
    }
  }, [])

  return(
    <ComponentLayout page={page}>
      <div className={style.compContainer}>
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
              Mission · {component.mission_title.replace(/_/g, ' ')}
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
          <Link href={`/${sub.unique_pagename}/${sub.mission_title}/${sub.uid}`}>
            <a>
              <SubComponent data={sub} key={index}/>
            </a>
          </Link>
        )
      })}
    </ComponentLayout>
  )
}

export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`http://localhost:4000/get/component/${context.params.component}`)
    console.log(res.data.subComponents)
    return{
      props: {
        params: context.params,
        component: res.data.component,
        subComponents: res.data.subComponents
      }
    }
  }catch(error){
    console.log(error)
    return {
      notFound: true
    }
  }
}