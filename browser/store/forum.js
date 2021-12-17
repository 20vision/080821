import create from 'zustand'
import { devtools } from 'zustand/middleware'

let forumStore = (set) => ({
    menu: '/',
    setMenu: (type) => set(state => ({ menu: type }))
})

forumStore = devtools(forumStore)

export const useForumStore = create(forumStore)
