import { useState, useEffect } from 'react'
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
import { useForumStore } from '../../store/forum'
import useUserProfile from '../../hooks/User/useUserProfile'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
export default function index({root, content}) {
  const edit_bubble_index = useForumStore(state => state.edit_bubble_index)
  const setEditBubbleIndex = useForumStore(state => state.setEditBubbleIndex)
  const [profile, isLoading, setUser] = useUserProfile()
  const [editHexColor, setEditHexColor] = useState()
  const [isBottomHighlight, setIsBottomHighlight] = useState()
  const router = useRouter()
  let contentQuery = useQuery(`forum-post/${content[0].forumpost_id}`, async () => {
    const res = await axios.get(`http://localhost:4000/get${router.asPath}`)
    return res.data
  },
  {
    initialData: root.page,
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    onError: (error) => {
      console.error(error)
    },
  })

  useEffect(() => {
    console.log(router)
  }, [])

  const sendPost = (post, hex, postIndex) => {
    axios.post(`http://localhost:4000/post/forum${(postIndex>0)?'-post':''}/${
      (postIndex == 0)?
        (root.mission)?
          root.page.unique_pagename+'/'+root.mission.title
        :
          root.page.unique_pagename
      :
        contentQuery[postIndex - 1].forumpost_id
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
      {content.map((cont, index) => 
        <>
          <Bubble 
          cont={cont} 
          index={index} 
          profile={profile} 
          setEditBubbleIndex={setEditBubbleIndex} 
          edit_bubble_index={edit_bubble_index}
          sendPost={(post, hex) => sendPost(post, hex, index)}/>
        </>
      )}
      <BubbleBasicLayout 
      mirror={(content.length % 2 == 0)?false:true}
      color={editHexColor} 
      profile={profile}
      isHighlight={isBottomHighlight}>
        <BubbleEdit 
        sendPost={post => sendPost(post, editHexColor, content?content.length:0,)} 
        setEditHexColor={setEditHexColor}
        setIsHighlight={setIsBottomHighlight}
        />
      </BubbleBasicLayout>
    </ForumLayout>
  )
}

function Bubble({cont, index, profile, setEditBubbleIndex, edit_bubble_index, sendPost}) {
  const [editHexColor, setEditHexColor] = useState()
  const [isHighlight, setIsHighlight] = useState(false)
  useEffect((arg) => {
    console.log(arg)
  }, [setIsHighlight])
  return(
    <BubbleBasicLayout 
    mirror={(index % 2 == 0)?false:true} color={index == edit_bubble_index?editHexColor:cont.hex_color}
    profile={cont?cont:profile}
    isHighlight={isHighlight}
    >
      {index == edit_bubble_index?
        <BubbleEdit 
        sendPost={(sendPost, editHexColor)}  
        setEditHexColor={setEditHexColor} 
        setIsHighlight={setIsHighlight}/>
      :
        <BubbleView 
        message={cont.message}
        setEditBubbleIndex={() => setEditBubbleIndex(index)}/>
      }
    </BubbleBasicLayout>
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
