import { useState } from 'react'
import PageLayout from '../../layouts/page'
import PaperPreview from '../User/Carousel/PaperPreview'

export default function PagePanel({page, missions}) {
  const [selectedComponent, setSelectedComponent] = useState()

  return (
    <PageLayout page={page} missions={missions} comp={selectedComponent?selectedComponent:null} subs={selectedComponent?selectedComponent.subs:null}>
      <PaperPreview setSelectedComponent={setSelectedComponent}/>
    </PageLayout>
  )
}
