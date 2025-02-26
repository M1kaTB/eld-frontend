import styles from "./EldLog.module.scss";

interface LogEntry {
  time: string;
  status: string;
  remarks: string;
  odometer: string;
  isLast?: boolean;
}

const LogEntry = (props: LogEntry) => {
  return (
    <div
      className={`${styles.logCont} ${
        !props.isLast && styles.logConstUnderline
      }`}
    >
      <div className={styles.left}>
        <p className={styles.time}>{props.time}</p>
        <p className={styles.duty}>{props.status}</p>
      </div>
      <div className={styles.right}>
        <p className={styles.action}>{props.remarks}</p>
        <p className={styles.odometer}>Odometer: {props.odometer} mi</p>
      </div>
    </div>
  );
};

interface EldLogs {
  time: string;
  status: string;
  remarks: string;
  odometer: string;
}

interface EldLog {
  logs: EldLogs[];
  name: string;
  date: string;
  vehicleId: string;
  remainingHours: string;
  totalDrivingHours: string;
  totalOnDutyHours: string;
}

const EldLog = (props: EldLog) => {
  return (
    <div className={styles.mainCont}>
      <div className={styles.topCont}>
        <div className={styles.col}>
          <div className={styles.textsCont}>
            <p className={styles.title}>Driver Name</p>
            <p className={styles.info}>{props.name}</p>
          </div>
          <div className={styles.textsCont}>
            <p className={styles.title}>Date</p>
            <p className={styles.info}>{props.date}</p>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.textsCont}>
            <p className={styles.title}>Vehicle ID</p>
            <p className={styles.info}>{props.vehicleId}</p>
          </div>
          <div className={styles.textsCont}>
            <p className={styles.title}>Remaining Hours</p>
            <p className={styles.info}>{props.remainingHours}</p>
          </div>
        </div>
      </div>
      <div className={styles.subCont}>
        <p className={styles.title}>Hours Summary</p>
        <div className={styles.hoursCont}>
          <div className={styles.hoursSubCont}>
            <p className={styles.totalHours}>Total Driving Hours:</p>
            <p className={styles.hoursText}>{props.totalDrivingHours}</p>
          </div>
          <div className={styles.hoursSubCont}>
            <p className={styles.totalHours}>Total On Duty Hours:</p>
            <p className={styles.hoursText}>{props.totalOnDutyHours}</p>
          </div>
        </div>
      </div>
      <div className={styles.subCont}>
        <p className={styles.title}>Log Entries</p>
        <div className={styles.dataCont}>
          {props.logs.map((data, i) => (
            <LogEntry
              remarks={data.remarks}
              odometer={data.odometer}
              time={data.time}
              status={data.status}
              key={i}
              isLast={i == props.logs.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EldLog;
