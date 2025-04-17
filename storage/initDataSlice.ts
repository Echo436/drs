import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface initDataState {
  isReady: boolean;
}

const initialState: initDataState = {
  isReady: false,
}

export const initDataSlice = createSlice({
  name: 'initData',
  initialState,
  reducers: {
    setInitDataStatus: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
})

export const { setInitDataStatus } = initDataSlice.actions
export default initDataSlice.reducer