import React from "react";
import Head from "next/head";
import Barra from "./Barra";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>RestFood</title>
        <link
          href='https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
          rel='stylesheet'
        />
      </Head>
      {router.pathname === "/login" || router.pathname === "/nuevousuario" ? (
        <div className='bg-gray-900 min-h-screen flex flex-col justify-center items-center'>
          <div className='w-full'>{children}</div>
        </div>
      ) : (
        <>
          <Barra />
          {children}
        </>
      )}
    </>
  );
};

export default Layout;
