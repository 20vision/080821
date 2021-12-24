import create from 'zustand'
import { devtools } from 'zustand/middleware'

let forumStore = (set) => ({
    edit_bubble_index: null,
    setEditBubbleIndex: (index) => set(state => ({ edit_bubble_index: index })),
})

forumStore = devtools(forumStore)

export const useForumStore = create(forumStore)
