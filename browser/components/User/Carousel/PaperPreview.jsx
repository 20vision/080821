import axios from 'axios'
import { useEffect, useState } from 'react'
import CarouselItem from '../../../components/User/Carousel/CarouselItem'
import styles from '../../../styles/pageLayout/page.module.css'
import { useRouter } from 'next/router'
import { DateTime } from "luxon";
import config from '../../../public/config.json';
import { motion, useAnimation } from 'framer-motion';

export default function PaperPreview({setSelectedComponent}){
    const [components, setComponents] = useState([])
    const [componentsQueryLimitReached, setComponentsQueryLimitReached] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState(0)
    const [isInWheelTransition, setIsInWheelTransition] = useState(false)
    const router = useRouter()
    const controls = useAnimation()

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
        axios.get(`http://localhost:4000/get/component/${components[highlightIndex].uid}/subs`)
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
            transition: { duration: 0.15}
        })
        })
        setIsInWheelTransition(false)
    }, [highlightIndex, components])

    const getComponents = async() => {
        if(!componentsQueryLimitReached){
        try{
            let components_data = (await axios.get(`http://localhost:4000/get/page/${router.query.page?router.query.page+'/':''}components/${components.length}${router.query.mission?'/'+router.query.mission:null}`)).data
            if(components_data.length != 3) setComponentsQueryLimitReached(true)
            setComponents([...components,...components_data])
        }catch(err){
            console.error(err)
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
                if(isInWheelTransition) return
                if((scrollInfo.deltaY < 0) && (0 != highlightIndex)){
                  setIsInWheelTransition(true)
                  await controls.start(() => {
                    return({
                        opacity: 0,
                        y: 15,
                        scale: 0.95,
                        transition: { duration: 0.1}
                    })
                  })
                  setHighlightIndex(highlightIndex-1)
                }else if((scrollInfo.deltaY > 0) && (components.length > (highlightIndex+1))){
                  setIsInWheelTransition(true)
                  await controls.start(() => {
                    return({
                        opacity: 0,
                        y: 15,
                        scale: 0.95,
                        transition: { duration: 0.1}
                    })
                  })
                  setHighlightIndex(highlightIndex+1)
                }else{
                  null
                }
              }}>
                {((index == highlightIndex+1) || (index == highlightIndex-1) || (index == highlightIndex))?
                  <div style={{cursor: 'pointer'}} onClick={() => router.push((index == highlightIndex)?`${component.unique_pagename}/${components[index].mission_title}/${components[index].uid}`:null)}>
                    <CarouselItem index={index} highlightIndex={highlightIndex}>
                      <div className={styles.paperPanel}>
                        <h1>{component.header}</h1>
                        <div style={{marginTop: 15, flexGrow: 1}}>
                          {(index == highlightIndex)?component.body:''}
                        </div>
                        <div className={styles.compFooter}>
                          <div>
                            <span style={{color: component.type == 'p'?'var(--blue)':component.type == 's'?'var(--yellow)':'var(--green)'}}>{component.type == 'p'?'Product':component.type == 's'?'Service':'Result'}</span>&nbsp;
                            <span>· {router.query.page?component.mission_title.replace(/_/g, ' '):'/'+component.unique_pagename}</span>
                          </div>
                          <span>
                            {DateTime.fromISO(component.created).toLocaleString(DateTime.DATE_MED)}
                          </span>
                        </div>
                      </div>
                    </CarouselItem>
                  </div>
                :null}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}