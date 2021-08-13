import {
  OBTENER_UBICACION,
  OBTENER_FECHA_INICIO,
  OBTENER_FECHA_FINAL,
  OBTENER_TIPO,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case OBTENER_UBICACION: {
      return {
        ...state,
        ubicacion: action.payload,
      };
    }
    case OBTENER_FECHA_INICIO:
      return {
        ...state,
        fechaInicio: action.payload,
      };
    case OBTENER_FECHA_FINAL:
      return {
        ...state,
        fechaFinal: action.payload,
      };
    default:
      return state;
  }
};
