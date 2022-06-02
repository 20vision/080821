import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import PaperPreview from '../components/User/Carousel/PaperPreview'
const DefaultLayout = dynamic(
  () => import("../layouts/default"),
  {ssr : false}
)
import useUserProfile from '../hooks/User/useUserProfile'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState()
  const [profile, isLoading, setUser] = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if(isLoading) return
    if(!profile.username){
      toast.error("You must be logged in to view this page.")
      router.push('/')
    }
  }, [profile.username])

  return (
    <DefaultLayout comp={selectedComponent} subs={selectedComponent?selectedComponent.subs:null}>
      <PaperPreview setSelectedComponent={setSelectedComponent}/>
    </DefaultLayout>
  )
}
