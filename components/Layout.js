import React from "react";
import Head from "next/head";
import Barra from "./Barra";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>RestFood</title>
        <link
          href='https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
          rel='stylesheet'
        />
      </Head>
      <Barra />
      {children}
    </>
  );
};

export default Layout;
