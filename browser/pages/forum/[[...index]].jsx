import { useState } from 'react'
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

export default function index({root, content}) {
  const edit_bubble_index = useForumStore(state => state.edit_bubble_index)
  const setEditBubbleIndex = useForumStore(state => state.setEditBubbleIndex)
  const [profile, isLoading, setUser] = useUserProfile()
  const [editHexColor, setEditHexColor] = useState()
  const [isBottomHighlight, setIsBottomHighlight] = useState()
  const pageQuery = useQuery(`page/${root.page.unique_pagename}`,
  async () => {
    const res = await axios.get(`http://localhost:4000/get/page/${root.page.unique_pagename}`)
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

  const sendPost = (post, index, hex) => {
    let arg;

    if(index == 0){
      arg = 
      root.mission?
        {
          parent_key: root.mission.title,
          subject: 1
        }
      :
        {
          subject: 0
        }// If root = Page, return nothing
    }
    //else if(){
    // subject: 'post'
    // Handle Post through parent post id with index-1
    // }else{
    //   return
    //   toast.error('Subject not found')
    // }
    axios.post('http://localhost:4000/post/forum',{
      ...{
        forum_post: post,
        hexColor: hex,
        unique_pagename: root.page.unique_pagename,
      }, 
      ...arg
    },{
      withCredentials: true
    }
    ).then(async response => {
      console.log('posted')
    })
    .catch(error =>{
      if(error.response) toast.error(`${error.response.status}: An error occured`)
    })
  }

  return (
    <ForumLayout>
      <Square content={{page:root.page}}/>
      {root.mission?<Square content={{mission:root.mission}}/>:null}
      {content && content.map((cont, index) => {
        <Bubble 
        cont={cont} 
        index={index} 
        profile={profile} 
        setEditBubbleIndex={setEditBubbleIndex} 
        edit_bubble_index={edit_bubble_index}
        sendPost={(post, hex) => sendPost(post, index, hex)}/>
      })}
      <BubbleBasicLayout 
      color={editHexColor} 
      profile={profile}
      isHighlight={isBottomHighlight}>
        <BubbleEdit 
        sendPost={post => sendPost(post, content?content.length:0, editHexColor)} 
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

  return(
    <BubbleBasicLayout 
    mirror={(index % 2 == 0)?false:true} color={index == edit_bubble_index?editHexColor:cont.hex_color}
    profile={(cont && cont.profilePicture)?cont.profilePicture:profile.profilePicture}
    isHighlight={isHighlight}
    >
      {index == edit_bubble_index?
        <BubbleEdit 
        sendPost={(sendPost, editHexColor)}  
        setEditHexColor={setEditHexColor} 
        setIsHighlight={setIsHighlight}/>
      :
        <BubbleView 
        onClick={setEditBubbleIndex(index)}/>
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
    console.log(context.params.index[1])
    const res = await axios.get(`http://localhost:4000/get/forum/
      ${context.params.index?context.params.index[0]:null}/
      ${context.params.index[1]?context.params.index[1]:null}/
      ${context.params.index[2]?context.params.index[2]:null}/
      ${context.params.index[3]?context.params.index[3]:null}/
      ${context.query.tree?context.query.tree:null}`)
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
