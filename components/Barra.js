import React from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      nombre
      apellido
    }
  }
`;

const Barra = () => {
  const { data, loading, error } = useQuery(OBTENER_USUARIO);

  const router = useRouter();

  if (loading) {
    return "Cargando";
  }
  if (!data.obtenerUsuario) {
    return router.push("/login");
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className='sm:flex sm:justify-between bg-gray-900 py-3'>
      <Link href='/'>
        <h1 className='ml-5 text-2xl font-bold text-white cursor-pointer'>
          RestFood
        </h1>
      </Link>
      <div className='sm:flex items-center'>
        <p className='text-white text-lg mr-3'>
          Usuario: <span className='font-bold'>{`${nombre} ${apellido}`}</span>
        </p>
        <button
          onClick={() => cerrarSesion()}
          className='text-lg font-bold py-2 px-2 mr-5 bg-red-700 text-white rounded-lg hover:bg-red-900'>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Barra;
