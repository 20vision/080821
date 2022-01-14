import { useState, useEffect, useRef } from 'react'
import ForumLayout from '../../layouts/forum'
import BubbleBasicLayout from '../../components/Forum/BubbleBasicLayout' 
import dynamic from 'next/dynamic';
const BubbleEdit = dynamic(() => import('../../components/Forum/BubbleEdit'), {
  ssr: false,
});
import BubbleView from '../../components/Forum/BubbleView'
import Square from '../../components/Forum/Square' 
import axios from 'axios'
import useUserProfile from '../../hooks/User/useUserProfile'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import { motion, useAnimation } from 'framer-motion';
import { useForumStore } from '../../store/forum';
import Loading from '../../assets/Loading/Loading';
export default function index({root, ssrContent}) {
  const [profile, isLoading, setUser] = useUserProfile()
  const [editHexColor, setEditHexColor] = useState()
  const router = useRouter()
  
  const [dataset, setDataset] = useState(ssrContent)
  const [loading, setLoading] = useState(false)
  const [filteredContent, setFilteredContent] = useState(() => {
    let filtered = []
    for(var i=0;i<ssrContent.length;i++){
      filtered[i] = []
      for(var j=0;j<ssrContent[i].length;j++){
        filtered[i].push(j)
      }
    }
    return filtered
  })
  const [selectedContent, setSelectedContent] = useState(() => {
    let selectedRoute = [];
    for(var i=0;i<ssrContent.length;i++){
      selectedRoute[i] = 0
    }
    return selectedRoute
  })

  const reorder = async({i, j}) => {
    let new_filteredContent = JSON.parse(JSON.stringify(filteredContent)).slice(0,i+1)
    let new_selectedContent = [...JSON.parse(JSON.stringify(selectedContent)).slice(0,i),j]
    console.log(new_filteredContent)
    console.log(new_selectedContent)
    for(let x=i;x<new_selectedContent.length;x++){
      for(let y=0;y<dataset[x+1].length;y++){
        if(dataset[x+1][y].left + 1 == dataset[x+1][y].right) break

        
      }
    }
    // setLoading(true)
    // let selectionArray = JSON.parse(JSON.stringify(filteredContent))
    // let selectedRoute = JSON.parse(JSON.stringify(selectedContent))
    // let new_dataset = JSON.parse(JSON.stringify(dataset))
    // selectionArray.splice(index+1,)
    // selectedRoute.splice(index,).push(parent_forumpost)
    // for(var i = selectionArray.length;i<selectionArray.length+1;i++){
    //   let variants = []

    //   if(new_dataset[i] && (new_dataset[i].length > 0)){
    //     for(var j=0;j<new_dataset[i].length;j++){
    //       if(
    //         (new_dataset[i][j].forumpost_parent_id == selectedRoute[i-1].forumpost_parent_id) && 
    //         (new_dataset[i][j].left > selectedRoute[i-1].left) &&
    //         (new_dataset[i][j].right < selectedRoute[i-1].right)
    //         ){
    //         variants.push(new_dataset[i][j])
    //       }
    //     }
    //     console.log(JSON.parse(JSON.stringify(variants)))
    //     if(variants.length > 0){
    //       selectionArray.push(variants)
    //       selectedRoute.push(variants[0])
    //     }else{
    //       try{
    //         const getPosts = await axios.get(`http://localhost:4000/get/forum-post/${selectedRoute[i-1].forumpost_id}`,{
    //           withCredentials: true
    //         })
    //         if(getPosts.data.length > 0){
    //           for(var s=i-1;s<(i-1)+getPosts.data.length;s++){
    //             new_dataset[s].push(getPosts.data[s])
    //           }
    //           selectionArray.push(getPosts.data[0])
    //           selectedRoute.push(getPosts.data[0][0])
    //         }else{
    //           break
    //         }
    //       }catch(err){
    //         console.log(err)
    //         toast.error('Could not get posts')
    //       }
    //     }
    //   }else{
    //     //fetch new
    //     console.log('FETCH')
    //     break
    //   }
    //   if(variants[0] && (variants[0].left + 1 == variants[0].right)) break
    // }
    
    // if(new_dataset != dataset) setDataset(new_dataset)
    // setSelectedContent(selectedRoute)
    // setFilteredContent(selectionArray)
    // setLoading(false)
  }

  const sendPost = (post, hex, index) => {
    axios.post(`http://localhost:4000/post/forum${(index>0)?'-post':''}/${
      (index == 0)?
        (root.mission)?
          root.page.unique_pagename+'/'+root.mission.title
        :
          root.page.unique_pagename
      :selectedContent[index - 1].forumpost_id
    }`,{forum_post: post, hex_color: hex},{
      withCredentials: true
    }
    ).then(async response => {
      console.log('posted')
    })
    .catch(error =>{
      console.log(error)
      if(error.response) toast.error(`${error.response.status}: An error occured`)
    })
  }

  return (
    <ForumLayout>
      <Square content={{page:root.page}}/>
      {root.mission?<Square content={{mission:root.mission}}/>:null}
      {/*.slice(0,selectionLeftRightArray.length)*/}
      {dataset && dataset.slice(0,filteredContent.length).map((cont, index) => {

        return(
          <Bubble 
          key={index}
          content={cont} 
          index={index} 
          profile={profile}
          reorder={reorder}
          sendPost={sendPost}/>
        )

      })}
      {loading ?
        <div key={index} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Loading/>
        </div>
      :
        <BubbleBasicLayout 
        mirror={(content.length % 2 == 0)?false:true}
        color={editHexColor} 
        profile={profile}>
          <BubbleEdit 
          sendPost={post => sendPost(post, editHexColor, selectedContent?selectedContent.length:0)} 
          setEditHexColor={setEditHexColor}
          indx={content?content.length:0}
          />
        </BubbleBasicLayout>
      }
      
    </ForumLayout>
  )
}

