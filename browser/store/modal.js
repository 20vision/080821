import create from 'zustand'
import { devtools } from 'zustand/middleware'

/*
    Modal Type
    0 = no modal
    1 = Connect Wallet Modal
    2 = User
    3 = User Pages
    4 = Create Mission
    5 = Trade
*/

let modalStore = (set) => ({
    modal: 0,
    setModal: (modalType) => set({modal: modalType})
})

modalStore = devtools(modalStore)

export const useModalStore = create(modalStore)
