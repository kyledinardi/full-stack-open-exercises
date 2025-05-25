import { useEffect, useState } from 'react';
import type { DiaryEntry } from './types';
import { createEntry, getAllEntries } from './services/diaryServices';

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then((data) => {
      setEntries(data);
    });
  }, []);

  const entryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const data = await createEntry({ date, visibility, weather, comment });
      setEntries(entries.concat(data));
      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Something went wrong';

      setErrorMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={entryCreation}>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <div>
          <label htmlFor='date'>
            date
            <input
              type='date'
              name='date'
              id='date'
              onChange={({ target }) => setDate(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <span>visibility </span>
          {['great', 'good', 'ok', 'poor'].map((option) => (
            <label key={option} htmlFor={option}>
              {option}
              <input
                type='radio'
                name='visibility'
                id={option}
                value={option}
                onChange={({ target }) => setVisibility(target.value)}
              />
            </label>
          ))}
        </div>
        <div>
          <span>weather </span>
          {['sunny', 'rainy', 'cloudy', 'stormy', 'windy'].map((option) => (
            <label key={option} htmlFor={option}>
              {option}
              <input
                type='radio'
                name='weather'
                id={option}
                value={option}
                onChange={({ target }) => setWeather(target.value)}
              />
            </label>
          ))}
        </div>
        <div>
          <label htmlFor='comment'>
            comment
            <input
              type='text'
              name='comment'
              id='comment'
              onChange={({ target }) => setComment(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <button>add</button>
        </div>
      </form>
      <h2>Diary entries</h2>
      {entries.map((d) => (
        <div key={d.id}>
          <h3>{d.date}</h3>
          <div>visibility: {d.visibility}</div>
          <div>weather: {d.weather}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
