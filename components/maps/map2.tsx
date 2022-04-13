import React from "react";
import {
  MapContainer,
  Marker,
  Popup,
  SVGOverlay,
  TileLayer,
} from "react-leaflet";
import {Icon, LatLng, divIcon, icon} from "leaflet";
// import {Library} from "@fortawesome/fontawesome-svg-core";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faCoffee} from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";

const Map2 = () => {
  const position = new LatLng(19.114092679220292, 72.87610986824751);

  const markersList = [
    {
      name: "Maimoon",
      latlng: [19.116346586057833, 72.87560909449026],
    },
    {
      name: "Saifee masjid",
      latlng: [19.114092679220292, 72.87610986824751],
    },
    {
      name: "Al- burhan",
      latlng: [19.114838567013617, 72.87596100790853],
    },
  ];

  const markerIcon = divIcon({
    html: '<img src="/building.svg"/ style="height:3em;width:3em">',
  });

  return (
    <>
      <MapContainer
        center={position}
        zoom={17}
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
        {markersList.map((markerData, idx) => (
          <Marker
            key={idx}
            icon={markerIcon}
            position={new LatLng(markerData.latlng[0], markerData.latlng[1])}
          >
            <Popup>{markerData.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};
export default Map2;
