import styles from '../../styles/component/overview.module.css'
import pageLayoutStyle from "../../styles/pageLayout/index.module.css"
import config from '../../public/config.json';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRef } from 'react';
import useUserProfile from '../../hooks/User/useUserProfile'
import UploadCloud from '../../assets/UploadCloud'
import Cloud from '../../assets/cloud'
import SavedToCloud from '../../assets/SavedToCloud'
import axios from 'axios'
import { useComponentStore } from '../../store/component'
import X from '../../assets/X'
import { useRouter } from 'next/router'
import { toast } from "react-toastify"

export default function Overview({comp, subs}){
    const [profile, isLoading, setUser] = useUserProfile()
    const editMode = useComponentStore(state => state.editMode)
    const router = useRouter()
    const [childUids, setChildUids] = useState([])
    const [wasEditing, setWasEditing] = useState(false)


    useEffect(() => {
        async function AsyncFunction(){
            try{
                await axios.post(`${config.HTTP_SERVER_URL}/update/component/connection`, {
                    uid: router.query.component, 
                    child_uids: childUids
                }, {withCredentials: true})
                router.reload(window.location.pathname)
                setWasEditing(false)
            }catch(err){
                console.log(err)
                toast.error('Could not remove Sub-Components')
                setWasEditing(false)
            }
        }
        console.log(wasEditing, editMode)
        if((wasEditing == true) && (editMode == false) && (childUids.length > 0)) AsyncFunction()
        if((wasEditing == false) && (editMode == true)) setWasEditing(true)
    }, [editMode])

    return(
        <div>
            <Link href={`#main`}>
                <a>
                    <div style={{display:'flex'}}>
                        {subs && subs.length>0?
                            <div style={{display: 'flex', flexDirection: 'column',width: '8px', paddingLeft: '3px'}}>
                                <div style={{flexGrow: '1'}}/>
                                <Start type={comp.type}/>
                                <Branch type={comp.type}/>
                            </div>
                        :
                            null
                        }
                        <div className={`${styles.componentParent}`}>
                            <ContentRow data={comp} subcomponents={subs && subs.length}/>
                        </div>
                    </div>
                </a>
            </Link>
            {subs && subs.map((sub, index) => {
                return(
                    <div style={{display:'flex',marginLeft:'3px'}} key={index}>
                        {index == subs.length-1?
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Branch type={comp.type}/>
                                <div style={{marginTop: '-7px'}}>
                                    <Split type={comp.type}/>
                                </div>
                                <div style={{flexGrow: '1'}}/>
                            </div>
                        :
                            <div style={{display: 'flex', flexDirection: 'column', position: 'relative', marginRight: 15}}>
                                <Branch type={comp.type}/>
                                <div style={{position: 'absolute',top:'calc(50% - 12px)'}}>
                                    <Split type={comp.type}/>
                                </div>
                            </div>
                        }
                        <div className={`${styles.subParent}`} style={{borderBottom: index!=subs.length-1?'1px solid var(--lighter_grey)':null}}>
                            <ContentRow childUids={childUids} setChildUids={setChildUids} router={router} editMode={editMode} data={sub} pagination={subs.length-index} profile={profile}/>
                        </div>
                    </div>
                )
            })}
            <div style={{width: '100%', height: '35px'}}/>
        </div>
    )
}

