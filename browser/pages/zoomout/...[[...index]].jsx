export default function index(){
    return new Error()
}
// import axios from "axios"
// import { useEffect, useState } from "react"
// import ZoomoutLayout from '../../layouts/zoomout'
// import BubbleEdit from '../../components/Forum/BubbleEdit'
// import BubbleBasicLayout from "../../components/Forum/BubbleBasicLayout"
// import useUserProfile from "../../hooks/User/useUserProfile"
// import { toast } from "react-toastify"
// import { useRouter } from "next/router"
// import Square from "../../components/Forum/Square"
// import BubbleView from "../../components/Forum/BubbleView"

// export default function index() {
//     const router = useRouter()

//     useEffect(async() => {
//         const forumQuery = router.asPath.split('?')
//         if(forumQuery.length == 2) {
//             fetchTarget(setData,`discover/0?${forumQuery[1]}`)
//         }else{
//             fetchTarget(setData,`discover/0`)
//         }
//     },[])

//     const [data, setData] = useState([])

//     return(
//         <ZoomoutLayout>
//             <Bubble data={data} setData={setData}/>
//         </ZoomoutLayout>
//     )

// }

// const fetchTarget = async (setData, type) => {
//     try{
//         console.log((await axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get/forum/${type}`)).data)
//     }catch(err){
//         console.error(err)
//         return null
//     }
// }

// const Bubble = ({data, setData}) => {
//     const [highlightIndex, setHighlightIndex] = useState(0)
//     const [loadingVertical, setLoadingVertical] = useState(false)
//     const [loadingHorizontal, setLoadingHorizontal] = useState(false)
//     const [selected, setSelected] = useState(false)
//     const [editHexColor, setEditHexColor] = useState()
//     const [profile, isLoading, setUser] = useUserProfile()
//     const router = useRouter()

//     useEffect(() => {
//         // Horizontal Fetching
//         if( 
//             !loadingHorizontal &&
//             data && 
//             (data.length < (highlightIndex+2))
//         ){
//             setLoadingHorizontal(false)
//             console.log('fetch horizontal')
//         }
//     }, [data, highlightIndex])

//     useEffect(() => {
//         // Vertical Fetching
//         if(
//             !loadingVertical &&
//             data &&
//             data[highlightIndex] &&
//             data[highlightIndex].fp_uid &&
//             (data[highlightIndex].target_fp_uid != data[highlightIndex].fp_uid)
//         ){
//             setLoadingVertical(false)
//             console.log('fetch horizontal')
//         }
//     }, [highlightIndex])

//     const sendPostFunction = async(forum_post_param, editHexColor_param) => {
//         try{
//             await axios.post(`https://http-server-vkp2ityhga-ew.a.run.app/post/forum/post/${
//                 data[highlightIndex].component?
//                     '_/_/'+data[highlightIndex].component.uid
//                 :data[highlightIndex].mission?
//                     data[highlightIndex].mission.unqiue_pagename+'/'+data[highlightIndex].mission.title+'/_'
//                 :
//                     data[highlightIndex].page+'/_/_'
//             }`,
//                 {forum_post: forum_post_param, hex_color: editHexColor_param},
//                 {withCredentials: true})
//         }catch(err){
//             console.error(err)
//             toast.error(err)
//         }
//     }

//     return(
//         <>
//             <div style={{marginBottom: 50}}>
//                 {data[highlightIndex] && data[highlightIndex].page && !selected?
//                     <Square content={data[highlightIndex]}/>
//                 :data[highlightIndex] && data[highlightIndex].mission  && !selected?
//                     <a style={{marginTop: 40}} onClick={() => setSelected(true)}><Square content={data[highlightIndex]}/></a>
//                 :data[highlightIndex] && data[highlightIndex].component  && !selected?
//                     <a style={{marginTop: 40}} onClick={() => setSelected(true)}><Square content={data[highlightIndex]}/></a>
//                 :data[highlightIndex] && data[highlightIndex].forumpost  && !selected?
//                     <a style={{marginTop: 40}} onClick={() => setSelected(true)}><BubbleView/></a>
//                 :null}
//             </div>

//             {(data[highlightIndex] && data[highlightIndex].sub && ((data[highlightIndex].left + 1) != data[highlightIndex].right))  && !selected?
//                 <Bubble data={data[highlightIndex].sub}/>
//             :profile.username?
//                 <div style={{marginTop: -20}}>
//                     <BubbleBasicLayout profile={profile} color={editHexColor}>
//                         <BubbleEdit sendPost={forum_post => sendPostFunction(forum_post,editHexColor)} setEditHexColor={setEditHexColor} clickOutsideBubbleEdit={() => setSelected(false)}/>
//                     </BubbleBasicLayout>
//                 </div>
                
