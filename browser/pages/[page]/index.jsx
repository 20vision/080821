import PagePanel from "../../components/DefaultLayout/PagePanel"
import axios from 'axios'

export default function index({page, missions}) {
  return <PagePanel page={page} missions={missions}/>
}

export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get/page/${context.params.page}?missions=true`)
    return{
      props: {
        page: res.data.page,
        missions: res.data.missions
      }
    }
  }catch(error){
    console.log(error)
    return {
      notFound: true
    }
  }
}
