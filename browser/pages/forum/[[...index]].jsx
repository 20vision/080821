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
  const [animateNewBubblesFromIndex, setAnimateNewBubblesFromIndex] = useState()

  useEffect(async() => {
    if(profile.username != null){
      try{
        const user_dataset = (await axios.get(`http://localhost:4000/get${router.asPath}`,{withCredentials: true})).data.content
        setDataset(user_dataset)
      }catch(err){
        console.log(err)
        toast.error('Could not fetch post info')
      }
    }
  }, [profile])


  const reorder = ({i, j}) => new Promise(async(resolve, reject) => {
    setAnimateNewBubblesFromIndex(i)
    let new_filteredContent = JSON.parse(JSON.stringify(filteredContent)).slice(0,i+1)
    let new_selectedContent = [...JSON.parse(JSON.stringify(selectedContent)).slice(0,i),j]
    let new_dataset = JSON.parse(JSON.stringify(dataset))

    if(new_dataset[i][j].left + 1 != new_dataset[i][j].right){
      for(let y=i;y<new_selectedContent.length;y++){
        if((new_dataset[y][new_selectedContent[y]].left + 1 == new_dataset[y][new_selectedContent[y]].right)) break
        let filtered = [];
        if(new_dataset[y+1]) {
          for(let x=0;x<new_dataset[y+1].length;x++){
            if(new_dataset[y+1][x].left>new_dataset[y][new_selectedContent[y]].left &&
              new_dataset[y+1][x].right<new_dataset[y][new_selectedContent[y]].right &&
              new_dataset[y+1][x].forumpost_parent_id == new_dataset[y][new_selectedContent[y]].forumpost_parent_id){
              filtered.push(x)
            }
          }
        }
        
        if(filtered.length == 0){
          try{
            const getPosts = await axios.get(`http://localhost:4000/get/forum-post/${new_dataset[y][new_selectedContent[y]].forumpost_id}`,{
              withCredentials: true
            })
            if(getPosts.data.length > 0){
              for(var xs=0;xs<getPosts.data[0].length;xs++){
                filtered.push(xs+((new_dataset[y+1] != null)?new_dataset[y+1].length:0))
              }
              for(var ys=0;ys<getPosts.data.length;ys++){
                new_dataset[y+ys+1] = (new_dataset[y+ys+1]!=null)?[...new_dataset[y+ys+1],...getPosts.data[ys]]:[...getPosts.data[ys]]
              }
            }else{
              break
            }
          }catch(err){
            console.log(err)
            toast.error('Could not get posts')
          }
        }
        new_selectedContent.push(filtered[0])
        new_filteredContent.push(filtered)
      }
    }
    
    setDataset(new_dataset)
    setFilteredContent(new_filteredContent)
    setSelectedContent(new_selectedContent)
    resolve()
  })

  const sendPost = (post, hex, index) => {
    axios.post(`http://localhost:4000/post/forum${(index>0)?'-post':''}/${
      (index == 0)?
        (root.mission)?
          root.page.unique_pagename+'/'+root.mission.title
        :
          root.page.unique_pagename
      :dataset[index - 1][selectedContent[index - 1]].forumpost_id
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

  const controls = useAnimation()

  useEffect(async() => {
    await controls.start(i => {
      if(i <= animateNewBubblesFromIndex) return ({})
      return({
        opacity: 1,
        y: 0,
        transition: {type: "spring", delay: i * 0.1}
      })
    });
  }, [])

  return (
    <ForumLayout>
      <Square content={{page:root.page}}/>
      {root.mission?<Square content={{mission:root.mission}}/>:null}
      {/*.slice(0,selectionLeftRightArray.length)*/}
      {dataset && filteredContent && filteredContent.map((js, i) => {

        return(
          <motion.div
          custom={i}
          animate={controls}
          initial={{opacity: 0,y: 20}}
          >
            <Bubble 
            key={i}
            dataset={dataset[i]}
            js={js}
            index={i} 
            profile={profile}
            reorder={async arg => {
              await controls.start(ic => {
                if(ic <= animateNewBubblesFromIndex) return ({})
                return({
                  opacity: 0,
                  y: 20,
                  transition: {type: "spring", duration: 0.3}
                })
              });
              await reorder(arg);
              await controls.start(ic => {
                if(ic <= animateNewBubblesFromIndex) return ({})
                return({
                  opacity: 1,
                  y: 0,
                  transition: {type: "spring", delay: ic * 0.1}
                })
              });
            }}
            sendPost={sendPost}
            frontIndexGlobal={selectedContent[i]}/>
          </motion.div>
        )
      })
      // && dataset.slice(0,filteredContent.length).map((cont, index) => 
      //   <Bubble 
      //   key={index}
      //   content={cont} 
      //   index={index} 
      //   profile={profile}
      //   reorder={reorder}
      //   sendPost={sendPost}/>
      // )
      }
      {loading ?
        <div key={index} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Loading/>
        </div>
      :
        <BubbleBasicLayout 
        mirror={(content.length % 2 == 0)?false:true}
        color={editHexColor} 
        profile={profile}
        makeScroll={() => null}>
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

function Bubble({dataset, index, profile, sendPost, reorder, js, frontIndexGlobal}) {
  const [editHexColor, setEditHexColor] = useState()
  const [frontHeight, setFrontHeight] = useState()
  const replyIndex = useForumStore(state => state.replyIndex)
  const motionRef = useRef()
  const [frontIndex, setFrontIndex] = useState(frontIndexGlobal)

  useEffect(() => {
    setFrontIndex(frontIndexGlobal)
  }, [frontIndexGlobal])

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
    setFrontHeight(motionRef.clientHeight)
  }, [motionRef])

  return(
    <div style={{marginBottom: '55px', position: 'relative', height: frontHeight}}>
      {(js.length != 0) && js.map((j, idx) => {
        let cont = dataset[j]
        return(
          <motion.div
            key={idx}
            initial={(j == frontIndex) ? "front" : (j > frontIndex)? "next" : "back"}
            animate={(j == frontIndex) ? "front" : (j > frontIndex)? "next" : "back"}
            transition={{type: 'spring', stiffness:'500', damping: '60', mass: '1'}}
            variants={variants}
            style={{position: 'absolute', left: 0, right: 0}}
            ref={el => (frontIndex != null)?(j == frontIndex)?motionRef = el:null:idx==0?motionRef = el:null}
          >
            <BubbleBasicLayout 
            mirror={(index % 2 == 0)?false:true} color={((replyIndex == index) && (j == frontIndex))?editHexColor:cont.hex_color}
            profile={((replyIndex == index) && (j == frontIndex))?profile:cont}
            makeScroll={scrollInfo => {
              if((scrollInfo.deltaY > 0) && js[idx+1] != null &&
                !((replyIndex == index) && (j == frontIndex))
              ){
                reorder({i: index,j: js[idx+1]})
                setFrontIndex(js[idx+1])
              }else if((scrollInfo.deltaY < 0) &&
              js[idx-1] != null &&
                !((replyIndex == index) && (j == frontIndex))
              ){
                reorder({i: index,j: js[idx-1]})
                setFrontIndex(js[idx-1])
              }else{
                null
              }
            }}
            isInTheBackground={(j != frontIndex)}
            postDate={cont.created}
            >
              {(replyIndex == index) && (j == frontIndex)?
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
