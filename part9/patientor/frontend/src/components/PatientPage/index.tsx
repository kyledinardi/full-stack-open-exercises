import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alert, Button, Typography } from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';
import patientsService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import { Diagnosis, EntryFormValues, Patient } from '../../types';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';
import axios from 'axios';

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>();
  const [allDiagnoses, setAllDiagnoses] = useState<Diagnosis[]>();
  const [error, setError] = useState<string>();
  const [notFound, setNotFound] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    diagnosesService.getAllDiagnoses().then((diagnosesList) => {
      setAllDiagnoses(diagnosesList.sort((a, b) => (a.code > b.code ? 1 : -1)));
    });
  }, []);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    patientsService
      .getPatient(id)
      .then((data) => setPatient(data))
      .catch(() => setNotFound(true));
  }, [id]);

  const sumbitNewEntry = async (values: EntryFormValues) => {
    if (!id || !patient) {
      return;
    }

    try {
      const entry = await patientsService.createEntry(id, values);
      setPatient({ ...patient, entries: [...patient.entries, entry] });
      setIsFormOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data) {
          console.error(e.response?.data.error);
          setError(e.response?.data.error[0].message);
        } else {
          console.error('Unrecognized axios error', e);
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  const renderGenderIcon = () => {
    switch (patient?.gender) {
      case 'male':
        return <Male />;

      case 'female':
        return <Female />;

      default:
        return <Transgender />;
    }
  };

  if (notFound) {
    return <h2>404: Patient not found</h2>;
  }

  return (
    <div>
      <Typography variant='h5' fontWeight={'bold'} margin={'20px 0'}>
        {patient?.name} {renderGenderIcon()}
      </Typography>
      <div>ssh: {patient?.ssn}</div>
      <div>occupation: {patient?.occupation}</div>
      {error && <Alert severity='error'>{error}</Alert>}
      {isFormOpen && allDiagnoses ? (
        <AddEntryForm
          onCancel={() => setIsFormOpen(false)}
          onSubmit={sumbitNewEntry}
          allDiagnoses={allDiagnoses}
        />
      ) : (
        <Button variant='contained' onClick={() => setIsFormOpen(true)}>
          Add new entry
        </Button>
      )}
      <Typography variant='h6' fontWeight={'bold'} margin={'40px 0 20px 0'}>
        entries
      </Typography>
      {patient?.entries.map((entry) => (
        <EntryDetails
          key={entry.id}
          entry={entry}
          allDiagnoses={allDiagnoses}
        />
      ))}
    </div>
  );
};

export default PatientPage;
