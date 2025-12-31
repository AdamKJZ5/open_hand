import { BrowserRouter, Routes, Route} from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Login from './pages/Login'
import Services from "./pages/Services"
import Careers from "./pages/Careers"
import Contact from "./pages/Contact"
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route element ={<MainLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Welcome to Open Hand Care</h1>} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
