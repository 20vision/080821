import dynamic from 'next/dynamic'
import { useState } from 'react'
import PaperPreview from '../components/User/Carousel/PaperPreview'
const DefaultLayout = dynamic(
  () => import("../layouts/default"),
  {ssr : false}
)
import useUserProfile from '../hooks/User/useUserProfile'

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState()
  const [profile, isLoading, setUser] = useUserProfile()

  return (
    <DefaultLayout comp={selectedComponent} subs={selectedComponent?selectedComponent.subs:null}>
      {profile.username?<PaperPreview setSelectedComponent={setSelectedComponent}/>:<div/>}
    </DefaultLayout>
  )
}
