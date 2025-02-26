"use client";
import TripForm from "./components/TripForm/TripForm";
import Map from "./components/Map/MapComponent";
import EldLogs from "./components/EldLogs/EldLogs";
import axios from "axios";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [locations, setLocations] = useState<
    [[number, number] | null, [number, number] | null, [number, number] | null]
  >([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  const [data, setData] = useState({
    date: "",
    driver_name: "",
    vehicle_id: "",
    remaining_hours: "",
    total_driving_hours: "",
    total_on_duty_hours: "",
  });
  const [logs, setLogs] = useState([]);

  const mapBoxApi = process.env.NEXT_PUBLIC_MAP_BOX_API;

  const getCoordinates = async (
    place: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          place
        )}.json`,
        {
          params: {
            access_token: mapBoxApi,
            limit: 1,
          },
        }
      );

      if (response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        return [lng, lat];
      } else {
        console.error("No location found for", place);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const getData = async (
    driver_name: string,
    vehicle_id: string,
    current_location: string,
    pickup_location: string,
    dropoff_location: string,
    cycle_used: number | null
  ) => {
    try {
      const response = await axios.post(
        "https://eld-backend-production.up.railway.app/api/trips/",
        {
          driver_name: driver_name,
          vehicle_id: vehicle_id,
          current_location: current_location,
          pickup_location: pickup_location,
          dropoff_location: dropoff_location,
          cycle_used: cycle_used,
        }
      );
      setData({
        date: response.data.date,
        driver_name: response.data.driver_name,
        vehicle_id: response.data.vehicle_id,
        remaining_hours: response.data.remaining_hours,
        total_driving_hours: response.data.hours_summary.total_driving_hours,
        total_on_duty_hours: response.data.hours_summary.total_on_duty_hours,
      });
      setLogs(response.data.daily_logs[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.mainCont}>
      <div className={styles.topCont}>
        <TripForm
          onSubmit={async (
            loc1: string,
            loc2: string,
            loc3: string,
            driver_name: string,
            vehicle_id: string,
            cycle: string
          ) => {
            const address1 = await getCoordinates(loc1);
            const address2 = await getCoordinates(loc2);
            const address3 = await getCoordinates(loc3);
            getData(driver_name, vehicle_id, loc1, loc2, loc3, +cycle);
            setLocations([address1, address2, address3]);
          }}
        />
        <Map loc1={locations[0]} loc2={locations[1]} loc3={locations[2]} />
      </div>
      <EldLogs
        date={data.date}
        logs={logs}
        name={data.driver_name}
        remainingHours={data.remaining_hours}
        totalDrivingHours={data.total_driving_hours}
        totalOnDutyHours={data.total_on_duty_hours}
        vehicleId={data.vehicle_id}
      />
    </div>
  );
}
