import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const NUEVO_USUARIO = gql`
  mutation nuevoUsuario($input: InputUsuario) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
      creado
    }
  }
`;

const NuevoUsuario = () => {
  //Mutation para subir usuarios
  const [nuevoUsuario] = useMutation(NUEVO_USUARIO);

  const [mensaje, guardarMensaje] = useState(null);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Se requiere un nombre de usuario"),
      apellido: Yup.string().required("Se requiere un apellido de usuario"),
      email: Yup.string()
        .email("Ingrese un correo valido")
        .required("Se requiere un correo de usuario"),
      password: Yup.string()
        .required("Se requiere una contraseña de usuario")
        .min(6, "Por lo menos se requieren 6 caracteres"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });
        Swal.fire("Cuenta creada", "Nuevo usuario creado", "success");
        router.push("/login");
      } catch (error) {
        guardarMensaje(error.message.replace("Error: ", ""));
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
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

  return (
    <Layout>
      <h1 className='text-center mb-3 text-3xl font-light text-white'>
        Nuevo Usuario
      </h1>
      {mensaje && mostrarMensaje()}
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='nombre'
                className='block text-gray text-sm font-bold mb-2'>
                Nombre
              </label>
              <input
                type='text'
                id='nombre'
                placeholder='Nombre Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='apellido'
                className='block text-gray text-sm font-bold mb-2'>
                Apellido
              </label>
              <input
                type='text'
                id='apellido'
                placeholder='Apellido Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p>{formik.errors.apellido}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-gray text-sm font-bold mb-2'>
                Correo electrónico
              </label>
              <input
                type='email'
                id='email'
                placeholder='E-mail Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block text-gray text-sm font-bold mb-2'>
                Contraseña
              </label>
              <input
                type='password'
                id='password'
                placeholder='Contraseña Usuario'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
            <input
              type='submit'
              value='Registrarse'
              className='px-3 py-2 text-lg font-bold w-full rounded-md bg-gray-700 text-white hover:bg-gray-800 shadow-lg'
            />
            <div className='flex justify-center mt-3'>
              <Link href='/login'>
                <a className='text-xl font-light'>Volver</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoUsuario;
