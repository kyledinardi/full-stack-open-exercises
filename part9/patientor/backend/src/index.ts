import express from 'express';
import cors from 'cors';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

// app.get('/api/ping', (_req, res) => {
//   console.log('someone pinged here');
//   res.send('pong');
// });

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
