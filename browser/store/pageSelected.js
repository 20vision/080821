import create from 'zustand'
import { devtools } from 'zustand/middleware'



let pageSelectedStore = (set) => ({
    page: null,
    setPageSelection: (page) => set({page: page})
})

pageSelectedStore = devtools(pageSelectedStore)

export const usePageSelectedStore = create(pageSelectedStore)