function Bubble({content, index, profile, sendPost, reorder}) {
  const [editHexColor, setEditHexColor] = useState()
  const [frontIndex, setFrontIndex] = useState(0)
  const [frontHeight, setFrontHeight] = useState()
  const replyIndex = useForumStore(state => state.replyIndex)

  const variants = {
    front: {
      opacity: 1,      
      scale: 1,
      zIndex: 1,
      y: '0%'
    },
    next: {
      opacity: 0.3,
      scale: 0.85,
      zIndex: 0,
      y: '20%'
    },
    back: {
      opacity: 0.3,
      scale: 0.85,
      zIndex: 0,
      y: '-10%'
    }
  }

  return(
    <div style={{marginBottom: '55px', position: 'relative', height: frontHeight}}>
      {(content.length != 0) && content.map((cont, idx) => {
        const motionRef = useRef(new Array())
        useEffect(() => {
          if(idx == frontIndex){
            setFrontHeight(motionRef.current[idx]?motionRef.current[idx].clientHeight:100)
          }
        }, [frontIndex, replyIndex])
        return(
          <motion.div
            key={idx}
            initial={(idx == frontIndex) ? "front" : (idx > frontIndex)? "next" : "back"}
            animate={(idx == frontIndex) ? "front" : (idx > frontIndex)? "next" : "back"}
            transition={{type: 'spring', stiffness:'500', damping: '60', mass: '1'}}
            variants={variants}
            style={{position: 'absolute', left: 0, right: 0}}
            ref={el => motionRef.current[idx] = el}
          >
            <BubbleBasicLayout 
            mirror={(index % 2 == 0)?false:true} color={((replyIndex == index) && (idx == frontIndex))?editHexColor:cont.hex_color}
            profile={((replyIndex == index) && (idx == frontIndex))?profile:cont}
            makeScroll={scrollInfo => {
              if((scrollInfo.deltaY > 0) &&
                (frontIndex<content.length-1) &&
                !((replyIndex == index) && (idx == frontIndex))
              ){
                setFrontIndex(frontIndex + 1)
                reorder({i: index,j: frontIndex + 1})
              }else if((scrollInfo.deltaY < 0) &&
                (frontIndex>0) &&
                !((replyIndex == index) && (idx == frontIndex))
              ){
                setFrontIndex(frontIndex - 1)
                reorder({i: index,j: frontIndex - 1})
              }else{
                null
              }
            }}
            isInTheBackground={(idx != frontIndex)}
            postDate={cont.created}
            >
              {(replyIndex == index) && (idx == frontIndex)?
                <BubbleEdit 
                sendPost={post => sendPost(post, editHexColor, index)}  
                setEditHexColor={setEditHexColor}
                indx={index}/>
              :
                <BubbleView 
                message={cont.message}
                mylike={cont.mylike}
                index={index}
                setLike={
                  () => new Promise((resolve, reject) => {
                    axios.post(`http://localhost:4000/update/like/forum-post`,
                    {forumpost_id: cont.forumpost_id}
                    ,{withCredentials: true}
                    ).then(async response => {
                      resolve()
                    })
                    .catch(error =>{
                      console.log(error)
                      if(error.response) toast.error(`${error.response.status}: An error occured`)
                      reject()
                    })
                  })
                }
                />
              }
            </BubbleBasicLayout>
          </motion.div>
        )
      })}
    </div>
  )
}

export async function getServerSideProps(context) {
  /*
  Route design
    /forum/unique_pagename[/t_or_m(topic or mission)/mission_title_OR_topic_name/paper(only if subject is mission)] ?tree(get exact post tree)
  */
  try{
    const res = await axios.get(`http://localhost:4000/get/${context.resolvedUrl}`)
    return{
      props: {
        root:{
          page: res.data.page,
          mission: res.data.mission?res.data.mission:null
        },
        ssrContent: res.data.content?res.data.content:null
      }
    }
  }catch(error){
    console.log(error)
    return {
      notFound: true
    }
  }
}


// const treeFromIndex = (post_index, new_front_sub_index) => {
//   // contentQuery = useQueries(`forum-post/${router.asPath}`, async () => {
//   //   const res = await axios.get(`http://localhost:4000/get${router.asPath}`, {
//   //     withCredentials: true
//   //   })
//   //   return res.data
//   // },
//   // {
//   //   initialData: root.content,
//   //   refetchOnWindowFocus: false,
//   //   refetchOnmount: false,
//   //   refetchOnReconnect: false,
//   //   retry: false,
//   //   staleTime: 1000 * 60 * 60 * 24,
//   //   onSuccess: data => {
//   //     console.log(data)
//   //   },
//   //   onError: (error) => {
//   //     console.error(error)
//   //   },
//   // })
// }
