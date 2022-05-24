import create from 'zustand'
import { devtools } from 'zustand/middleware'

let pageSelectedStore = (set) => ({
    page: null,
    setPageSelection: (page) => set({page: page}),
    mission: null,
    setMissions: (missions) => set({missions: missions})
})

pageSelectedStore = devtools(pageSelectedStore)

export const usePageSelectedStore = create(pageSelectedStore)
