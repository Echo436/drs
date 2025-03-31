import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import storage from "@/storage/storage";
import { Colors } from '@/constants/Colors';

export interface ThemeState {
  primaryColor: string
}

const initialState: ThemeState = {
  primaryColor: Colors.light.tint
}


export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
      
      storage.save({
        key: 'primary-color',
        data: action.payload,
      });

    },
  },
})

// 导出action creators
export const { setPrimaryColor: setPrimaryColor } = themeSlice.actions

// 导出reducer
export default themeSlice.reducer