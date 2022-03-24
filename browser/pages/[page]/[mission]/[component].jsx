import PaperLayout from '../../../layouts/paper'

export default function Component({component}){
    return(
        <PaperLayout >
            Hello
        </PaperLayout>
    )
}

export async function getServerSideProps(context) {
    try{
      const res = await axios.get(`http://localhost:4000/get/page/${context.params.page}`)
      return{
        props: {
          component: res.data.component
        }
      }
    }catch(error){
      return {
        notFound: true
      }
    }
}