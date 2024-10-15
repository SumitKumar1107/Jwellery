import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import useUserRoutes from "./components/routes/userRoutes";
import useAdminRoutes from "./components/routes/adminRoutes"

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { Toaster } from 'react-hot-toast';
import NotFound from "./components/layout/NotFound";


function App() {

  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();

  return (
    <Router>
        <div className="App">
            <Toaster position="top-center"/>
            <Header/>
                <div className="container">
                    <Routes>
                        {userRoutes}
                        {adminRoutes}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            <Footer/>
        </div>
    </Router>
  );
}

export default App;
