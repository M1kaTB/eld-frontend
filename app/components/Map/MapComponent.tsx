import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./Map.module.scss";
import axios from "axios";
import { log } from "console";

interface MapComponentProps {
  loc1?: [number, number] | null;
  loc2?: [number, number] | null;
  loc3?: [number, number] | null;
}

const MapComponent = ({ loc1, loc2, loc3 }: MapComponentProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const mapBoxApi = process.env.NEXT_PUBLIC_MAP_BOX_API;
  console.log(mapBoxApi);

  useEffect(() => {
    mapboxgl.accessToken = mapBoxApi; // Replace with actual token

    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 3,
      projection: "globe",
    });

    map.on("style.load", () => {
      map.setFog({});
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  const drawRoute = async (
    a: [number, number],
    b: [number, number],
    c: [number, number]
  ) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const coordinates = [a, b, c].map((coord) => coord.join(",")).join(";");

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            overview: "full",
            geometries: "geojson",
          },
        }
      );

      if (!response.data.routes || response.data.routes.length === 0) {
        console.log("No route found");
        return;
      }

      const routeData = response.data.routes[0].geometry;

      const geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: routeData,
            properties: {},
          },
        ],
      };

      const source = map.getSource("route");

      if (source) {
        (source as mapboxgl.GeoJSONSource).setData(geoJson);
      } else {
        map.addSource("route", { type: "geojson", data: geoJson });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#4264fb", "line-width": 5 },
        });
      }

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      [a, b, c].forEach((coord, index) => {
        const marker = new mapboxgl.Marker({
          color: index === 0 ? "#00ffcc" : index === 2 ? "#ff3366" : "#ffcc00",
        })
          .setLngLat(coord)
          .addTo(map);

        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    if (
      loc1 &&
      loc2 &&
      loc3 &&
      loc1.every((num) => typeof num === "number") &&
      loc2.every((num) => typeof num === "number") &&
      loc3.every((num) => typeof num === "number")
    ) {
      drawRoute(loc1, loc2, loc3);
    }
  }, [loc1, loc2, loc3]);

  return (
    <div className={styles.container}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default MapComponent;
