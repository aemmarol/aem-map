import React, {useEffect, useState} from "react";
import {
  LayersControl,
  LayerGroup,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
} from "react-leaflet";
import {divIcon, LatLngExpression} from "leaflet";
import "leaflet/dist/leaflet.css";
import {sectorData, subSectorData} from "../../types";
import {useGlobalContext} from "../../context/GlobalContext";
import SubSectorPopupCard from "../cards/subSectorPopupCard";
import MapLegendCard from "../cards/mapLegendCard";
import ChangeMapView from "./changeMapView";
import {getSectorList} from "../../pages/api/v1/db/sectorCrud";
import { getSubSectorList } from "../../pages/api/v1/db/subSectorCrud";

const getCentroid = (bounds: any[]): number[] => {
  const x = bounds.reduce((sum, val) => sum + val.lat / bounds.length, 0);
  const y = bounds.reduce((sum, val) => sum + val.lang / bounds.length, 0);
  return [x, y];
};

const Map2 = () => {
  // const sectorsList = sectors; //tobe replaced with dataservice call
  const [sectorList, setSectorList] = useState<any[]>([]);
  const [subSectorList, setsubSectorList] = useState<any[]>([]);
  const [mapSectorData, setMapSectorData] = useState<any[]>([]);

  // const subSectorList = subsectors; //to be replaced with dataservice call
  const gContext = useGlobalContext();
  const [currMapSector, setCurrMapSector] = useState<any>(null);

  useEffect(() => {
    setList();
  }, []);

  const setList = async () => {
    gContext.toggleLoader(true);
    const listData: sectorData[] = await getSectorList();
    const subSectorListData: subSectorData[] = await getSubSectorList();
    setSectorList(listData);
    const temp = await listData.map((sector) => {
      sector.latlng =
        sector.bounds && !sector.latlng
          ? getCentroid(sector.bounds)
          : sector.latlng;

      return sector;
    });
    setMapSectorData(temp);
    setsubSectorList(subSectorListData)
    gContext.toggleLoader(false);
  };

  return !!gContext.center.latlng ? (
    <div style={{position: "relative"}}>
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          background: "white",
          opacity: 0.8,
          zIndex: 401,
          maxWidth: "80%",
          maxHeight: "50%",
          overflowY: "scroll",
        }}
      >
        <MapLegendCard
          sectorList={sectorList.filter(
            (val) => val.name !== "ZZ NON RESIDENT"
          )}
          clickHandler={(sector: sectorData) => {
            setCurrMapSector(
              mapSectorData.find((mapSector) => mapSector.name == sector.name)
            );
          }}
        />
      </div>
      <MapContainer
        center={gContext.center.latlng}
        zoom={15}
        scrollWheelZoom={true}
        style={{height: "calc(100vh - 200px)", width: "100%"}}
      >
        <ChangeMapView sector={currMapSector} />
        <LayersControl position="topleft">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker icon={customMarkerIcon} position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
          <LayersControl.Overlay name="Sub-sectors" checked={true}>
            <LayerGroup>
              {subSectorList.map((subsector: subSectorData, idx) => {
                const markerIcon = divIcon({
                  html: `<span style="display:flex;"> <img src="/building.svg"/ style="height:2em;width:2em"> &nbsp&nbsp <b>${subsector.name}</b></span>`,
                  className: "dummy",
                });
                return (
                  <Marker
                    key={idx}
                    icon={markerIcon}
                    position={subsector.latlng as LatLngExpression}
                    riseOnHover={true}
                    eventHandlers={{}}
                    title={subsector.name}
                    // on={(e) => {
                    //   e.target.openPopup();
                    // }}
                    // onMouseOut={(e) => {
                    //   e.target.closePopup();
                    // }}
                  >
                    <Popup minWidth={200} maxWidth={200} maxHeight={1000}>
                      <SubSectorPopupCard subsector={subsector} />
                    </Popup>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>
          {mapSectorData.map((mapSector, idx) => {
            return (
              <Polygon
                key={idx}
                fillOpacity={0.5}
                fillColor={mapSector.primary_color}
                positions={
                  mapSector.bounds.map((val: any) => ({
                    lat: val.lat,
                    lng: val.lang,
                  })) as LatLngExpression[]
                }
                color={mapSector.primary_color}
              />
            );
          })}
          {/* <LayersControl.Overlay name="Sectors">
            <LayerGroup>
            </LayerGroup>
          </LayersControl.Overlay> */}
        </LayersControl>
      </MapContainer>
    </div>
  ) : null;
};
export default Map2;
