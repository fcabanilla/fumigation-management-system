import { useState, useEffect } from "react";

export const useLotes = () => {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarLotes = () => {
      try {
        const lotesGuardados = localStorage.getItem("lotes");
        if (lotesGuardados) {
          const lotesData = JSON.parse(lotesGuardados);
          setLotes(lotesData);
        }
      } catch (error) {
        // Error silencioso al cargar lotes
        setLotes([]);
      } finally {
        setLoading(false);
      }
    };

    cargarLotes();

    // Escuchar cambios en localStorage para actualizar en tiempo real
    const handleStorageChange = (e) => {
      if (e.key === "lotes") {
        cargarLotes();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Función para obtener un lote específico por ID
  const getLoteById = (id) => {
    return lotes.find((lote) => lote.id === id);
  };

  // Función para obtener lotes con geometría definida
  const getLotesConGeometria = () => {
    return lotes.filter((lote) => lote.geometria && lote.geometria.geometry);
  };

  return {
    lotes,
    loading,
    getLoteById,
    getLotesConGeometria,
  };
};

export default useLotes;
