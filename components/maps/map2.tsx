import React, {useState} from "react";
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
// import {Library} from "@fortawesome/fontawesome-svg-core";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faCoffee} from "@fortawesome/free-solid-svg-icons";
import {sectors, subsectors} from "./mocksector";
import "leaflet/dist/leaflet.css";
import {sectorData, subSectorData} from "../../types";
import {useGlobalContext} from "../../context/GlobalContext";
import SubSectorPopupCard from "../cards/subSectorPopupCard";
import MapLegendCard from "../cards/mapLegendCard";
import ChangeMapView from "./changeMapView";

const getCentroid = (bounds: number[][]): number[] => {
  const x = bounds.reduce((sum, val) => sum + val[0] / bounds.length, 0);
  const y = bounds.reduce((sum, val) => sum + val[1] / bounds.length, 0);
  return [x, y];
};

const Map2 = () => {
  const sectorsList = sectors; //tobe replaced with dataservice call
  const [mapSectorData] = useState(
    sectorsList.map((sector) => {
      sector.latlng =
        sector.bounds && !sector.latlng
          ? getCentroid(sector.bounds)
          : sector.latlng;

      return sector;
    })
  );

  const subSectorList = subsectors; //to be replaced with dataservice call
  const gContext = useGlobalContext();
  const [currMapSector, setCurrMapSector] = useState<any>(null);

  // useEffect(() => {
  //   sectorsList.forEach((sector) => {
  //     sector.latlng =
  //       sector.bounds && !sector.latlng
  //         ? getCentroid(sector.bounds)
  //         : sector.latlng;
  //   });
  // }, []);

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
          sectorList={sectorsList}
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
        style={{height: "calc(100vh - 175px)", width: "100%"}}
      >
        <ChangeMapView sector={currMapSector} />
        <LayersControl position="bottomleft">
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
            debugger;
            return (
              <Polygon
                key={idx}
                fillOpacity={0.5}
                fillColor={mapSector.primary_color}
                positions={mapSector.bounds as LatLngExpression[]}
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
