// https://redux-toolkit.js.org/

import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer
    }
})

// 从store本身推断出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store