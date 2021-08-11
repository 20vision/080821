import dynamic from 'next/dynamic'

const DefaultLayout = dynamic(
  () => import("../layouts/default"),
  {ssr : false}
)

export default function Home() {
  return (
    <DefaultLayout>
      <div>
        -DISCOVER-
      </div>
    </DefaultLayout>
  )
}
