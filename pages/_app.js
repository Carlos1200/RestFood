import { ApolloProvider } from "@apollo/client";
import client from "../apollo/apollo";
import SucursalState from "../context/sucursales/SucursalState";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <SucursalState>
        <Component {...pageProps} />
      </SucursalState>
    </ApolloProvider>
  );
};

export default MyApp;
