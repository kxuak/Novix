
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import LadingPage from "./layouts/LadingPage";
import AppLayout from "./layouts/AppLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout/>}>
        <Route path="/home" element={<Home/>}/> 
        <Route path="/transacoes" element={<Transactions/>}/>
        <Route path="/metas" element={<Goals/>}/>
        <Route path="/settings" element={<Settings/>}/>
        </Route>

        <Route path="/" element={<LadingPage/>}/> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
);