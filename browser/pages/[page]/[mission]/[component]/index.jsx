import { useEffect, useState } from 'react'
import ComponentLayout from '../../../../layouts/component'
import axios from 'axios'

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
      Hello
    </ComponentLayout>
  )
}

export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`http://localhost:4000/get/component/${context.params.component}`)
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