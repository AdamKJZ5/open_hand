import { BrowserRouter, Routes, Route} from "react-router-dom"

import MainLayout from "./layouts/MainLayout"

import Home from "./pages/Home"
import Activities from "./pages/Activities"
import Dashboard from "./pages/Dashboard"
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResidentApplicationForm from './pages/ResidentApplicationForm';
import ManageApplications from './pages/ManageApplications';
import OurHomes from './pages/OurHomes';
import MyApplications from './pages/MyApplications';
import ManageOpportunityApplications from './pages/ManageOpportunityApplications';
import ContactUs from './pages/ContactUs';
import ManageLeads from './pages/ManageLeads';
import ManageUsers from './pages/ManageUsers';
import Careers from './pages/Careers';
import ManageJobPostings from './pages/ManageJobPostings';
import ManageJobApplications from './pages/ManageJobApplications';
import Welcome from './pages/Welcome';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route element ={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-homes" element={<OurHomes />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-activities" element={<MyApplications />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/apply" element={<ResidentApplicationForm />} />
          <Route path="/admin/applications" element={<ManageApplications />} />
          <Route path="/admin/opportunity-applications" element={<ManageOpportunityApplications />} />
          <Route path="/admin/leads" element={<ManageLeads />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/job-postings" element={<ManageJobPostings />} />
          <Route path="/admin/job-applications" element={<ManageJobApplications />} />
          <Route path="/careers" element={<Careers />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
