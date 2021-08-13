import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const ELIMINAR_SUCURSAL = gql`
  mutation eliminarEmpresa($id: ID!) {
    eliminarEmpresa(id: $id)
  }
`;

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

const Sucursal = ({ empresa }) => {
  const {
    id,
    nombre,
    informacion,
    tipo,
    horario: { diaLaboral, horaInicio, horaFinal },
  } = empresa;

  const router = useRouter();

  const inicio = new Date(horaInicio);
  const final = new Date(horaFinal);

  const [eliminarEmpresa] = useMutation(ELIMINAR_SUCURSAL, {
    update(cache) {
      const { obtenerEmpresasRepresentante } = cache.readQuery({
        query: OBTENER_CLIENTES,
      });

      cache.writeQuery({
        query: OBTENER_CLIENTES,
        data: {
          obtenerEmpresasRepresentante: obtenerEmpresasRepresentante.filter(
            (empresa) => empresa.id !== id
          ),
        },
      });
    },
  });

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

  const eliminarSucursal = async () => {
    Swal.fire({
      title: "¿Deseas eliminar la empresa?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarEmpresa({
            variables: {
              id,
            },
          });

          //Mostrar una alerta
          Swal.fire("Eliminado!", data.eliminarEmpresa, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarSucursal = () => {
    router.push({
      pathname: "/editarsucursal/[id]",
      query: { id },
    });
  };

  return (
    <div className='bg-gray-900 rounded-md flex justify-around'>
      <div className='m-4'>
        <h2 className='text-white text-2xl font-light'>{nombre}</h2>
        <p className='text-white text-bold'>
          Tipo: <span className='font-light'>{tipo}</span>
        </p>
        <p className='text-white text-bold'>
          Horario:{" "}
          <span className='font-light'>
            {formatoinicio} - {formatofinal}
          </span>
        </p>
        <div className='flex text-white text-bold'>
          Días Laborales:
          {diaLaboral.map((dia) => (
            <p className='font-light mr-2'>{dia}</p>
          ))}
        </div>
        {informacion && (
          <p className='text-white'>Informacion: {informacion}</p>
        )}
      </div>
      <div className='flex flex-col justify-around '>
        <button
          type='button'
          className='px-3 py-1 text-lg font-bold rounded-md bg-yellow-700 text-white hover:bg-yellow-800 shadow-lg'
          onClick={() => editarSucursal()}>
          Editar
        </button>
        <button
          type='button'
          className='px-3 py-1 text-lg font-bold rounded-md bg-red-700 text-white hover:bg-red-800 shadow-lg'
          onClick={() => eliminarSucursal()}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Sucursal;
