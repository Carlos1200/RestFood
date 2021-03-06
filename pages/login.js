import React, { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: InputAutenticarUsuario) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const [mensaje, guardarMensaje] = useState(null);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Ingrese un correo valido")
        .required("Se requiere un correo de usuario"),
      password: Yup.string().required("Se requiere una contraseña de usuario"),
    }),
    onSubmit: async (valores) => {
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        guardarMensaje("Autenticando...");

        setTimeout(() => {
          //Guardar el token en localstorage
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 1000);

        //Redireccionar hacia clientes

        setTimeout(() => {
          guardarMensaje(null);
          router.push("/");
        }, 2000);
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
      <h1 className='text-center mb-3 text-3xl font-light text-white'>Login</h1>
      {mensaje && mostrarMensaje()}
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-sm'>
          <form
            className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}>
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
              value='Ingresar'
              className='px-3 py-2 text-lg font-bold w-full rounded-md bg-gray-700 text-white hover:bg-gray-800 shadow-lg'
            />
            <div className='flex justify-center mt-3'>
              <Link href='/nuevousuario'>
                <a className='text-xl font-light'>Nueva Cuenta</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
