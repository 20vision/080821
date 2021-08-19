import indexStyles from '../../styles/modal/index.module.css'
import styles from '../../styles/modal/addPage.module.css'
import Loading from '../../assets/Loading/Loading'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import usePagenameValidation from '../../hooks/Page/usePagenameValidation'
import TextareaAutosize from 'react-textarea-autosize';
import {useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider, mutate} from 'react-query'

export default function UserPages() {
    const [selectedRoute, setSelectedRoute] = useState(1)

    return (
        <div>
            <div className={indexStyles.header}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?indexStyles.highlight:null}>
                    Create
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?indexStyles.highlight:null}>
                    My Pages
                </h1>
                <h1 onClick={() => setSelectedRoute(2)} className={selectedRoute == 2?indexStyles.highlight:null}>
                    Invites
                </h1>
            </div>
            
            <div className={styles.contentContainer}>
                {selectedRoute == 0?
                    <Create handleSwitchToMy_Pages={() => {setSelectedRoute(1)}}/>
                :selectedRoute == 1?
                    <My_Pages/> 
                :
                    <Invites/>
                }
            </div>
        </div>

    )
}

function Create(props){
    const [setNewPagename, pagename, pagenameError, validPagenameLoading] = usePagenameValidation()
    const [vision, setVision] = useState('')
    const [valid, setValid] = useState(false)
    const pagenameRef = useRef(null)
    const visionRef = useRef(null)
    const queryClient = useQueryClient()

    const addPageMuation = useMutation(
        async newPage => await axios.post('http://localhost:4000/post/create_page',newPage,{withCredentials: true}),
        {
            onError: (error, variables, context) => {
                console.log(error.data)
            },
            onSuccess: (data, variables) => {
                visionRef.current.value = ""
                pagenameRef.current.value = ""
                setVision('')
                setNewPagename('')
                let page = {
                    user_icon: data.data.page_icon,
                    pagename: variables.pagename,
                    unique_pagename: variables.pagename.toLowerCase(),
                    vision: variables.vision
                }
                queryClient.setQueryData('my_pages', old => old?[page, ...old]:old = [page])
                props.handleSwitchToMy_Pages()
            },
        }
    )

    useEffect(() => {
        if(pagename && (vision.length >= 4) && (vision.length <= 500)){
            setValid(true)
        }else{
            setValid(false)
        }
    }, [pagename, vision])

    return(
        <div className={styles.createContainer}>

            <div className={`areaLine ${styles.contentArea}`}>
                <div className={`${styles.pagenameContainer}`}>
                    <h2>/</h2><input ref={pagenameRef} placeholder="Pagename" onChange={e => {setNewPagename(e.target.value); addPageMuation.reset();}}/>
                </div>
                <div className={`${styles.visionContainer}`}>
                    <TextareaAutosize 
                    ref={visionRef}
                    placeholder="Vision - Why do you do what you do ?" 
                    onChange={e => {setVision(e.target.value); addPageMuation.reset();}}/>
                </div>
            </div>

            <div className={`${(vision.length > 500)?styles.invalidVision:null} ${styles.visionCount}`}>{500 - vision.length}</div>
            
            {pagenameError ? <div className={styles.errorMsg}>{pagenameError}</div>:null}

            {addPageMuation.error && addPageMuation.error.response && addPageMuation.error.response.data ? 
                <div className={styles.errorMsg}>{addPageMuation.error.response.data}</div>:null
            }

            <a 
            onClick={e => {
                e.preventDefault()
                addPageMuation.mutate({pagename: pagename, vision: vision})
            }} 
            className={`${styles.createPageButton} ${!valid || validPagenameLoading || addPageMuation.isLoading ?styles.invalidButton:null}`}>
                {!validPagenameLoading?
                    <div>
                        <h2>Create Page</h2>
                    </div>
                :
                    <Loading/>
                }
            </a>

        </div>
    )
}

function My_Pages(){
    return(
        <div>
            My Pages
        </div>
    )
}

function Invites(){
    return(
        <div>
            Invites
        </div>
    )
}