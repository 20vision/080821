import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import config from '../../public/config.json'
import ComponentsHorizontal from "../Component/ComponentsHorizontal"
import CheckSquare from "../../assets/CheckSquare"
import Square from "../../assets/Square"
import Trash from "../../assets/Trash"

export default function SavedComponents() {
    const [loading, setLoading] = useState(false)
    const [components, setComponents] = useState()
    const [selected, setSelected] = useState([])
    const [canFetchNext, setCanFetchNext] = useState(true)
    

    const fetchSavedComponents = () => {
        if(canFetchNext == false) return
        setLoading(true)
        axios.get(`${config.HTTP_SERVER_URL}/get/components/saved/${components && components.length?components.length:0}`, {withCredentials: true})
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
        <div className="noselect" style={{maxWidth: 450}}>
            {components && components.map((comp, index) => <CompWithCheckBox comp={comp} selected={selected} setSelected={setSelected}/>)}
            <div style={{display: 'flex', alignItems: 'center', marginTop: 25}}>
                <a style={{flexGrow: 1}}>
                    <h2 style={{opacity: selected.length == 0?'0.3':null, backgroundColor: 'var(--red)', color: '#FAFAFA', padding: '15px 25px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center'}}>
                        Add Component
                    </h2>
                </a>
                <a>
                    <div style={{margin: '15px 25px', opacity: selected.length == 0?'0.3':null}}>
                        <Trash/>
                    </div>
                </a>
            </div>
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
        console.log('selected:',selected)
    }, [selectedIndex])

    return(
        <a onClick={() => selectedIndex==null?setSelectedIndex(selected.length+1):setSelectedIndex(null)} style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
            <div style={{margin: 15, marginBottom: 10, marginRight: 30}}>
                {selectedIndex!=null?<CheckSquare color="var(--red)"/>:<Square/>}
            </div>
            <ComponentsHorizontal data={comp}/>
        </a>
    )
}