import create from 'zustand'
import { devtools } from 'zustand/middleware'

let pageSelectedStore = (set) => ({
    fetch: null,
    setFetch: (fetch) => set({fetch: fetch}),
    page: null,
    setPageSelection: (page) => set({page: page}),
    following: null,
    setFollowing: (following) => set({following: following}),
    missions: null,
    setMissions: (missions) => set({missions: missions})
})

pageSelectedStore = devtools(pageSelectedStore)

export const usePageSelectedStore = create(pageSelectedStore)
