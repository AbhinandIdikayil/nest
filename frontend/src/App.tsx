import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Cart from './pages/Cart'

function App() {

  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/cart/:id" element={<Cart />} />
    </Routes>
  )
}

export default App