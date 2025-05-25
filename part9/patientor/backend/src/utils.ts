import { Gender, NewPatient } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(z.any()),
});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  BaseEntrySchema.extend({
    type: z.literal('HealthCheck'),
    healthCheckRating: z.number().min(0).max(3),
  }),

  BaseEntrySchema.extend({
    type: z.literal('Hospital'),
    discharge: z.object({ date: z.string().date(), criteria: z.string() }),
  }),

  BaseEntrySchema.extend({
    type: z.literal('OccupationalHealthcare'),
    employerName: z.string(),

    sickLeave: z
      .object({ startDate: z.string().date(), endDate: z.string().date() })
      .optional(),
  }),
]);