//             :null}
//         </>
//     )
// }

// // import { useState, useEffect, useRef, useCallback, createRef } from 'react'
// // import ForumLayout from '../../layouts/forum'
// // import BubbleBasicLayout from '../../components/Forum/BubbleBasicLayout' 
// // import dynamic from 'next/dynamic';
// // const BubbleEdit = dynamic(() => import('../../components/Forum/BubbleEdit'), {
// //   ssr: false,
// // });
// // import BubbleView from '../../components/Forum/BubbleView'
// // import Square from '../../components/Forum/Square' 
// // import axios from 'axios'
// // import useUserProfile from '../../hooks/User/useUserProfile'
// // import { toast } from 'react-toastify';
// // import { useRouter } from 'next/router'
// // import { motion, useAnimation } from 'framer-motion';
// // import Loading from '../../assets/Loading/Loading';
// // import Link from 'next/link';
// // import { usePageSelectedStore } from '../../store/pageSelected';

// // export default function index({ssrContent, ssrTreeCount}) {
// //   const [profile, isLoading, setUser] = useUserProfile()
// //   const [editHexColor, setEditHexColor] = useState()
// //   const router = useRouter()
// //   const [dataset, setDataset] = useState(ssrContent)
// //   const [loading, setLoading] = useState(false)
// //   const [treeCount, setTreeCount] = useState(ssrTreeCount)
// //   const [filteredContentCache, setFilteredContentCache] = useState(false)
// //   const [changeFilteredIndex, setChangeFilteredIndex] = useState(0)
// //   const setPageSelection = usePageSelectedStore(state => state.setPageSelection)
// //   const [filteredContent, setFilteredContent] = useState(() => {
// //     let filtered = []
// //     for(var i=0;i<ssrContent.length;i++){
// //       filtered[i] = []
// //       for(var j=0;j<ssrContent[i].length;j++){
// //         filtered[i].push(j)
// //       }
// //     }
// //     console.log(filtered)
// //     return filtered
// //   })
// //   const [selectedContent, setSelectedContent] = useState(() => {
// //     let selectedRoute = [];
// //     for(var i=0;i<ssrContent.length;i++){
// //       selectedRoute[i] = 0
// //     }
// //     if(ssrContent.length > 0) setPageSelection(ssrContent[0][selectedRoute[0]])
// //     return selectedRoute
// //   })

// //   useEffect(async() => {
// //     console.log(dataset)
// //     if(profile.username != null){
// //       try{
// //         const query = (await axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get${router.asPath}`,{withCredentials: true})).data
// //         setTreeCount(query.tree_count)
// //         setDataset(query.content)
// //       }catch(err){
// //         console.log(err)
// //         toast.error('Could not fetch post info')
// //       }
// //     }
// //   }, [profile])


// //   const reorder = ({i, j}) => new Promise(async(resolve, reject) => {
// //     setChangeFilteredIndex(i)
// //     let new_filteredContent = JSON.parse(JSON.stringify(filteredContent)).slice(0,i+1)
// //     let new_selectedContent = [...JSON.parse(JSON.stringify(selectedContent)).slice(0,i),j]
// //     let new_dataset = dataset

// //     if((new_dataset[i][j].left != null) && (new_dataset[i][j].right != null) && (new_dataset[i][j].left + 1 != new_dataset[i][j].right)){
// //       for(let y=i;y<new_selectedContent.length;y++){
// //         let filtered = [];
// //         if((new_dataset[y][new_selectedContent[y]].left + 1 == new_dataset[y][new_selectedContent[y]].right)) break

// //         if(new_dataset[y+1]) {
// //           for(let x=0;x<new_dataset[y+1].length;x++){
// //             if(new_dataset[y+1][x].left>new_dataset[y][new_selectedContent[y]].left &&
// //               new_dataset[y+1][x].right<new_dataset[y][new_selectedContent[y]].right &&
// //               new_dataset[y+1][x].parent_id == new_dataset[y][new_selectedContent[y]].parent_id &&
// //               (new_dataset[y+1][x].parent_type == new_dataset[y][new_selectedContent[y]].parent_type) &&
// //               (new_dataset[y+1][x].forumpost_parent_id == new_dataset[y][new_selectedContent[y]].forumpost_parent_id)){
// //               filtered.push(x)
// //             }
// //           }
// //         }
        
