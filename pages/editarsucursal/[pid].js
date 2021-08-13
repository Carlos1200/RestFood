import React, { useContext, useState, useEffect } from "react";
import Layout from "../../components/Layout";
import TimePicker from "../../components/TimePicker";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SucursalContext from "../../context/sucursales/SucursalContext";
import Link from "next/link";
import Select from "react-select";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";
import { gql, useMutation, useQuery } from "@apollo/client";

const MapSearch = dynamic(import("../../components/Mapa"), {
  ssr: false,
});

const NUEVA_SUCURSAL = gql`
  mutation nuevaEmpresa($input: InputEmpresa) {
    nuevaEmpresa(input: $input) {
      informacion
    }
  }
`;
const OBTENER_EMPRESA = gql`
  query obtenerEmpresa($id: ID!) {
    obtenerEmpresa(id: $id) {
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

const options = [
  { value: "Restaurante", label: "Restaurante" },
  { value: "Supermercado", label: "Supermercado" },
  { value: "Mipymes", label: "Mipymes" },
];
const dias = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miercoles", label: "Miercoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sabado", label: "Sabado" },
  { value: "Domingo", label: "Domingo" },
];

const EditarSucursal = () => {
  const router = useRouter();

  const {
    query: { pid },
  } = router;

  const sucursalContext = useContext(SucursalContext);
  const {
    ubicacion,
    fechaInicio,
    fechaFinal,
    obtenerFechaInicio,
    obtenerFechaFinal,
  } = sucursalContext;

  const [tipoSucursal, setTipoSucursal] = useState("Restaurante");
  const [laborales, setLaborales] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeDias, setMensajeDias] = useState(null);

  const { data, loading, error } = useQuery(OBTENER_EMPRESA, {
    variables: {
      id: pid,
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    );
  };
  const mostrarMensajeDias = () => {
    return (
      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
        <p>{mensajeDias}</p>
      </div>
    );
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Se requiere un correo de usuario"),
  });

  useEffect(() => {
    if (!loading) {
      obtenerFechaInicio(inicio);
      obtenerFechaFinal(final);
    }
  }, []);

  if (loading) {
    return null;
  }

  const { obtenerEmpresa } = data;
  const {
    id,
    nombre,
    informacion,
    tipo,
    horario: { diaLaboral, horaInicio, horaFinal },
  } = obtenerEmpresa;
  let laboral = [];

  diaLaboral.forEach((labo, index) => {
    laboral[index] = { value: labo, label: labo };
  });
  let tipos = { value: tipo, label: tipo };

  const inicio = new Date(horaInicio);
  const final = new Date(horaFinal);

  return (
    <Layout>
      <div className='bg-gray-700 h-full'>
        <h1 className='text-center mb-3 text-3xl font-light text-white'>
          Nueva sucursal
        </h1>
        {mensaje && mostrarMensaje()}
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-3xl'>
            <Formik
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={{ nombre, informacion }}>
              {(props) => {
                return (
                  <form
                    className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={props.handleSubmit}>
                    <div className='grid grid-cols-2 gap-6'>
                      <div className='mb-4'>
                        <label
                          htmlFor='nombre'
                          className='block text-gray text-sm font-bold mb-2'>
                          Nombre
                        </label>
                        <input
                          type='text'
                          id='nombre'
                          placeholder='Nombre de la sucursal'
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.nombre}
                          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        />
                        {props.touched.nombre && props.errors.nombre ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p>{props.errors.nombre}</p>
                          </div>
                        ) : null}
                      </div>

                      <div className='mb-4'>
                        <label
                          htmlFor='tipo'
                          className='block text-gray text-sm font-bold mb-2'>
                          Tipo de sucursal
                        </label>
                        <Select
                          id='tipo'
                          options={options}
                          defaultValue={tipos}
                          onChange={(opcion) => setTipoSucursal(opcion.value)}
                          noOptionsMessage={() => "No hay opciones"}
                        />
                      </div>
                      <div className='mb-4 col-start-1 col-end-3'>
                        <label
                          htmlFor='informacion'
                          className='block text-gray text-sm font-bold mb-2'>
                          Información (Opcional)
                        </label>
                        <textarea
                          name='informacion'
                          id='informacion'
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.informacion}
                          className='resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'></textarea>
                      </div>
                      <div className='mb-4 col-start-1 col-end-3'>
                        <p className='text-center text-gray text-sm font-bold mb-2'>
                          Horario
                        </p>
                        <div>
                          <label
                            htmlFor='dias'
                            className='block text-gray text-sm font-bold mb-2'>
                            Día de servicio
                          </label>
                          <Select
                            id='dias'
                            isMulti
                            closeMenuOnSelect={false}
                            defaultValue={laboral}
                            options={dias}
                            onChange={(opcion) => setLaborales(opcion)}
                            placeholder='Selecciona los días laborales'
                            noOptionsMessage={() => "No hay opciones"}
                          />
                        </div>
                        {mensajeDias && mostrarMensajeDias()}
                      </div>

                      <div className='mb-4'>
                        <label
                          htmlFor='inicio'
                          className='block text-gray text-sm font-bold mb-2'>
                          Hora de inicio
                        </label>
                        <TimePicker tipo={"inicio"} />
                      </div>
                      <div className='mb-4'>
                        <label
                          htmlFor='inicio'
                          className='block text-gray text-sm font-bold mb-2'>
                          Hora de Finalizacion
                        </label>
                        <TimePicker tipo={"final"} />
                      </div>

                      <div className='mb-4 col-start-1 col-end-3 h-80'>
                        <label
                          htmlFor='ubicacion'
                          className='block text-gray text-sm font-bold mb-2'>
                          Ubicación
                        </label>
                        <MapSearch />
                      </div>
                    </div>
                    <input
                      type='submit'
                      value='Registrar Sucursal'
                      className='px-3 py-2 text-lg font-bold w-full rounded-md bg-gray-700 text-white hover:bg-gray-800 shadow-lg'
                    />
                    <div className='flex justify-center mt-3'>
                      <Link href='/'>
                        <a className='text-xl font-light'>Volver</a>
                      </Link>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarSucursal;
