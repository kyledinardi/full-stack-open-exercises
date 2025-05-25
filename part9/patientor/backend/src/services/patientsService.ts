import patients from '../../data/patients';
import { NewPatient, Patient, NonSensitivePatient, Entry, NewEntry } from '../types';

const getPatientsWithoutSsn = (): NonSensitivePatient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { ...patient, id: crypto.randomUUID(), entries: [] };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const newEntry = { ...entry, id: crypto.randomUUID() };
  const patient = getPatient(id);
  patient?.entries.push(newEntry);
  return newEntry;
};

export default { getPatientsWithoutSsn, getPatient, addPatient, addEntry };
