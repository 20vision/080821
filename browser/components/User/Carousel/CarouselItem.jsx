import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function Carousel({children, index, highlightIndex}){
    const controls = useAnimation()

    useEffect(() => {
        controls.start(() => {
            return({
                zIndex: index==highlightIndex?2:1,
                //h1: {scale: index==highlightIndex?1:0.6},
                top: index==highlightIndex?'5%':index>highlightIndex?'15%':'0%', 
                bottom: index==highlightIndex?'5%':index>highlightIndex?'0%':'15%', 
                right: index==highlightIndex?'0%':'10%', 
                left: index==highlightIndex?'0%':'10%',
                fontSize: index==highlightIndex?'100%':'80%',
                lineHeight: index==highlightIndex?'normal':'80%',
                //lineHeight: index==highlightIndex?'normal':'80%',
                opacity: index==highlightIndex?1:index<highlightIndex?0:0.7,
                transition: { duration: 0.35}
            })
        })
    }, [highlightIndex])

    return(
        <motion.div 
        animate={controls}
        style={{position: 'absolute'}}
        initial={{
            zIndex: index==highlightIndex?2:1,
            //h1: {scale: index==highlightIndex?1:0.6},
            top: index==highlightIndex?'5%':index>highlightIndex?'15%':'0%', 
            bottom: index==highlightIndex?'5%':index>highlightIndex?'0%':'15%', 
            right: index==highlightIndex?'0%':'10%', 
            left: index==highlightIndex?'0%':'10%',
            fontSize: index==highlightIndex?'100%':'80%',
            lineHeight: index==highlightIndex?'normal':'80%',
            //lineHeight: index==highlightIndex?'normal':'80%',
            opacity: index==highlightIndex?1:index<highlightIndex?0:0.7,
        }}>
            {children}
        </motion.div>
    )
}