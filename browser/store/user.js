import create from 'zustand'
import { devtools } from 'zustand/middleware'



let userStore = (set) => ({
    profile: {
        username: null,
        profilePicture: null,
        public_key: null,
        fetched: false
    },
    setUser: (profile) => set({profile: profile})
})

userStore = devtools(userStore)

export const useUserStore = create(userStore)
