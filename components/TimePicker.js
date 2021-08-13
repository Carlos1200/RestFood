import React, { useContext } from "react";
import LuxonUtils from "@date-io/luxon";
import SucursalContext from "../context/sucursales/SucursalContext";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const TimePicker = ({ tipo }) => {
  const sucursalContext = useContext(SucursalContext);
  const { fechaInicio, fechaFinal, obtenerFechaInicio, obtenerFechaFinal } =
    sucursalContext;

  const handleDateChange = (date) => {
    if (tipo === "inicio") {
      obtenerFechaInicio(date);
    } else {
      obtenerFechaFinal(date);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
      <KeyboardTimePicker
        margin='normal'
        id='time-picker'
        label='Selecciona una hora'
        value={tipo === "inicio" ? fechaInicio : fechaFinal}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change time",
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default TimePicker;
