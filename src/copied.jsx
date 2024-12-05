import React, { useRef, useEffect } from "react";
import WebScene from "@arcgis/core/WebScene";
import SceneView from "@arcgis/core/views/SceneView";
import esriConfig from "@arcgis/core/config";
import { PORTAL_URL, SCENE_ID } from "./config/env";

function App() {
  const sceneDiv = useRef(null);

  useEffect(() => {
    //  portal URL
    esriConfig.portalUrl = PORTAL_URL;

    if (sceneDiv.current) {
      const webscene = new WebScene({
        portalItem: {
          id: SCENE_ID,
        },
      });

      const view = new SceneView({
        container: sceneDiv.current,
        map: webscene,
      });

      // additional config
      view.when(() => {
        console.log("Web Scene loaded successfully");
      });

      // cleanup function
      return () => {
        view.destroy();
      };
    }
  }, []);

  return <div ref={sceneDiv} style={{ height: "100vh", width: "100%" }}></div>;
}

export default App;
