import React from "react";

const Barra = () => {
  return (
    <div className='sm:flex sm:justify-between bg-gray-900 py-3'>
      <h1 className='ml-5 text-2xl font-bold text-white'>RestFood</h1>
      <div className='sm:flex items-center'>
        <p className='text-white text-lg mr-3'>
          Usuario: <span className='font-bold'>Carlos Herrera</span>
        </p>
        <button className='text-lg font-bold py-2 px-2 mr-5 bg-red-700 text-white rounded-lg hover:bg-red-900'>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Barra;
