import create from 'zustand'
import { devtools } from 'zustand/middleware'

let modalStore = (set) => ({
    //saves all edits made on a component -> send to server. Server changes
    componentEdit: [],
    setComponentEdit: (modalType) => set({modal: modalType})
})

modalStore = devtools(modalStore)

export const useModalStore = create(modalStore)
