import L from "leaflet";
import Tiendas from "../../static/assets/tienda.png";

const Tienda = L.icon({
  iconUrl: Tiendas,
  iconRetinaUrl: Tiendas,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [20, 20],
  className: "leaflet-venue-icon",
});

export default Tienda;
