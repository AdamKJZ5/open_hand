import { BrowserRouter, Routes, Route} from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Dashboard from "./pages/Dashboard"
import Register from './pages/Register';
import Login from './pages/Login';
import ResidentApplicationForm from './pages/ResidentApplicationForm';
import ManageApplications from './pages/ManageApplications';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route element ={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/apply" element={<ResidentApplicationForm />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
          <Route path="/" element={<h1>Welcome to Open Hand Care</h1>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
