import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Home from './pages/Home';
import AddMedication from './pages/AddMedication';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='addmedication' element={<AddMedication />} />
          <Route path="*" element={<NoPage />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