// //         if(filtered.length == 0){
// //           try{
// //             const getPosts = await axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get/forum/_/replies/${new_dataset[y][new_selectedContent[y]].forumpost_id}`,{
// //               withCredentials: true
// //             })
// //             if(getPosts.data.length > 0){
// //               new_dataset = JSON.parse(JSON.stringify(new_dataset))
// //               for(var xs=0;xs<getPosts.data[0].length;xs++){
// //                 filtered.push(xs+((new_dataset[y+1] != null)?new_dataset[y+1].length:0))
// //               }
// //               for(var ys=0;ys<getPosts.data.length;ys++){
// //                 new_dataset[y+ys+1] = (new_dataset[y+ys+1]!=null)?[...new_dataset[y+ys+1],...getPosts.data[ys]]:[...getPosts.data[ys]]
// //               }
// //             }else{
// //               break
// //             }
// //           }catch(err){
// //             console.log(err)
// //             toast.error('Could not get posts')
// //           }
// //         }
// //         new_selectedContent.push(filtered[0])
// //         new_filteredContent.push(filtered)
// //       }
// //     }
    
// //     setDataset(new_dataset)
// //     setFilteredContent(new_filteredContent)
// //     setSelectedContent(new_selectedContent)
// //     setPageSelection(new_dataset[0][new_selectedContent[0]])
// //     let next_count = 0
// //     new_filteredContent[i].forEach(y => y>j?next_count+=1:null)
// //     if((next_count < 2) &&
// //       (i==0?(filteredContent[i].length<treeCount):(new_dataset[i][new_filteredContent[i].length - 1].next)) &&
// //       (filteredContent[i].length % 3 == 0)){
// //         console.log('LOADING')
// //       axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get/forum/_/posts/${new_dataset[i][new_selectedContent[i]].forumpost_parent_id}?depth=${i}${
// //         filteredContent[i]?'&offset='+(filteredContent[i].length/3):''}${(i!=0)?'&parent_id='+new_dataset[i-1][new_selectedContent[i-1]].forumpost_id:''}`,{
// //         withCredentials: true
// //       }).then(response => {
// //         if((response.data) && (response.data.length != 0)){
// //           new_dataset[i] = [...new_dataset[i], ...response.data]
// //           response.data.forEach((resData, idx) => {
// //             new_filteredContent[i] = [...new_filteredContent[i], ...[new_dataset[i].length - response.data.length + idx]]
// //           })
// //           setFilteredContent(new_filteredContent)
// //           setDataset(new_dataset)
// //         }
// //       }).catch(err => {
// //         console.error(err)
// //       })
// //     }
// //     console.log(new_dataset)
    
// //     resolve()
// //   })

// //   const sendPost = (post, hex, index) => {
// //     axios.post(`https://http-server-vkp2ityhga-ew.a.run.app/post/forum/${dataset[0][selectedContent[0]].unique_pagename}/${
// //       (index == 1)?
// //         'page'
// //       :(dataset[index - 1][selectedContent[index - 1]].forumpost_id)?
// //         `post/${dataset[index - 1][selectedContent[index - 1]].forumpost_id}`
// //       :(dataset[index - 1][selectedContent[index - 1]].topic_id)?
// //         `topic/${dataset[index - 1][selectedContent[index - 1]].topic_id}`
// //       :
// //         null//Mission,Component
// //     }`,{forum_post: post, hex_color: hex},{
// //       withCredentials: true
// //     }
// //     ).then(async response => {
// //       router.push(`/forum/${dataset[0][selectedContent[0]].unique_pagename}/post/${response.data.forumpost_id}`)    
// //     })
// //     .catch(error =>{
// //       console.log(error)
// //       if(error.response) toast.error(`${error.response.data?error.response.data:error.response.status+': An error occured'}`)
// //     })
// //   }

// //   const controls = useAnimation()

// //   useEffect(async() => {
// //     await controls.start(i => {
// //       return({
// //         opacity: 1,
// //         y: 0,
// //         transition: {type: "spring", delay: i * 0.1}
// //       })
// //     });
// //   }, [filteredContent])

// //   const onClickReply = (i) => {
// //     if(!filteredContentCache){
// //       setFilteredContentCache(JSON.parse(JSON.stringify(filteredContent)))
// //     }
// //     setFilteredContent(JSON.parse(JSON.stringify(filteredContent)).slice(0,i))
// //   }
// //   const clickOutsideBubbleEdit = () => {
// //     if(filteredContentCache){
// //       setFilteredContent(JSON.parse(JSON.stringify(filteredContentCache)));
// //     }
// //     setFilteredContentCache(null)
// //   }

