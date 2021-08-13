import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import TimePicker from "../components/TimePicker";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SucursalContext from "../context/sucursales/SucursalContext";
import Link from "next/link";
import Select from "react-select";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

const MapSearch = dynamic(import("../components/Mapa"), {
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

const NuevaSucursal = () => {
  const router = useRouter();

  const sucursalContext = useContext(SucursalContext);
  const { ubicacion, fechaInicio, fechaFinal } = sucursalContext;

  const [tipo, setTipo] = useState("Restaurante");
  const [laborales, setLaborales] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeDias, setMensajeDias] = useState(null);

  const [nuevaEmpresa] = useMutation(NUEVA_SUCURSAL, {
    update(cache, { data: { nuevaEmpresa } }) {
      const { obtenerEmpresas } = cache.readQuery({
        query: OBTENER_EMPRESA,
      });

      cache.writeQuery({
        query: OBTENER_EMPRESA,
        data: {
          obtenerEmpresas: [...obtenerEmpresas, nuevaEmpresa],
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      informacion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Se requiere un correo de usuario"),
    }),
    onSubmit: async (valores) => {
      const { nombre, informacion } = valores;
      let laboral = [];
      if (laborales.length === 0) {
        setMensajeDias("Se necesita tener por lo menos un día laboral");
        setTimeout(() => {
          setMensajeDias(null);
        }, 5000);
      } else {
        laborales.forEach((diaLabo, index) => {
          laboral[index] = diaLabo.value;
        });
        try {
          const { data } = await nuevaEmpresa({
            variables: {
              input: {
                nombre,
                informacion,
                tipo,
                horario: {
                  diaLaboral: laboral,
                  horaInicio: Date.parse(fechaInicio),
                  horaFinal: Date.parse(fechaFinal),
                },
                ubicacion: {
                  lat: ubicacion[0],
                  lon: ubicacion[1],
                },
              },
            },
          });
          Swal.fire(
            "Se realizó correctamente",
            "Sucursal registrada",
            "success"
          );
          router.push("/");
        } catch (error) {
          setMensaje(error);
        }
      }
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

  return (
    <Layout>
      <div className='bg-gray-700 h-full'>
        <h1 className='text-center mb-3 text-3xl font-light text-white'>
          Nueva sucursal
        </h1>
        {mensaje && mostrarMensaje()}
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-3xl'>
            <form
              className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
              onSubmit={formik.handleSubmit}>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nombre}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  />
                  {formik.touched.nombre && formik.errors.nombre ? (
                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                      <p>{formik.errors.nombre}</p>
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
                    onChange={(opcion) => setTipo(opcion.value)}
                    defaultValue={options[0]}
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.informacion}
                    className='resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'></textarea>
                </div>
                <div className='mb-4 col-start-1 col-end-3'>
                  <p className='text-center text-gray text-sm font-bold mb-2'>
                    Horario
                  </p>
                  <div>
                    <label
                      htmlFor='informacion'
                      className='block text-gray text-sm font-bold mb-2'>
                      Día de servicio
                    </label>
                    <Select
                      id='informacion'
                      isMulti
                      closeMenuOnSelect={false}
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaSucursal;
