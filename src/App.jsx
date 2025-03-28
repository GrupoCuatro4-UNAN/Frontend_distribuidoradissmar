import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/Encabezado/Encabezado";
import Clientes from "./views/Clientes";
import Abonos from "./views/Abonos";
import Compras from "./views/Compras";
import Creditos from "./views/Creditos";
import Detalles_Compras from "./views/Detalles_Compras";
import Detalles_Ventas from "./views/Detalles_Ventas";
import Productos from "./views/Productos";
import Ventas from "./views/Ventas";
import './App.css';

const App = () => {
  return (
    <Router>
      <main className = "margen-superior-main">
      <Encabezado />
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/Abonos" element={<Abonos />} />
        <Route path="/Compras" element={<Compras />} />
        <Route path="/Creditos" element={<Creditos />} />
        <Route path="/Detalles_Compras" element={<Detalles_Compras />} />
        <Route path="/Detalles_Ventas" element={<Detalles_Ventas />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/Ventas" element={<Ventas/>} />
        </Routes>


      </main>

    </Router>
  );
};

export default App;