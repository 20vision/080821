import { useState, useEffect } from 'react'
import PageLayout from '../../layouts/page'
import PaperPreview from '../User/Carousel/PaperPreview'
import {usePageSelectedStore} from '../../store/pageSelected'

export default function PagePanel({page, missions}) {
  const [selectedComponent, setSelectedComponent] = useState()
  const setPageSelection = usePageSelectedStore(state => state.setPageSelection)
  const fetch = usePageSelectedStore(state => state.fetch)
  const setFetch = usePageSelectedStore(state => state.setFetch)
  const setMissions = usePageSelectedStore(state => state.setMissions)

  useEffect(() => {
    if(page){
      setPageSelection(page)
      setFetch(false)
    }
    if(missions && fetch){
      setMissions(missions)
      setFetch(false)
    }
  }, [page, fetch, missions])

  return (
    <PageLayout page={page} missions={missions} comp={selectedComponent?selectedComponent:null} subs={selectedComponent?selectedComponent.subs:null}>
      <PaperPreview setSelectedComponent={setSelectedComponent}/>
    </PageLayout>
  )
}
