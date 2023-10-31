import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Login from './Login'
import CoinList from './CoinList'
import FormValidationExample from './FormValidate'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/login' component={<Login />}></Route>
      <Route path='/home' element={<CoinList />}></Route>
      <Route path='/form' element={<FormValidationExample/>}></Route>
      <Route><SignIn/></Route>
    </Routes>
    </BrowserRouter>
  )
}



export default App
