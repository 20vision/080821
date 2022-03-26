import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function Carousel({children, index, highlightIndex}){
    const controls = useAnimation()

    useEffect(() => {
        controls.start(() => {
            return({
                zIndex: index==highlightIndex?2:1,
                top: index==highlightIndex?'5%':index>highlightIndex?'15%':'0%', 
                bottom: index==highlightIndex?'5%':index>highlightIndex?'0%':'15%', 
                right: index==highlightIndex?'0%':'10%', 
                left: index==highlightIndex?'0%':'10%',
                opacity: index==highlightIndex?1:0.1,
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
            top: index==highlightIndex?'5%':index>highlightIndex?'15%':'0%', 
            bottom: index==highlightIndex?'5%':index>highlightIndex?'0%':'15%', 
            right: index==highlightIndex?'0%':'10%', 
            left: index==highlightIndex?'0%':'10%',
            opacity: index==highlightIndex?1:0.1,
        }}>
            {children}
        </motion.div>
    )
}