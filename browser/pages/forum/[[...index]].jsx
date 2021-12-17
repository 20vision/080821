import { useEffect } from 'react'
import ForumLayout from '../../layouts/forum'
import Bubble from '../../components/Forum/Bubble' 
export default function index({children, missions}) {
  return (
    <ForumLayout>
      <Bubble/>
    </ForumLayout>
  )
}