// //   return (
// //     <ForumLayout>
// //       {/* <Square content={{page:root.page}}/>
// //       {root.mission?<Square content={{mission:root.mission}}/>:null} */}
// //       {/*.slice(0,selectionLeftRightArray.length)*/}
// //       {dataset && filteredContent && filteredContent.map((js, i) => {
// //         return(
// //           <motion.div
// //           key={i}
// //           custom={i}
// //           animate={controls}
// //           initial={typeof window === 'undefined'?null:{opacity: 0,y: 20}}
// //           >
// //             <Bubble
// //             dataset={dataset[i]}
// //             js={js}
// //             index={i}
// //             changeFilteredIndex={changeFilteredIndex}
// //             reorder={async arg => {
// //               setLoading(true)
// //               await controls.start(ic => {
// //                 if(ic <= arg.i) return ({})
// //                 return({
// //                   opacity: 0,
// //                   y: 20,
// //                   transition: {type: "spring", duration: 0.3}
// //                 })
// //               });
// //               await reorder(arg);
// //               await controls.start(ic => {
// //                 if(ic <= arg.i) return ({})
// //                 return({
// //                   opacity: 1,
// //                   y: 0,
// //                   transition: {type: "spring", delay: ic * 0.1}
// //                 })
// //               });
// //               setLoading(false)
// //             }}
// //             onClickReply={() => onClickReply(i)}
// //             sendPost={sendPost}/>
// //           </motion.div>
// //         )
// //       })
// //       }
// //       {(loading == true) ?
// //         <div key={index} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
// //           <Loading/>
// //         </div>
// //       :filteredContent.length>0?
// //         <motion.div
// //           initial={{
// //             opacity: 0,
// //             y: 20,
// //             transition: {type: "spring", duration: 0.3}
// //           }}
// //           animate={{
// //             opacity: 1,
// //             y: 0,
// //             transition: {type: "spring", delay: (filteredContent.length-1) * 0.1}
// //           }}
// //         >
// //           <BubbleBasicLayout 
// //           mirror={(filteredContent.length % 2 == 0)?false:true}
// //           color={editHexColor} 
// //           profile={profile}
// //           makeScroll={() => null}>
// //             <BubbleEdit 
// //             sendPost={post => sendPost(post, editHexColor, filteredContent.length)} 
// //             setEditHexColor={setEditHexColor}
// //             clickOutsideBubbleEdit={clickOutsideBubbleEdit}
// //             />
// //           </BubbleBasicLayout>
// //         </motion.div>
// //       :
// //         <div style={{height: 'calc(90vh - 70px)',display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
// //           <h1>&#x1F928;</h1>&nbsp;<h3>Couldn't find the Page you were looking for </h3>
          
// //         </div>
// //       }
      
// //     </ForumLayout>
// //   )
// // }

// // function Bubble({dataset, index, reorder, js, onClickReply, changeFilteredIndex}) {
// //   const [frontHeight, setFrontHeight] = useState()
// //   const motionRef = useRef([])
// //   const [frontIndex, setFrontIndex] = useState(0)
// //   const router = useRouter()
// //   const bubbleControls = useAnimation()

// //   useEffect(() => {
// //     if(changeFilteredIndex < index){
// //       setFrontIndex(0)
// //     }
// //   }, [changeFilteredIndex])

// //   const getFramer = (idx, height) => {
// //     if(idx < frontIndex){
// //       return{
// //         opacity: 0.3,
// //         width: '80%',
// //         zIndex: 0,
// //         x: '12%',
// //         y: `-10%`
// //       }
// //     }else if(idx > frontIndex){
// //       return{
// //         opacity: 0,
// //         zIndex: 0,
// //         width: '80%',
// //         x: '12%',
// //         y: 0
// //       }
// //     }else{
// //       return{
// //         opacity: 1,
// //         width: '100%',
// //         zIndex: 1,
// //         x:0,
// //         y: 0
// //       }
// //     }
// //   }

// //   useEffect(async () => {
// //     if(changeFilteredIndex > index) return
// //     if((frontIndex == null) || (motionRef.current[frontIndex] == null)) return
// //     let height = motionRef.current[frontIndex].clientHeight
// //     await bubbleControls.start(idx => {
// //       return getFramer(idx, height)
// //     });
// //     height = motionRef.current[frontIndex].clientHeight
// //     setFrontHeight(height)
// //     //adjust height as width, thus content rows of bubble changes after animation
// //     await bubbleControls.start(idx => {
// //       if(idx < frontIndex){
// //         return{
// //           x: '12%',
// //           y: `-10%`
// //         }
// //       }else if(idx > frontIndex){
// //         return{
// //           x: '12%',
// //           opacity: 0.3,
// //           y: `calc(${height}px - 85%)`
// //         }
// //       }else{
// //         return{
// //           x:0,
// //           y:0
// //         }
// //       }
// //     })
// //   }, [frontIndex, js])

