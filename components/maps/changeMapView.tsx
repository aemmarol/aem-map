import {LatLngBoundsExpression, LatLngExpression} from "leaflet";
import {FC} from "react";
import {useMap} from "react-leaflet";
import {sectorData} from "../../types";
const ChangeMapView: FC<{sector: sectorData}> = ({sector}) => {
  const map = useMap();
  if (!!sector && !!sector.latlng) {
    // console.log(sector);
    map.setView(sector.latlng as LatLngExpression);
    map.fitBounds(sector.bounds as LatLngBoundsExpression);
  }

  return null;
};
export default ChangeMapView;
