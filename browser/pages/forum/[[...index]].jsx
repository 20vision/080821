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
import {useQuery} from 'react-query'
import useUserProfile from '../../hooks/User/useUserProfile'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import { motion, useAnimation } from 'framer-motion';
export default function index({root, content}) {
  const [profile, isLoading, setUser] = useUserProfile()
  const [editHexColor, setEditHexColor] = useState()
  const [replyActiveIndex, setReplyActiveIndex] = useState(null)
  const router = useRouter()
  let contentQuery = useQuery(`forum-post/${router.asPath}`, async () => {
    const res = await axios.get(`http://localhost:4000/get${router.asPath}`, {
      withCredentials: true
    })
    return res.data
  },
  {
    initialData: root.content,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    onSuccess: data => {
      console.log(data)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  // useEffect(() => {
  //   console.log(contentQuery.data && contentQuery.data.content?contentQuery.data.content[0]:null)
  // }, [contentQuery])

  const treeFromIndex = (post_index, new_front_sub_index) => {
    contentQuery = useQuery(`forum-post/${router.asPath}`, async () => {
      const res = await axios.get(`http://localhost:4000/get${router.asPath}`, {
        withCredentials: true
      })
      return res.data
    },
    {
      initialData: root.content,
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 1000 * 60 * 60 * 24,
      onSuccess: data => {
        console.log(data)
      },
      onError: (error) => {
        console.error(error)
      },
    })
  }

  const sendPost = (post, hex, postIndex) => {
    axios.post(`http://localhost:4000/post/forum${(postIndex>0)?'-post':''}/${
      (postIndex == 0)?
        (root.mission)?
          root.page.unique_pagename+'/'+root.mission.title
        :
          root.page.unique_pagename
      :
        (contentQuery.data && contentQuery.data.content)?contentQuery.data.content[postIndex - 1].forumpost_id:null
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
      {contentQuery && contentQuery.data && contentQuery.data.content.map((cont, index) => 
        <Bubble 
        key={index}
        content={cont} 
        index={index} 
        profile={profile}
        setReplyActiveIndex={setReplyActiveIndex}
        replyActiveIndex={replyActiveIndex}
        treeFromIndex={treeFromIndex}
        sendPost={(post, hex) => sendPost(post, hex, index)}/>
      )}
      <BubbleBasicLayout 
      mirror={(content.length % 2 == 0)?false:true}
      color={editHexColor} 
      profile={profile}>
        <BubbleEdit 
        sendPost={post => sendPost(post, editHexColor, content?content.length:0,)} 
        setEditHexColor={setEditHexColor}
        />
      </BubbleBasicLayout>
    </ForumLayout>
  )
}

function Bubble({content, index, profile, sendPost, replyActiveIndex, setReplyActiveIndex, treeFromIndex}) {
  const [editHexColor, setEditHexColor] = useState()
  const [frontIndex, setFrontIndex] = useState(0)
  const [frontHeight, setFrontHeight] = useState()

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
      {content.map((cont, idx) => {
        const motionRef = useRef(new Array())
        useEffect(() => {
          if(idx == frontIndex){
            setFrontHeight(motionRef.current[idx]?motionRef.current[idx].clientHeight:100)
          }
        }, [frontIndex, replyActiveIndex])
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
            mirror={(index % 2 == 0)?false:true} color={((replyActiveIndex == index) && (idx == frontIndex))?editHexColor:cont.hex_color}
            profile={((replyActiveIndex == index) && (idx == frontIndex))?profile:cont}
            makeScroll={scrollInfo => {
              if((scrollInfo.deltaY > 0) &&
                (frontIndex<content.length-1) &&
                !((replyActiveIndex == index) && (idx == frontIndex))
              ){
                setFrontIndex(frontIndex + 1)
                treeFromIndex(index, (frontIndex + 1))
              }else if((scrollInfo.deltaY < 0) &&
                (frontIndex>0) &&
                !((replyActiveIndex == index) && (idx == frontIndex))
              ){
                setFrontIndex(frontIndex - 1)
                treeFromIndex(index, (frontIndex - 1))
              }else{
                null
              }
            }}
            isInTheBackground={(idx != frontIndex)}
            postDate={cont.created}
            >
              {(replyActiveIndex == index) && (idx == frontIndex)?
                <BubbleEdit 
                sendPost={post => sendPost(post, editHexColor, index)}  
                setEditHexColor={setEditHexColor}
                isReplyActive={() => setReplyActiveIndex(null)}/>
              :
                <BubbleView 
                message={cont.message}
                mylike={cont.mylike}
                isReplyActive={() => setReplyActiveIndex(index)}
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
        content: res.data.content?res.data.content:null
      }
    }
  }catch(error){
    console.log(error)
    return {
      notFound: true
    }
  }
}