const ContentRow = ({data, subcomponents, pagination, profile, editMode, router, childUids, setChildUids}) => {
    const [saved, setSaved] = useState()
    const [deleteIndex, setDeleteIndex] = useState()

    useEffect(() => {
        async function AsyncFunction(){
            try{
                setSaved((await axios.get(`${config.HTTP_SERVER_URL}/get/component/${data.uid}/saved`, {withCredentials: true})).data==0?false:true)
            }catch(err){
                console.log(err)
            }
        }
        if(profile && profile.username) AsyncFunction()
    }, [profile])

    return(
        <div className={pageLayoutStyle.dependent} style={{opacity: deleteIndex==null?1:0.6}}>
            <Link href={`#sub_${data.child_component_index}`}>
                <a>
                    <div className={pageLayoutStyle.info}>
                        <div className={pageLayoutStyle.header}>
                            <h3>{pagination?<span style={{opacity: '0.75'}}>-{pagination}|&nbsp;</span>:null}<span>{data.header}</span></h3>
                        </div>
                        <div className={pageLayoutStyle.footer}>
                            <span style={{fontSize: 12,fontWeight: 'bold',color: data.type == 'p'?'var(--blue)':data.type == 's'?'var(--yellow)':'var(--green)'}}>{data.type == 'p'?'Product':data.type == 's'?'Service':'Result'}</span>&nbsp;
                            <span style={{fontSize: 12}}>· {subcomponents!=null?subcomponents:data.subcomponents} Components</span>
                        </div>
                    </div>
                </a>
            </Link>
            <div style={{position: 'relative', width: 100, height: 100, flexShrink: 0, margin: 10}}>
                <img
                style={{position: 'absolute', left:0, right:0, top:0, bottom: 0}}
                src={config.FILE_SERVER_URL+'comp_images/'+data.uid.substring(0,data.uid.length-8)+'/'+data.uid.substring(data.uid.length-8)+'/512x512'+'.webp'}/>
                {profile && profile.username && router.query.component?
                    <div style={{position: 'absolute', transform: 'scale(0.8)', opacity: 0.8, right: -5, bottom: -5, backgroundColor: '#FAFAFA', borderRadius: 10, padding: 5}}>
                        {editMode?
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <a onClick={() => {
                                    if(deleteIndex==null){
                                        setDeleteIndex(childUids.length)
                                        setChildUids([
                                            ...childUids,
                                            data.uid
                                        ])
                                    }else{
                                        setChildUids([
                                            ...childUids.slice(0, deleteIndex),
                                            ...childUids.slice(deleteIndex+1)
                                        ])
                                        setDeleteIndex(null)
                                    }
                                }}>
                                    <X color={deleteIndex==null?null:'#FF5B77'}/>
                                </a>
                            </div>
                        :saved==false?
                            <a onClick={() => {
                                axios.post(`${config.HTTP_SERVER_URL}/post/component/save`, {uid: data.uid}, {withCredentials: true})
                                .then(async response => {
                                    //toast.success('Saved Component')
                                    setSaved(true)
                                })
                                .catch(error => {
                                    console.log(error)
                                    toast.error('Could not save Component')
                                })
                            }}>
                                <UploadCloud/>
                            </a>
                        :saved==true?
                            <a onClick={() => {
                                axios.post(`${config.HTTP_SERVER_URL}/update/component/save`, {uid: data.uid}, {withCredentials: true})
                                .then(async response => {
                                    //toast.success('U Component')
                                    setSaved(false)
                                })
                                .catch(error => {
                                    console.log(error)
                                    toast.error('Could not unsave Component')
                                })
                            }}>
                                <SavedToCloud/>
                            </a>
                        :
                            <a style={{opacity: 0.6}}>
                                <Cloud/>
                            </a>
                        }
                    </div>
                :
                    null
                }
            </div>
        </div>
    )
}

const Branch = ({type}) => {
    return (
        <div style={{
            flexGrow: '1',
            width: '3px',
            backgroundColor: typeToColor(type)
        }}/>
    )
}

const Split = ({type, width}) => {
    let color = typeToColor(type)
    return (
        <svg width="24" height="24" fill="none" strokeLinecap="round" strokeLinejoin="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m0.98061 0.97828c0.019391 19.022 11.029 17.019 11.029 17.019" fill="none" stroke={color?color:"#444"} strokeLinecap="round" strokeLinejoin="miter" strokeWidth={width?width:'3'}/>
        </svg>
    )
}

const Start = ({type}) => {
    let color = typeToColor(type)
    return (
        <div style={{marginLeft: -2.5, marginBottom: -4, borderRadius: 4, width: 8, height: 8, backgroundColor: color}}/>
        // <svg width="24" height="24" fill="none" strokeLinecap="round" strokeLinejoin="round" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //     <circle cx="16.005" cy="15.012" r={width?width*(4/3):"4"} fill={color?color:"#444"}/>
        // </svg>
    )
}

const typeToColor = (type) => {
    return (type == 'p')?'var(--blue)':(type == 's')?'var(--yellow)':'var(--green)'
}