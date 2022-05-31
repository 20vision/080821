import axios from "axios"
import { useModalStore } from "../../store/modal"
import { useComponentStore } from "../../store/component"
import config from '../../public/config.json'
import { useRouter } from 'next/router'
import { toast } from "react-toastify"

export default function DeleteComponent() {
    const setModal = useModalStore(state => state.setModal)
    const router = useRouter()
    const setEditMode = useComponentStore(state => state.setEditMode)

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Are you sure ?</h1>
            <div style={{lineHeight: 1, marginTop: 30}}>
                Do you really want to delete this component ?<br/>
                This process can not be undone.
            </div>
            <div style={{display: 'flex', marginTop: 30}}>
                <h2 onClick={() => {setModal(0)}} className="button" style={{backgroundColor: 'var(--lighter_grey)', marginRight: 15, flexGrow: 1, color: 'var(--white)'}}>
                    Cancel
                </h2>
                <h2 onClick={async() => {
                    try{
                        await axios.post(`${config.HTTP_SERVER_URL}/update/component/delete`, {uid: router.query.component}, {withCredentials: true})
                        setModal(0)
                        setEditMode(false)
                        router.push(`/${router.query.page}/${router.query.mission}`)
                    }catch(err){
                        console.log((err && err.response)?err.response:err)
                        toast.error('Could not delete Component')
                    }
                }} className="button" style={{backgroundColor: 'var(--red)', flexGrow: 1, color: 'var(--white)'}}>
                    Delete
                </h2>
            </div>
        </div>
    )
}