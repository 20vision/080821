import PagePanel from "../../../components/DefaultLayout/PagePanel"
import axios from 'axios'
import config from '../../../public/config.json'

export default function index({page, missions}) {
  return <PagePanel page={page} missions={missions}/>
}


export async function getServerSideProps(context) {
  try{
    const res = await axios.get(`${config.HTTP_SERVER_URL}/get/page/${context.params.page}?missions=true`)
    return{
      props: {
        page: res.data.page,
        missions: res.data.missions
      }
    }
  }catch(error){
    console.log((error && error.response)?error.response:error)
    return {
      notFound: true
    }
  }
}
