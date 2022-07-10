import {LatLngBoundsExpression, LatLngExpression} from "leaflet";
import {FC} from "react";
import {useMap} from "react-leaflet";
import {sectorData} from "../../types";
const ChangeMapView: FC<{sector: sectorData}> = ({sector}) => {
  // const ChangeMapView: FC<{sector: sectorData}> = () => {
  const map = useMap();
  if (!!sector && !!sector.latlng) {
    map.setView(sector.latlng as LatLngExpression);
    map.fitBounds(
      sector.bounds?.map((val: any) => [
        val.lat,
        val.lang,
      ]) as LatLngBoundsExpression
    );
  }

  return null;
};
export default ChangeMapView;
