import L from "leaflet";
import Carritos from "../../static/assets/carrito.png";

const Carrito = L.icon({
  iconUrl: Carritos,
  iconRetinaUrl: Carritos,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [20, 20],
  className: "leaflet-venue-icon",
});

export default Carrito;
