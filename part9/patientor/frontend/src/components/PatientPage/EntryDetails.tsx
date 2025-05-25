import {
  MedicalServices,
  Work,
  LocalHospital,
  Favorite,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Diagnosis, Entry, HealthCheckRating } from '../../types';
import { List, ListItem, Typography } from '@mui/material';

const EntryDetails = ({
  entry,
  allDiagnoses,
}: {
  entry: Entry;
  allDiagnoses?: Diagnosis[];
}) => {
  const [entryDiagnoses, setEntryDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (allDiagnoses) {
      const newEntryDiagnoses = allDiagnoses.filter((d) =>
        entry.diagnosisCodes?.includes(d.code),
      );

      setEntryDiagnoses(newEntryDiagnoses);
    }
  }, [allDiagnoses, entry]);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const renderTypeIcon = () => {
    switch (entry.type) {
      case 'HealthCheck':
        return <MedicalServices />;

      case 'OccupationalHealthcare':
        return <Work />;

      case 'Hospital':
        return <LocalHospital />;

      default:
        return assertNever(entry);
    }
  };

  const renderRatingIcon = () => {
    if (entry.type === 'HealthCheck') {
      let color: string;

      switch (entry.healthCheckRating) {
        case HealthCheckRating.Healthy:
          color = 'green';
          break;

        case HealthCheckRating.LowRisk:
          color = 'yellow';
          break;

        case HealthCheckRating.HighRisk:
          color = 'orange';
          break;

        case HealthCheckRating.CriticalRisk:
          color = 'red';
          break;

        default:
          return assertNever(entry.healthCheckRating);
      }

      return (
        <div>
          <Favorite style={{ color: color }} />
        </div>
      );
    }
  };

  return (
    <div
      key={entry.id}
      style={{
        border: '2px solid black',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '5px',
      }}
    >
      <Typography variant='body1'>
        {entry.date} {renderTypeIcon()}{' '}
        {entry.type === 'OccupationalHealthcare' && entry.employerName}
      </Typography>
      <Typography variant='body1'>
        <em>{entry.description}</em>
      </Typography>
      {renderRatingIcon()}
      <Typography variant='body1'>diagnose by {entry.specialist}</Typography>
      {entry.type === 'OccupationalHealthcare' && entry.sickLeave && (
        <Typography variant='body1'>
          sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
        </Typography>
      )}
      {entry.type === 'Hospital' && (
        <Typography variant='body1'>
          discharge: {entry.discharge.date} {entry.discharge.criteria}
        </Typography>
      )}
      {entryDiagnoses.length > 0 && (
        <Typography variant='body1'>diagnoses:</Typography>
      )}
      <List style={{ padding: 0 }}>
        {entryDiagnoses?.map((diagnosis) => (
          <ListItem key={diagnosis.code}>
            {diagnosis.code} {diagnosis.name}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default EntryDetails;
