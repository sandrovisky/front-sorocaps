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
    },
    getUser(state) {
      return {...state}
    },
  }
})

export const { changeUser, logout, getUser } = slice.actions

export default slice.reducer