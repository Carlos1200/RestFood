import L from "leaflet";
import Restaurantes from "../../static/assets/restaurante.png";

const Restaurante = L.icon({
  iconUrl: Restaurantes,
  iconRetinaUrl: Restaurantes,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [20, 20],
  className: "leaflet-venue-icon",
});

export default Restaurante;
