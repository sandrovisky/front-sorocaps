import { createSlice } from '@reduxjs/toolkit'

const logged = localStorage.getItem('logged') === 'true'
const name = localStorage.getItem('name')

export const slice = createSlice({
  name: '@userSlice',
  initialState: {
    name: name,
    logged: logged,
  },
  reducers: {
    logout(state) {      
      localStorage.setItem('logged', 'false')
      return {...state, name: '', logged: false}
    },
    changeUser(state, { payload }) {
      localStorage.setItem('logged', 'true')
      localStorage.setItem('name', payload)
      return {...state, name: payload, logged: true}
    },
    getUser(state) {
      return {...state}
    },
  }
})

export const { changeUser, logout, getUser } = slice.actions

export default slice.reducer