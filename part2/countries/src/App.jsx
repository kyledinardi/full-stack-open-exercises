import { useEffect, useState } from 'react';
import axios from 'axios';
import Countries from './components/Countries';

const App = () => {
  const [allCountries, setAllCountries] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setAllCountries(response.data))
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const filter = (query) => {
    const newFilteredCountries = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredCountries(newFilteredCountries);
  };

  return (
    <div>
      <div>
        find countries{' '}
        <input type='text' onChange={(e) => filter(e.target.value)} />
      </div>
      <Countries countries={filteredCountries} filter={filter} />
    </div>
  );
};

export default App;
