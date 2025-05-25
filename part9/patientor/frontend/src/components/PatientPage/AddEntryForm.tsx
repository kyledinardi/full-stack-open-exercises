import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Diagnosis, EntryFormValues } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  allDiagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, allDiagnoses }: Props) => {
  const [type, setType] = useState<
    'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'
  >('HealthCheck');

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [employer, setEmployer] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const addEntry = (e: React.SyntheticEvent) => {
    e.preventDefault();

    switch (type) {
      case 'HealthCheck':
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          type,
          healthCheckRating: Number(healthCheckRating),
        });

        break;

      case 'OccupationalHealthcare':
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          type,
          employerName: employer,

          sickLeave: {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd,
          },
        });

        break;

      case 'Hospital':
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          type,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });

        break;

      default:
        assertNever(type);
    }
  };

  return (
    <form onSubmit={addEntry}>
      <Typography variant='h6' fontWeight={'bold'} margin={'20px 0'}>
        New entry
      </Typography>
      <FormControl fullWidth>
        <InputLabel id='typeLabel'>Entry type</InputLabel>
        <Select
          labelId='typeLabel'
          id='type'
          value={type}
          label='Entry Type'
          onChange={(e) =>
            setType(
              e.target.value as
                | 'HealthCheck'
                | 'Hospital'
                | 'OccupationalHealthcare',
            )
          }
        >
          <MenuItem value='HealthCheck'>Health Check</MenuItem>
          <MenuItem value='OccupationalHealthcare'>
            Occupational Healthcare
          </MenuItem>
          <MenuItem value='Hospital'>Hospital</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label='Description'
        fullWidth
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        type='date'
        label='Date'
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <TextField
        label='Specialist'
        fullWidth
        required
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id='diagnosisCodesLabel'>Diagnosis codes</InputLabel>
        <Select
          labelId='diagnosisCodesLabel'
          id='diagnosisCodes'
          value={diagnosisCodes}
          label='Diagnosis codes'
          onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
          multiple
        >
          {allDiagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code}
            </MenuItem>
          ))}
        </Select>
        {type === 'HealthCheck' && (
          <TextField
            label='Healthcheck rating'
            type='number'
            inputProps={{ min: 0, max: 3 }}
            fullWidth
            required
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(e.target.value)}
          />
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label='Employer name'
              fullWidth
              required
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
            />
            <FormLabel style={{ margin: '10px 0' }}>Sick leave</FormLabel>
            <TextField
              type='date'
              label='start'
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveStart}
              onChange={(e) => setSickLeaveStart(e.target.value)}
            />
            <TextField
              type='date'
              label='end'
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={sickLeaveEnd}
              onChange={(e) => setSickLeaveEnd(e.target.value)}
            />
          </>
        )}
        {type === 'Hospital' && (
          <>
            <FormLabel style={{ margin: '10px 0' }}>Discharge</FormLabel>
            <TextField
              type='date'
              label='date'
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
            <TextField
              label='criteria'
              fullWidth
              required
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
            />
          </>
        )}
      </FormControl>
      <Grid>
        <Grid item>
          <Button
            color='secondary'
            variant='contained'
            style={{ float: 'left' }}
            type='button'
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            style={{
              float: 'right',
            }}
            type='submit'
            variant='contained'
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <br />
    </form>
  );
};

export default AddEntryForm;
