import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddProperty from "./pages/AddProperty";
import MyApplications from "./pages/MyApplications";
import OwnerApplications from "./pages/OwnerApplications";
import EditProperty from "./pages/EditProperty";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route
                    path="/properties"
                    element={<Properties />}
                />

                <Route
                    path="/properties/:id"
                    element={<PropertyDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
    path="/add-property"
    element={<AddProperty />}
/>
                <Route
    path="/owner-dashboard"
    element={<OwnerDashboard />}
/>
<Route path="/my-applications" element={<MyApplications />} />
           <Route
    path="/owner/applications/:propertyId"
    element={<OwnerApplications />}
/> 
<Route
    path="/edit-property/:id"
    element={<EditProperty />}
/>
<Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
            
        </BrowserRouter>
    );
}

export default App;