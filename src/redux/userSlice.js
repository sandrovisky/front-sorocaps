import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: '@userSlice',
  initialState: {
    name: '',
    logged: false,
  },
  reducers: {
    logout(state) {
      return {...state, name: '', logged: false}
    },
    changeUser(state, { payload }) {
      return {...state, name: payload, logged: true}
    }
  }
})

export const { changeUser, logout } = slice.actions

export const selectUser = state => state.name

export default slice.reducer