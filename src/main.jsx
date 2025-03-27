import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/Login/LoginPage";
import "./index.css";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import RegisterPage from "./pages/Register/RegisterPage.jsx";
import GroupPageM from "./pages/Groups/GroupPage.jsx";
import TaskGroupsPage from "./pages/TaskGroups/TasksGroupsPage.jsx";
import IntegrantTasks from "./pages/IntegrantTasks/IntegrantTasks.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

/**Admin Pages */
import UsersList from "./admin/UserList.jsx";
import EditUser from "./admin/EditUser.jsx";
import CreateUser from "./admin/CreateUser.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/register" Component={RegisterPage} />
        <Route path="/" Component={LandingPage} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute Component={DashboardPage} />} />
        <Route path="/groups" element={<ProtectedRoute Component={GroupPageM} />} />
        <Route path="/tasks_group" element={<ProtectedRoute Component={TaskGroupsPage} />} />
        <Route path="/pendings_tasks" element={<ProtectedRoute Component={IntegrantTasks} />} />
        {/* Rutas protegidas admin */}
        <Route path="/users" element={<ProtectedRoute Component={UsersList} isAdmin={true} />} />
        <Route path="/edit/:id" element={<ProtectedRoute Component={EditUser} isAdmin={true} />} />
        <Route path="/create" element={<ProtectedRoute Component={CreateUser} isAdmin={true} />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);
