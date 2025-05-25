import { isNumber } from './utils';

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  dailyHours: number[];
  target: number;
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const dailyHours = args.slice(3).map((hour) => Number(hour));
  const target = Number(args[2]);

  if (dailyHours.every((hour) => isNumber(hour)) && isNumber(target)) {
    return { dailyHours, target };
  } else {
    throw new Error('Provided values were not numbers');
  }
};

const calculateExercises = (dailyHours: number[], target: number): Result => {
  const days: number = dailyHours.length;

  if (days === 0) {
    throw new Error('No days provided');
  }

  const average: number =
    dailyHours.reduce((sum, current) => sum + current, 0) / days;

  let rating: 1 | 2 | 3 = 3;
  let ratingDescription: string = 'good';

  if (average < target / 2) {
    rating = 1;
    ratingDescription = 'bad';
  } else if (average < target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength: days,
    trainingDays: dailyHours.filter((hours) => hours > 0).length,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { dailyHours, target } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }

    console.log(errorMessage);
  }
}

export default calculateExercises;
