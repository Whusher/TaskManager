import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import LoginPage from './pages/Login/LoginPage';
import './index.css'
import App from './App.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import GroupPageM from './pages/Groups/GroupPage.jsx';
import TaskGroupsPage from './pages/TaskGroups/TasksGroupsPage.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Routes>
      <Route path="/login" Component={LoginPage}/>
      <Route path="/dashboard" Component={DashboardPage}/>
      <Route path="/register" Component={RegisterPage}/>
      <Route path="/groups" Component={GroupPageM}/>
      <Route path="/tasks_group" Component={TaskGroupsPage}/>
      <Route path="/" Component={LandingPage}/>
    </Routes>
  </BrowserRouter>
)
