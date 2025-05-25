import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
import { isNumber } from './utils';

const app = express();
app.use(express.json());

app.get('/bmi', (req, res) => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (!height || !weight) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  res.json({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((day) => !isNumber(Number(day))) ||
    !isNumber(Number(target))
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  res.json(calculateExercises(daily_exercises.map(Number), Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
