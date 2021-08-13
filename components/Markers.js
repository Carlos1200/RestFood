import React from "react";
import { Marker, Popup } from "react-leaflet";
import Restaurante from "./Icons/Restaurante";
import Carrito from "./Icons/Carrito";
import Tienda from "./Icons/Tienda";

const Markers = ({ empresa }) => {
  const {
    nombre,
    tipo,
    informacion,
    horario: { diaLaboral, horaInicio, horaFinal },
    ubicacion: { lat, lon },
  } = empresa;
  const inicio = new Date(horaInicio);
  const final = new Date(horaFinal);

  let Icono;

  if (tipo === "Restaurante") {
    Icono = Restaurante;
  } else if (tipo == "Supermercado") {
    Icono = Carrito;
  } else {
    Icono = Tienda;
  }

  const formatoinicio = `${
    inicio.getHours() >= 12 ? inicio.getHours() - 12 : inicio.getHours()
  }:${
    inicio.getMinutes() >= 10 ? inicio.getMinutes() : `0${inicio.getMinutes()}`
  } ${inicio.getHours() >= 12 ? "PM" : "AM"}`;

  const formatofinal = `${
    final.getHours() >= 12 ? final.getHours() - 12 : final.getHours()
  }:${
    final.getMinutes() >= 10 ? final.getMinutes() : `0${final.getMinutes()}`
  } ${final.getHours() >= 12 ? "PM" : "AM"}`;

  return (
    <Marker icon={Icono} position={[lat, lon]}>
      <Popup>
        <div className='h-full w-72 bg-gray-900 rounded-md'>
          <h2 className='font-bold text-xl text-white text-center'>{nombre}</h2>

          <div className='flex justify-around'>
            <p className='text-white font-bold'>
              Tipo: <span className='block font-normal'>{tipo}</span>
            </p>
            <p className='text-white font-bold'>
              Horario:{" "}
              <span className='block font-normal'>
                {formatoinicio} - {formatofinal}
              </span>
            </p>
          </div>
          {informacion && (
            <p className='text-white font-bold px-7 pb-4'>
              Información:{" "}
              <span className='block font-normal'>{informacion}</span>
            </p>
          )}

          <button
            type='button'
            className='px-3 py-2 text-lg font-bold w-full rounded-md bg-gray-700 text-white hover:bg-gray-800 shadow-lg'>
            Ver Sucursal
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default Markers;