// //   return(
// //     <div style={{marginBottom: '55px', position: 'relative', height: frontHeight}}>
// //       {(js.length != 0) && js.map((j, idx) => {
// //         if((idx != frontIndex) && (idx != frontIndex+1) && (idx != frontIndex - 1)) return
// //         let cont = dataset[j]
// //         return(
// //           <motion.div
// //             key={idx}
// //             // animate={(j == js[frontIndex]) ? "front" : (j > js[frontIndex])? "next" : "back"}
// //             transition={{type: 'spring', stiffness:'500', damping: '60', mass: '1'}}
// //             custom={idx}
// //             // variants={variants}
// //             animate={bubbleControls}
// //             style={{position: 'absolute', left: 0, right: 0}}
// //             ref={el => motionRef.current[idx] = el}
// //           >
// //             {cont.forumpost_id?
// //               <BubbleBasicLayout 
// //               mirror={(index % 2 == 0)?false:true} color={cont.hex_color}
// //               profile={cont}
// //               makeScroll={scrollInfo => {
// //                 if((scrollInfo.deltaY > 0) && js[idx+1] != null){
// //                   reorder({i: index,j: js[idx+1]})
// //                   setFrontIndex(idx+1)
// //                 }else if((scrollInfo.deltaY < 0) &&
// //                 js[idx-1] != null){
// //                   reorder({i: index,j: js[idx-1]})
// //                   setFrontIndex(idx-1)
// //                 }else{
// //                   null
// //                 }
// //               }}
// //               isInTheBackground={(j != js[frontIndex])}
// //               postDate={cont.created}
// //               >
// //                 <ConditionalLink condition={idx!=frontIndex} href={`/forum/${router.query.index[0]}/post/${cont.forumpost_id}`}>
// //                   <a>
// //                     <BubbleView
// //                     message={cont.message}
// //                     mylike={cont.mylike}
// //                     inFront={idx==frontIndex}
// //                     setLike={
// //                       () => new Promise((resolve, reject) => {
// //                         axios.post(`https://http-server-vkp2ityhga-ew.a.run.app/update/forum/like`,
// //                         {forumpost_id: cont.forumpost_id}
// //                         ,{withCredentials: true}
// //                         ).then(async response => {
// //                           resolve()
// //                         })
// //                         .catch(error =>{
// //                           console.log(error)
// //                           if(error.response) toast.error(`${error.response.status}: An error occured`)
// //                           reject()
// //                         })
// //                       })
// //                     }
// //                     onClickReply={onClickReply}
// //                     />
// //                   </a>
// //                 </ConditionalLink>
// //               </BubbleBasicLayout>
// //             :cont.pagename?
// //               <Square content={{page: cont}}/>
// //             :cont.topic_id?
// //               <Square 
// //               isInTheBackground={(j != js[frontIndex])}
// //               content={{topic: cont}} 
// //               makeScroll={scrollInfo => {
// //                 if((scrollInfo.deltaY > 0) && js[idx+1] != null){
// //                   reorder({i: index,j: js[idx+1]})
// //                   setFrontIndex(idx+1)
// //                 }else if((scrollInfo.deltaY < 0) &&
// //                 js[idx-1] != null){
// //                   reorder({i: index,j: js[idx-1]})
// //                   setFrontIndex(idx-1)
// //                 }else{
// //                   null
// //                 }
// //               }}/>
// //             :
// //               null
// //             }
// //           </motion.div>
// //         )
// //       })}
// //     </div>
// //   )
// // }

// // const ConditionalLink = ({children, condition, href}) => (condition == true)?<Link href={href}>{children}</Link>:<>{children}</>

// // export async function getServerSideProps(context) {
// //   try{
// //     const res = await axios.get(`https://http-server-vkp2ityhga-ew.a.run.app/get/${context.resolvedUrl}`)
// //     return{
// //       props: {
// //         ssrContent: res.data.content?res.data.content:null,
// //         ssrTreeCount: res.data.tree_count?res.data.tree_count:null
// //       }
// //     }
// //   }catch(error){
// //     console.log(error)
// //     return {
// //       notFound: true
// //     }
// //   }
// // }
