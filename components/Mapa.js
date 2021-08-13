import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import IconLocation from "./Icons/Restaurante";
import Markers from "../components/Markers";
import { useRouter } from "next/router";
import SucursalContext from "../context/sucursales/SucursalContext";
import { gql, useQuery } from "@apollo/client";
import "leaflet/dist/leaflet.css";

const OBTENER_EMPRESA = gql`
  query obtenerEmpresas {
    obtenerEmpresas {
      id
      nombre
      informacion
      representante
      tipo
      horario {
        diaLaboral
        horaInicio
        horaFinal
      }
      ubicacion {
        lat
        lon
      }
    }
  }
`;

const Mapa = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(OBTENER_EMPRESA);
  const sucursalContext = useContext(SucursalContext);
  const { obtenerUbicacion } = sucursalContext;

  //Proteger que no accedamos a data antes de tener resultados

  const center = {
    lat: 13.7,
    lng: -89.211,
  };
  const [position, setPosition] = useState(center);
  useEffect(() => {
    obtenerUbicacion([position.lat, position.lng]);
  }, [position]);
  const DraggableMarker = () => {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
          }
        },
      }),
      []
    );

    return (
      <Marker
        icon={IconLocation}
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}></Marker>
    );
  };

  if (loading) return null;

  const { obtenerEmpresas } = data;

  return (
    <MapContainer center={center} zoom={13} className='h-5/6 z-0'>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {obtenerEmpresas.map((empresa) => (
        <Markers key={empresa.id} empresa={empresa} />
      ))}
      {router.pathname === "/nuevasucursal" ? <DraggableMarker /> : null}
    </MapContainer>
  );
};

export default Mapa;
