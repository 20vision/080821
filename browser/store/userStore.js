import create from 'zustand'
import { devtools } from 'zustand/middleware'

let userStore = (set) => ({
    profile: {
        username: null,
        profilePicture: null
    },
    getUser: (profile) => set(state => (state.profile = profile))
})

userStore = devtools(userStore)

export const useUserStore = create(userStore)
