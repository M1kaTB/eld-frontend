"use client";
import { ChangeEvent, useState } from "react";
import styles from "./TripForm.module.scss";

interface TripForm {
  onSubmit?: (
    loc1: string,
    loc2: string,
    loc3: string,
    driver_name: string,
    vehicle_id: string,
    cycles: string
  ) => void;
}

const TripForm = (props: TripForm) => {
  const [trip, setTrip] = useState({
    driver_name: "",
    vehicle_id: "",
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_used: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    props.onSubmit &&
      props.onSubmit(
        trip.current_location,
        trip.pickup_location,
        trip.dropoff_location,
        trip.driver_name,
        trip.vehicle_id,
        trip.current_cycle_used
      );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.headingCont}>
        <h1 className={styles.heading}>Trip Details</h1>
        <p className={styles.subHeading}>Enter your trip information below</p>
      </div>
      <div className={styles.row}>
        <label htmlFor="driver_name" className={styles.label}>
          Driver Name
        </label>
        <input
          name="driver_name"
          placeholder="Enter Driver Name"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="vehicle_id" className={styles.label}>
          Vehicle ID
        </label>
        <input
          name="vehicle_id"
          placeholder="Enter Vehicle ID"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="current_location" className={styles.label}>
          Current Location
        </label>
        <input
          name="current_location"
          placeholder="Enter city, state or address"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="pickup_location" className={styles.label}>
          Pickup Location
        </label>
        <input
          name="pickup_location"
          placeholder="Enter city, state or address"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="dropoff_location" className={styles.label}>
          Dropoff Location
        </label>
        <input
          name="dropoff_location"
          placeholder="Enter city, state or address"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="current_cycle_used" className={styles.label}>
          Current Cycle Hours Used
        </label>
        <input
          name="current_cycle_used"
          placeholder="Hours Used"
          type="number"
          onChange={handleChange}
          className={styles.inputStyle}
        />
      </div>
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
};

export default TripForm;
