import dynamic from 'next/dynamic'

const MenuNav = dynamic(
    () => import('../components/DefaultLayout/menuNav.js'),
    { ssr: false }
)
const Menu = dynamic(
    () => import('../components/menu.js'),
    { ssr: false }
)

export default function Layout({ children }) {
    return (
        <div class="flex">
            <div>
            {
                    <MenuNav/>
                    <Menu/>
                    return <div></div>
            }
            </div>
            <main>{children}</main>
        </div>
    )
}