import axios from 'axios'
import { useEffect, useState } from 'react'
import CarouselItem from '../../../components/User/Carousel/CarouselItem'
import styles from '../../../styles/pageLayout/page.module.css'
import { useRouter } from 'next/router'
import { DateTime } from "luxon";
import config from '../../../public/config.json';
import { motion, useAnimation } from 'framer-motion';
import Loading from '../../../assets/Loading/Loading'

export default function PaperPreview({setSelectedComponent}){
  const [components, setComponents] = useState([])
  const [componentsQueryLimitReached, setComponentsQueryLimitReached] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [isInWheelTransition, setIsInWheelTransition] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastScrollTimestamp, setLastScrollTimestamp] = useState(null)
  const router = useRouter()
  const controls = useAnimation()
  const paperPanelControls = useAnimation()

  useEffect(() => {
    if(highlightIndex == components.length-2){
      getComponents()
    }else if(highlightIndex == 0){
      getComponents()
    }
  }, [highlightIndex])

  useEffect(() => {
    if(components && components[highlightIndex]){
      setSelectedComponent(components[highlightIndex])
    }
  }, [components[highlightIndex]])

  useEffect(async() => {
      if(components[highlightIndex] && (components[highlightIndex].subs == null)){
      axios.get(`${config.HTTP_SERVER_URL}/get/component/${components[highlightIndex].uid}/subs`)
      .then(response => {
          setComponents([
          ...components.slice(0, highlightIndex),
          {...components[highlightIndex],subs: response.data},
          ...components.slice(highlightIndex+1)
          ])
      })
      .catch(err => {
          console.error(err)
      })
      }
      await controls.start(() => {
        return({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.25}
        })
      })
      setIsInWheelTransition(false)
  }, [highlightIndex, components])

  const getComponents = async() => {
      if(!componentsQueryLimitReached){
      try{
          setLoading(true)
          let components_data = (await axios.get(`${config.HTTP_SERVER_URL}/get/page/${router.query.page?router.query.page+'/':''}components/${components.length}${router.query.mission?'/'+router.query.mission:''} ${router.pathname == '/following'?'?filter=following':router.pathname == '/saved'?'?filter=saved':''}`, {withCredentials: true})).data
          setLoading(false)
          if(components_data.length != 3) setComponentsQueryLimitReached(true)
          setComponents([...components,...components_data])
      }catch(err){
          console.error(err)
          setLoading(false)
      }
      }
  }

  return(
      <div style={{position: 'relative', height: 'calc(90vh - 70px)', maxHeight: '935px', marginTop: 35}}>
      {components[highlightIndex]!=null?
        <motion.img 
        animate={controls}
        className={styles.comp_img}
        src={config.FILE_SERVER_URL+'comp_images/'+components[highlightIndex].uid.substring(0,components[highlightIndex].uid.length-8)+'/'+components[highlightIndex].uid.substring(components[highlightIndex].uid.length-8)+'/512x512'+'.webp'}/>
        :
        null
      }
      <div className={styles.compPreviewContainer}>
        <div style={{height: 407, position: 'relative', color: 'var(--lighter_black)'}}>
          {components && components.map((component, index) => (
            <div key={index} onWheel={async scrollInfo => {
              try{
                if(isInWheelTransition) return
                if((scrollInfo.deltaY < -5) && (0 != highlightIndex) && ((lastScrollTimestamp == null) || (lastScrollTimestamp < scrollInfo.timeStamp-1200))){
                  setLastScrollTimestamp(scrollInfo.timeStamp)
                  setIsInWheelTransition(true)
                  await controls.start(() => {
                    return({
                        opacity: 0,
                        y: 0.5,
                        scale: 0.95,
                        transition: { duration: 0.001}
                    })
                  })
                  setHighlightIndex(highlightIndex-1)
                }else if(((scrollInfo.deltaY > 5)) && (components.length > (highlightIndex+1)) && ((lastScrollTimestamp == null) || (lastScrollTimestamp < scrollInfo.timeStamp-1200))){
                  setLastScrollTimestamp(scrollInfo.timeStamp)
                  setIsInWheelTransition(true)
                  await controls.start(() => {
                    return({
                        opacity: 0,
                        y: 0.5,
                        scale: 0.95,
                        transition: { duration: 0.001}
                    })
                  })
                  setHighlightIndex(highlightIndex+1)
                }else{
                  scrollInfo.preventDefault();
                  scrollInfo.stopPropagation();
                  if((lastScrollTimestamp != null) && (lastScrollTimestamp > scrollInfo.timeStamp+1200)) setLastScrollTimestamp(scrollInfo.timeStamp)
                  return false;

                }
              }catch(err){
                console.error(err)
              }
            }}>
              {((index == highlightIndex+1) || (index == highlightIndex-1) || (index == highlightIndex))?
                <div style={{cursor: 'pointer'}} onClick={() => router.push((index == highlightIndex)?`/${component.unique_pagename}/${components[index].mission_title}/${components[index].uid}`:null)}>
                  <CarouselItem index={index} highlightIndex={highlightIndex}>
                    <motion.div 
                    initial={{
                      scale: 1.5,
                      opacity: 0,
                      borderRadius: index==highlightIndex?35:0.8*35,
                      padding: index==highlightIndex?35:0.8*35,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      borderRadius: index==highlightIndex?35:0.8*35,
                      padding: index==highlightIndex?35:0.8*35,
                    }}
                    exit={{
                      scale: 1.5,
                      opacity: 0
                    }} animation={paperPanelControls} className={styles.paperPanel}
                    >
                      <motion.h1 
                      initial={{fontSize: index==highlightIndex?24:0.8*24, lineHeight: index==highlightIndex?1:0.8}}
                      animate={{fontSize: index==highlightIndex?24:0.8*24, lineHeight: index==highlightIndex?1:0.8}}>{component.header}</motion.h1>
                      <div style={{marginTop: 15, flexGrow: 1}}>
                        {(index == highlightIndex)?component.body:''}
                      </div>
                      <div className={styles.compFooter}>
                        <div>
                          <span style={{color: component.type == 'p'?'var(--blue)':component.type == 's'?'var(--yellow)':'var(--green)'}}>{component.type == 'p'?'Product':component.type == 's'?'Service':'Result'}</span>&nbsp;
                          <span>· {component.mission_title.replace(/_/g, ' ')}</span>
                        </div>
                        <span>
                          {DateTime.fromISO(component.created).toLocaleString(DateTime.DATE_MED)}
                        </span>
                      </div>
                    </motion.div>
                  </CarouselItem>
                </div>
              :null}
            </div>
          ))}
          {loading?
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Loading/>
            </div>
          :components.length == 0?
            <div>
              <div style={{fontSize: 100, textAlign: 'center'}}>🧐</div>
              <h1 style={{color: 'var(--white)', textAlign: 'center'}}>No Result Found</h1>
            </div>
          :null}
        </div>
      </div>
    </div>
  )
}