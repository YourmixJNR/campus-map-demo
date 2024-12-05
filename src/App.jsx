import React, { useRef, useEffect, useState } from "react";
import WebScene from "@arcgis/core/WebScene";
import SceneView from "@arcgis/core/views/SceneView";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import { PORTAL_URL, SCENE_ID } from "./config/env";

const futaData = [
  {
    osm_id: 582042860,
    name: "Lecture Building",
    longitude: 5.12760692728771,
    latitude: 7.30487819566412,
    status: "available",
  },
  {
    osm_id: 711288925,
    name: "Lecture Building",
    longitude: 5.12711493362148,
    latitude: 7.30450549437018,
    status: "unavailable",
  },
  {
    osm_id: 708296703,
    name: "School of Management (SMAT BUILDING)",
    longitude: 5.13481803581943,
    latitude: 7.29770894640321,
    status: "soon",
  },
  {
    osm_id: 708298886,
    name: "School of Sciences",
    longitude: 5.13390372550646,
    latitude: 7.30219689767069,
    status: "available",
  },
  {
    osm_id: 716662974,
    name: "Akindeko Hall",
    longitude: 5.148224810222,
    latitude: 7.29493928532629,
    status: "unavailable",
  },
  {
    osm_id: 713113739,
    name: "Postgraduate Hostel",
    longitude: 5.13160068943387,
    latitude: 7.29615205673189,
    status: "soon",
  },
  {
    osm_id: 680580056,
    name: "Obafemi Awolowo Auditorium (2500 Capacity)",
    longitude: 5.13694689053735,
    latitude: 7.30422959348281,
    status: "available",
  },
  {
    osm_id: 709052023,
    name: "Wema Bank",
    longitude: 5.13915769066751,
    latitude: 7.30067007649573,
    status: "unavailable",
  },
  // Add more data as needed
];

const getColor = (status) => {
  switch (status) {
    case "available":
      return "green";
    case "unavailable":
      return "red";
    case "soon":
      return "yellow";
    default:
      return "blue";
  }
};

function App() {
  const sceneDiv = useRef(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    esriConfig.portalUrl = PORTAL_URL;

    if (sceneDiv.current) {
      const webscene = new WebScene({
        portalItem: {
          id: SCENE_ID,
        },
      });

      const sceneView = new SceneView({
        container: sceneDiv.current,
        map: webscene,
      });

      const graphicsLayer = new GraphicsLayer({
        id: "availabilityLayer",
        minScale: 0, // Ensure visibility at all scales
        maxScale: 0, // Ensure visibility at all scales
      });

      const labelClass = new LabelClass({
        labelExpressionInfo: { expression: "$feature.name" },
        symbol: {
          type: "text",
          color: "black",
          haloColor: "white",
          haloSize: "1px",
          font: {
            size: "12px",
            family: "sans-serif",
            weight: "bold",
          },
        },
      });

      graphicsLayer.labelingInfo = [labelClass];
      webscene.add(graphicsLayer);

      sceneView.when(() => {
        console.log("Web Scene loaded successfully");
        setView(sceneView);
      });

      return () => {
        sceneView.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (view) {
      const graphicsLayer = view.map.findLayerById("availabilityLayer");
      graphicsLayer.removeAll();

      futaData.forEach((place) => {
        const graphic = new Graphic({
          geometry: {
            type: "point",
            longitude: place.longitude,
            latitude: place.latitude,
          },
          symbol: {
            type: "point-3d", // Use 3D symbol
            symbolLayers: [
              {
                type: "icon",
                size: "12px",
                resource: { primitive: "circle" },
                material: { color: getColor(place.status) },
              },
            ],
          },
          attributes: place,
          popupTemplate: {
            title: place.name || "Unnamed Building",
            content: `Status: ${place.status}<br>Longitude: ${place.longitude}<br>Latitude: ${place.latitude}`,
          },
        });
        graphicsLayer.add(graphic);
      });
    }
  }, [view]);

  return <div ref={sceneDiv} style={{ height: "100vh", width: "100%" }}></div>;
}

export default App;
