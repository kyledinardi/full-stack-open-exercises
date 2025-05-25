import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import patientsService from '../services/patientsService';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import {
  Diagnosis,
  Entry,
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from '../types';

const router = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const newEntryParser = (
  req: Request<{ id: string }, unknown, NewEntry>,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const diagnosisCodes = parseDiagnosisCodes(req.body);
    req.body.diagnosisCodes = diagnosisCodes;
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  const patients = patientsService.getPatientsWithoutSsn();
  res.json(patients);
});

router.get('/:id', (req, res: Response<Patient>) => {
  const patient = patientsService.getPatient(req.params.id);
  res.json(patient);
});

router.post(
  '/',
  newPatientParser,

  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  '/:id/entries',
  newEntryParser,

  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const addedEntry = patientsService.addEntry(req.params.id, req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);
export default router;
