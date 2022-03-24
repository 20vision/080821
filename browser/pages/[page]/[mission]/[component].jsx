import ComponentLayout from '../../../layouts/component'

export default function Component({component}){
    return(
        <ComponentLayout >
            Hello
        </ComponentLayout>
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