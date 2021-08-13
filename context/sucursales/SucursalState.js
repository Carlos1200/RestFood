import React, { useReducer } from "react";
import SucursalContext from "./SucursalContext";
import sucursalReducer from "./SucursalReducer";
import {
  OBTENER_UBICACION,
  OBTENER_FECHA_INICIO,
  OBTENER_FECHA_FINAL,
} from "../../types";

const SucursalState = ({ children }) => {
  const initialState = {
    ubicacion: [],
    fechaInicio: new Date(),
    fechaFinal: new Date(),
  };

  const [state, dispatch] = useReducer(sucursalReducer, initialState);

  const obtenerUbicacion = (ubicacion) => {
    dispatch({
      type: OBTENER_UBICACION,
      payload: ubicacion,
    });
  };

  const obtenerFechaInicio = (hora) => {
    dispatch({
      type: OBTENER_FECHA_INICIO,
      payload: hora,
    });
  };
  const obtenerFechaFinal = (hora) => {
    dispatch({
      type: OBTENER_FECHA_FINAL,
      payload: hora,
    });
  };

  return (
    <SucursalContext.Provider
      value={{
        ubicacion: state.ubicacion,
        fechaInicio: state.fechaInicio,
        fechaFinal: state.fechaFinal,
        obtenerUbicacion,
        obtenerFechaInicio,
        obtenerFechaFinal,
      }}>
      {children}
    </SucursalContext.Provider>
  );
};

export default SucursalState;
