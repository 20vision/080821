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
  
  const [contentArray, setContentArray] = useState(ssrContent)
  const [selectionLeftRightArray, setSelectionLeftRightArray] = useState(() => {
    let array = [];
    for(var i = 0; i<ssrContent.length;i++){
      array.push({forumpost_parent_id: ssrContent[i][0].forumpost_parent_id, left: ssrContent[i][0].left, right: ssrContent[i][0].right})
    }
    return [...array]
  })

  useEffect(() => {
    console.log(selectionLeftRightArray)
    //setSelectionLeftRightArray([{forumpost_parent_id: 14, left: 0, right: 9}])
    console.log('CHANGE')
  }, [selectionLeftRightArray])

  // const fetchPosts = async() => new Promise((resolve, reject) => {
  //   axios.get(`http://localhost:4000/get${router.asPath}`, {
  //     withCredentials: true
  //   }).then(response => {
  //     resolve(response.data)
  //   }).catch(err => {
  //     reject({
  //       status: err.response.status,
  //       message: err.response.data
  //     })
  //   })
  // })

  // const setOrGetPosts = async(arg, maxNextFetchCount=100) => {
  //   setSelectionLeftRightArray(arg)
  //   setLoadingMore(true)
  //   let array = [...selectionLeftRightArray]
  //   for(var i=selectionLeftRightArray.length;((i<array.length+1) || ((i-selectionLeftRightArray.length)>=maxNextFetchCount));i++){
  //     if(!array[i] && contentArray[i-1]){
  //       for(var j=0;j<contentArray[i-1].length;j++){
  //         if(contentArray[i][j].forumpost_parent_id == array[i-1].forumpost_parent_id){
            
  //         }
  //       }
  //       contentArray[i-1][0]
  //     }
  //   }
  // }

  const sendPost = (post, hex, postIndex) => {
    axios.post(`http://localhost:4000/post/forum${(postIndex>0)?'-post':''}/${
      (postIndex == 0)?
        (root.mission)?
          root.page.unique_pagename+'/'+root.mission.title
        :
          root.page.unique_pagename
      :
        contentArray[postIndex - 1].forumpost_id
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
      {contentArray && contentArray.slice(0,selectionLeftRightArray.length).map((cont, index) => {
        let content;
        if(index != 0){
          if((selectionLeftRightArray[index - 1].left+1) == selectionLeftRightArray[index - 1].right){
            content = null
          }
          let filteredContent = []
          for(var i = 0; i<cont.length;i++){
            if((cont[i].forumpost_parent_id == selectionLeftRightArray[index-1].forumpost_parent_id) &&
              (cont[i].left > selectionLeftRightArray[index - 1].left) &&
              (cont[i].right < selectionLeftRightArray[index - 1].right)){
              filteredContent.push(cont[i])
            }
          }
          if(filteredContent.length == 0) content = null
          content = [...filteredContent]
        }else{
          content = [...cont]
        }
        return(<Bubble 
        key={index}
        content={content} 
        index={index} 
        profile={profile}
        setSelectionLeftRightArray={arg => {setSelectionLeftRightArray(arg);}}
        selectionLeftRightArray={selectionLeftRightArray}
        sendPost={(post, hex) => sendPost(post, hex, index)}/>)
      })}
      <BubbleBasicLayout 
      mirror={(content.length % 2 == 0)?false:true}
      color={editHexColor} 
      profile={profile}>
        <BubbleEdit 
        sendPost={post => sendPost(post, editHexColor, content?content.length:0)} 
        setEditHexColor={setEditHexColor}
        indx={content?content.length:0}
        />
      </BubbleBasicLayout>
    </ForumLayout>
  )
}

function Bubble({content, index, profile, sendPost, setSelectionLeftRightArray, selectionLeftRightArray}) {
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

  useEffect(() => {
    console.log(content)
  }, [])

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
                let oldSelectionArray = [...selectionLeftRightArray]
                oldSelectionArray.splice(index,(selectionLeftRightArray.length - index))
                oldSelectionArray.push({forumpost_parent_id: content[frontIndex + 1].forumpost_parent_id, left: content[frontIndex + 1].left, right: content[frontIndex + 1].right})
                setSelectionLeftRightArray(oldSelectionArray)
              }else if((scrollInfo.deltaY < 0) &&
                (frontIndex>0) &&
                !((replyIndex == index) && (idx == frontIndex))
              ){
                setFrontIndex(frontIndex - 1)
                let oldSelectionArray = [...selectionLeftRightArray]
                oldSelectionArray.splice(index,(selectionLeftRightArray.length - index))
                oldSelectionArray.push({forumpost_parent_id: content[frontIndex - 1].forumpost_parent_id, left: content[frontIndex - 1].left, right: content[frontIndex - 1].right})
                setSelectionLeftRightArray(oldSelectionArray)
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
                    ,{
                      withCredentials: true
                    }
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
