import { useState } from "react";
import styles from "./EldLogs.module.scss";
import EldLog from "./EldLog/EldLog";

interface EldLogs {
  time: string;
  status: string;
  remarks: string;
  odometer: string;
}

interface EldData {
  name: string;
  date: string;
  vehicleId: string;
  remainingHours: string;
  totalDrivingHours: string;
  totalOnDutyHours: string;
  logs: EldLogs[];
}

const EldLogs = (props: EldData) => {
  return (
    <div className={styles.container}>
      <div className={styles.headingCont}>
        <h1 className={styles.heading}>ELD Logs</h1>
        <p className={styles.subHeading}>Generated log sheets for your trip</p>
      </div>
      {props.logs.length ? (
        <EldLog logs={props.logs} date={props.date} name={props.name} remainingHours={props.remainingHours} totalDrivingHours={props.totalDrivingHours} totalOnDutyHours={props.totalOnDutyHours} vehicleId={props.vehicleId}/>
      ) : (
        <div className={styles.eldPlaceHolder}>
          <p>Log sheets will appear here after route calculation</p>
        </div>
      )}
    </div>
  );
};

export default EldLogs;
