import dynamic from 'next/dynamic'
import { useState } from 'react'
import PaperPreview from '../components/User/Carousel/PaperPreview'
const DefaultLayout = dynamic(
  () => import("../layouts/default"),
  {ssr : false}
)

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState()

  return (
    <DefaultLayout comp={selectedComponent} subs={selectedComponent?selectedComponent.subs:null}>
      <PaperPreview setSelectedComponent={setSelectedComponent}/>
    </DefaultLayout>
  )
}
