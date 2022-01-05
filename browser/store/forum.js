import create from 'zustand'
import { devtools } from 'zustand/middleware'

let forumStore = (set) => ({
    replyIndex: null,
    setReplyIndex: (index) => set({replyIndex: index})
})

forumStore = devtools(forumStore)

export const useForumStore = create(forumStore)
