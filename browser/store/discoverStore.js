import create from 'zustand'
import { devtools } from 'zustand/middleware'

let menuStore = set => ({
    menuOpened: false,
    openMenu: () => set({ menuOpened: !menuOpened })
})

menuStore = devtools(menuStore)

export const useMenuStore = create(menuStore)