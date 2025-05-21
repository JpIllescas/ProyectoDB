import React, { useEffect, useState } from "react";
import axios from "axios";

function Clientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/clientes") // Cambia el puerto si tu microservicio usa otro
      .then(res => setClientes(res.data))
      .catch(() => alert("Error al cargar clientes"));
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(c => (
          <li key={c.id_cliente}>{c.nombre} - {c.gmail} - {c.telefono}</li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;