import indexStyles from '../../styles/modal/index.module.css'
import styles from '../../styles/modal/userPages.module.css'
import Loading from '../../assets/Loading/Loading'
import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import usePagenameValidation from '../../hooks/Page/usePagenameValidation'
import { useModalStore } from '../../store/modal'
import TextareaAutosize from 'react-textarea-autosize';
import {useInfiniteQuery, useMutation, useQueryClient} from 'react-query'
import PacmanLoader from 'react-spinners/PacmanLoader'

import PageIcon from '../../assets/PageIcon/PageIcon'
import Plus from '../../assets/Plus'

import InfiniteScroll from 'react-infinite-scroll-component'


export default function UserPages() {
    const [selectedRoute, setSelectedRoute] = useState(1)
    const router = useRouter()
    const setModal = useModalStore(state => state.setModal)

    return (
        <div>
            <div className={`noselect ${indexStyles.header}`}>
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
            
            <div>
                {selectedRoute == 0?
                    <Create handleSwitchToPage={(e) => {router.push(`/${e}`); setModal(0)}}/>
                :selectedRoute == 1?
                    <My_Pages handleSwitchToMy_Pages={() => {setSelectedRoute(0)}}/> 
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
                    page_icon: data.data.page_icon,
                    pagename: variables.pagename,
                    unique_pagename: variables.pagename.toLowerCase(),
                    vision: variables.vision
                }
                queryClient.setQueryData('my_pages', data => ({
                    pages: [{my_pages: [page, ...data.pages[0].my_pages], nextId: data.pages[0].nextId}, ...data.pages.slice(1)],
                    pageParams: data.pageParams,
                }))
                props.handleSwitchToPage(page.unique_pagename)
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
        <div>

            <div className={`areaLine ${styles.contentArea}`}>
                <div className={styles.pagename}>
                    <h2>/</h2><input ref={pagenameRef} placeholder="Pagename" onChange={e => {setNewPagename(e.target.value); addPageMuation.reset();}}/>
                </div>
                <div className={styles.vision}>
                    <TextareaAutosize 
                        minRows={6}
                        ref={visionRef}
                        placeholder="Vision - Why do you do what you do ? Your purpose, cause or belief. " 
                        onChange={e => {setVision(e.target.value); addPageMuation.reset();}}
                    />
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

function My_Pages(props){

    const myPages = useInfiniteQuery(
        'my_pages',
        async ({pageParam = 0}) => {
            const res = await axios.get(`http://localhost:4000/get/my_pages/${pageParam}`,{withCredentials: true})
            return res.data
        },
        {   
            refetchOnWindowFocus: false,
            refetchOnmount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 1000 * 60 * 60 * 24,
            onError: (error) => {
                console.error(error)
            },
            getNextPageParam: (lastPage, pages) => lastPage.nextId ?? false,
        }
    )

    return(
        <div id="scrollableDiv" className={styles.mypages_container}>
            {myPages.status === 'loading' || myPages.status === 'error' ?
                <div className={styles.centerContainer}>
                    <PacmanLoader css="display:block;" color="#8A8A8A" size={12}/>
                </div>
            :myPages.data && myPages.data.pages[0] && myPages.data.pages[0].my_pages && myPages.data.pages[0].my_pages.length > 0?

                <InfiniteScroll 
                    dataLength={myPages.data.pages.length}
                    hasMore={myPages.hasNextPage}
                    scrollableTarget="scrollableDiv"
                    next={() => myPages.fetchNextPage()}
                    css="overflow-y:hidden;"
                >
                    {myPages.data.pages.map(page => (
                        <React.Fragment key={page.nextId}>
                            {page.my_pages.map(page => (
                                <div key={page.unique_pagename} className={styles.myPageItem}>
                                    {(page.page_icon.length < 7) ?
                                        <PageIcon color={'#'+page.page_icon}/>
                                    :
                                        <img src={page.page_icon}/>
                                    }
                                    <div className={styles.names}>
                                        <h3>
                                            {page.pagename}
                                        </h3>
                                        <span>
                                            /{page.unique_pagename}
                                        </span>
                                    </div>
                                </div>
                                
                            ))}
                        </React.Fragment>
                    ))}                    
                </InfiniteScroll>
            :
                <div className={styles.centerContainer}>
                    <a onClick={() => props.handleSwitchToMy_Pages()}>
                        <div className={styles.createPagePreview}>
                            <Plus color="#8A8A8A"/>
                            <h2>
                                Create Page
                            </h2>
                        </div>
                    </a>
                </div>
            }
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