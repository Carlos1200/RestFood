import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapSearch = dynamic(import("../components/Mapa"), {
  ssr: false,
});

const Index = () => {
  return (
    <div className='h-screen bg-gray-900'>
      <Layout>
        <MapSearch />
        <Link href='/nuevasucursal'>
          <button
            type='button'
            className='absolute bottom-20 right-8 rounded-lg bg-gray-900 flex flex-col items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16'
              fill='none'
              viewBox='0 0 24 24'
              stroke='white'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            <p className='text-white text-lg px-3'>
              Nueva <br /> sucursal
            </p>
          </button>
        </Link>
        <Link href='/missucursales'>
          <button
            type='button'
            className='px-3 py-1 text-lg font-bold rounded-md bg-green-700 text-white hover:bg-green-800 shadow-lg'>
            Ver Sucursal
          </button>
        </Link>
      </Layout>
    </div>
  );
};

export default Index;
