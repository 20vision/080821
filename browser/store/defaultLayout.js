import create from 'zustand'
import { devtools } from 'zustand/middleware'

let menuStore = (set) => ({
    opened: false,
    toggle: () => set(state => ({ opened: !state.opened }))
})

menuStore = devtools(menuStore)

export const useMenuStore = create(menuStore)
