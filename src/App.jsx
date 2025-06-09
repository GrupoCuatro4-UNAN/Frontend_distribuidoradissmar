import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/encabezado/Encabezado";
import Clientes from "./views/Clientes";
import Abonos from "./views/Abonos";
import Compras from "./views/Compras";
import Creditos from "./views/Creditos";
import Productos from "./views/Productos";
import Ventas from "./views/Ventas";
import './App.css';
import Estadisticas from "./views/Estadisticas";
import Dashboard from "./views/Dashboard";
import RutaProtegida from "./components/rutas/RutasProtegida";

const App = () => {
  return (
    <Router>
      <main className = "margen-superior-main">
      <Encabezado />
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<RutaProtegida vista = {<Inicio />}/>} />
        <Route path="/Clientes" element={<RutaProtegida vista = {<Clientes />}/>} />
        <Route path="/Abonos" element={<RutaProtegida vista = {<Abonos />} />} />
        <Route path="/Compras" element={<RutaProtegida vista = {<Compras />} />} />
        <Route path="/Creditos" element={<RutaProtegida vista = {<Creditos />} />} />
        <Route path="/Productos" element={<RutaProtegida vista = {<Productos />} />} />
        <Route path="/Ventas" element={<RutaProtegida vista = {<Ventas/>} />} />
        <Route path="/Estadisticas" element={<RutaProtegida vista = {<Estadisticas/>} />} />
        <Route path="/Dashboard" element={<RutaProtegida vista = {<Dashboard/>} />} />
        </Routes>


      </main>

    </Router>
  );
};

export default App;