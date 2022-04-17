import React from "react";
import {MapContainer, Marker, Polygon, Popup, TileLayer} from "react-leaflet";
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

const Map2 = () => {
  const sectorsList = sectors; //tobe replaced with dataservice call
  const subSectorList = subsectors; //to be replaced with dataservice call
  // let center = null;
  const gContext = useGlobalContext();

  // useEffect(() => {
  //   center = gContext.center;
  // }, []);
  console.log(gContext);
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
        }}
      >
        <MapLegendCard sectorList={sectorsList} />
      </div>
      <MapContainer
        center={gContext.center.latlng}
        zoom={16}
        scrollWheelZoom={true}
        style={{height: "80vh", width: "100%"}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker icon={customMarkerIcon} position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
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
                {/* <div
                className="subsector__marker--Popup"
                style={{
                  height: "100px",
                  width: "100px",
                }}
              >
                {subsector.name}
              </div> */}
              </Popup>
            </Marker>
          );
        })}
        {sectorsList.map((sector: sectorData, idx) => (
          <Polygon
            key={idx}
            fillOpacity={0.5}
            fillColor={sector.primary_color}
            positions={sector.bounds as LatLngExpression[]}
            color={sector.primary_color}
          ></Polygon>
        ))}
      </MapContainer>
    </div>
  ) : null;
};
export default Map2;
