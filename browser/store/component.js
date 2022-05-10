import create from 'zustand'
import { devtools } from 'zustand/middleware'

let componentStore = (set) => ({
    editMode: false,
    setEditMode: (editMode) => set({editMode: editMode})
})

componentStore = devtools(componentStore)

export const useComponentStore = create(componentStore)
