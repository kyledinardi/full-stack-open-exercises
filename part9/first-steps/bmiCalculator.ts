import { isNumber } from './utils';

interface BMIValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  if (args.length > 4) {
    throw new Error('Too many arguments');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNumber(height) && isNumber(weight)) {
    return { height, weight };
  } else {
    throw new Error('Provided values were not numbers');
  }
};

const calculateBmi = (height: number, weight: number): string => {
  if (height === 0) {
    throw new Error('Height must not be 0');
  }

  const bmi: number = weight / (height / 100) ** 2;

  if (bmi <= 18.5 && bmi > 0) {
    return 'Underweight';
  } else if (bmi <= 25) {
    return 'Normal range';
  } else if (bmi <= 30) {
    return 'Overweight';
  } else if (bmi > 30 && bmi < 300) {
    return 'Obese';
  }

  throw new Error(`${bmi} is not a valid BMI`);
};

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error) {
    let errorMessage = 'Something went wrong';

    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }

    console.log(errorMessage);
  }
}

export default calculateBmi;
