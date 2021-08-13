import React from "react";
import Layout from "../components/Layout";
import Sucursal from "../components/Sucursal";
import { gql, useQuery } from "@apollo/client";

const OBTENER_CLIENTES = gql`
  query obtenerEmpresasRepresentante {
    obtenerEmpresasRepresentante {
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
    }
  }
`;

const MisSucursales = () => {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES);

  if (loading) return null;

  const { obtenerEmpresasRepresentante } = data;

  return (
    <Layout>
      <div className='grid grid-cols-2 gap-4  my-1 mx-2'>
        {obtenerEmpresasRepresentante.map((empresa) => (
          <Sucursal key={empresa.id} empresa={empresa} />
        ))}
      </div>
    </Layout>
  );
};

export default MisSucursales;
