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
/*
  Route design
  /forum/type?r=root_id&s=subject&v=version_id
  type -> @unique_username, pagename, portfolio, discover, following, saved
  root_id = id of root (*empty*(page/all), mission, topic, paper, post) algorithm works of. If not page has to be in combination with subject "Type"
  subject -> *empty*(all), missions, topics, papers, posts
  version_id -> sub_post_id where hierarchy is defined
*/

export default function index({root, content}) {
  const edit_bubble_index = useForumStore(state => state.edit_bubble_index)
  const setEditBubbleIndex = useForumStore(state => state.setEditBubbleIndex)
  const [profile, isLoading, setUser] = useUserProfile()
  const [editHexColor, setEditHexColor] = useState()
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

  const sendPost = (post, index) => {
    let arg;

    if(index == 0){
      arg = 
      root.mission?
        {
          parentId: root.mission.title,
          subject: 'mission'
        }
      :
        {
          parentId: root.page.unique_pagename
        }
    }

    axios.post('http://localhost:4000/forum',{
        post: post,
        hexColor: hex,
        arg
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
        sendPost={post => sendPost(post, index)}/>
      })}
      <BubbleBasicLayout 
      color={editHexColor} 
      profile={profile}>
        <BubbleEdit sendPost={post => sendPost(post, content.length)} setEditHexColor={setEditHexColor}/>
      </BubbleBasicLayout>
    </ForumLayout>
  )
}

function Bubble({cont, index, profile, setEditBubbleIndex, edit_bubble_index, sendPost}) {
  const [editHexColor, setEditHexColor] = useState()
  const [isHighlight, setIsHighlight] = useState()

  return(
    <BubbleBasicLayout 
    mirror={(index % 2 == 0)?false:true} color={index == edit_bubble_index?editHexColor:cont.hex_color}
    profile={(cont && cont.profilePicture)?cont.profilePicture:profile.profilePicture}
    isHighlight={isHighlight}
    >
      {index == edit_bubble_index?
        <BubbleEdit 
        sendPost={sendPost}  
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
  try{
    const res = await axios.get(`http://localhost:4000/get/forum/${context.params.index?context.params.index[0]:null}/${context.query.r}/${context.query.s}/${context.query.v}`)
    return{
      props: {
        root:{
          page: res.data.page,
          mission: res.data.mission?res.data.mission:null
        }
      }
    }
  }catch(error){
    console.log(error)
    return {
      notFound: true
    }
  }
}
