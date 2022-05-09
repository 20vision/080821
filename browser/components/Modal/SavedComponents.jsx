import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import config from '../../public/config.json'
import ComponentsHorizontal from "../Component/ComponentsHorizontal"
import CheckSquare from "../../assets/CheckSquare"
import Square from "../../assets/Square"
import InfiniteScroll from 'react-infinite-scroll-component'
import PacmanLoader from 'react-spinners/PacmanLoader'
import Loading from "../../assets/Loading/Loading"
import { useRouter } from "next/router"
import UploadCloud from "../../assets/UploadCloud"

export default function SavedComponents() {
    const [loading, setLoading] = useState(false)
    const [components, setComponents] = useState([])
    const [selected, setSelected] = useState([])
    const [canFetchNext, setCanFetchNext] = useState(true)
    const router = useRouter()

    const fetchSavedComponents = () => {
        if(canFetchNext == false) return
        setLoading(true)
        axios.get(`${config.HTTP_SERVER_URL}/get/components/saved/${components && components.length?(components.length-1):0}`, {withCredentials: true})
        .then(response => {
            if(response.data.length != 5) setCanFetchNext(false)
            if(components && (components.length > 0)) return setComponents([...components, ...response.data])
            setComponents(response.data)
        })
        .catch(err => {
            toast.error('Could not get saved Components')
        })
        .then(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchSavedComponents()
    }, [])


    return (
        <div className="noselect" style={{width: 450}}>
            <h1 style={{textAlign: "center", marginBottom: '35px'}}>Saved Components</h1>
            {!loading&&components.length==0?
                <div>
                    <div style={{color: 'var(--grey)', textAlign: 'center'}}>You have to save Components prior to adding them</div>
                </div>
            :null}
            <InfiniteScroll 
                dataLength={components.length}
                hasMore={canFetchNext}
                next={
                    () => {
                        fetchSavedComponents()
                    }
                }
                style={{marginBottom: 35}}
                loader={<PacmanLoader css="display:block;" color="#8A8A8A" size={12}/>}
            >
                {components && components.map((comp, index) => <div key={index}><CompWithCheckBox comp={comp} selected={selected} setSelected={setSelected}/></div>)}
            </InfiniteScroll>
            <a style={{flexGrow: 1}} onClick={async() => {
                if(loading||(selected.length==0)) return
                try{
                    setLoading(true)
                    await axios.post(`${config.HTTP_SERVER_URL}/post/component/connection`,{parent_component: router.query.component,selected: selected},{withCredentials: true})
                    setLoading(false)
                    router.reload(window.location.pathname)
                }catch(err){
                    console.log(err)
                    setLoading(false)
                    toast.error('Could not add Component')
                }
            }}>
                <h2 style={{
                    opacity: selected.length == 0?'0.3':null, 
                    backgroundColor: 'var(--red)', 
                    color: '#FAFAFA', 
                    padding: '15px 25px', 
                    borderRadius: '15px', 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    display:'flex', 
                    justifyContent: 'center',
                    cursor: loading||(selected.length==0)?'auto':'pointer'
                }}>
                    {!loading?
                        'Add Sub-'
                    :<Loading/>}
                </h2>
            </a>
        </div>
    )
}

const CompWithCheckBox = ({comp, selected, setSelected}) => {
    const [selectedIndex, setSelectedIndex] = useState()

    useEffect(() => {
        if(selectedIndex==null && selected.length > 1){
            setSelected([
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex+1)
            ])
        }else if(selectedIndex==null && selected.length == 1){
            setSelected([])
        }else if(selectedIndex!=null){
            setSelected([...selected, comp.uid])
        }
    }, [selectedIndex])

    return(
        <a onClick={() => selectedIndex==null?setSelectedIndex(selected.length+1):setSelectedIndex(null)} style={{display: 'flex', alignItems: 'center', margin: '15px 0px'}}>
            <div style={{margin: 15, marginRight: 30}}>
                {selectedIndex!=null?<CheckSquare color="var(--red)"/>:<Square/>}
            </div>
            <div style={{flexGrow: 1}}><ComponentsHorizontal data={comp}/></div>
        </a>
    )
}