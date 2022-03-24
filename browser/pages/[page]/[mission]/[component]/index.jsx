import { useEffect, useState } from 'react'
import ComponentLayout from '../../../../layouts/component'
import axios from 'axios'
import config from '../../../../public/config.json';
import style from '../../../../styles/component/index.module.css'

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
        src={config.FILE_SERVER_URL+'comp_images/'+component.uid.substring(0,params.component.length-8)+'/'+component.uid.substring(params.component.length-8)+'/512x512'+'.webp'}/>
        <h2>
          {component.header}
        </h2>
        <div>
          {component.body}
        </div>
      </div>
      {subComponents && subComponents.map((sub, index) => {
        return(
          <div key={index}>
            {sub.header}
          </div>
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