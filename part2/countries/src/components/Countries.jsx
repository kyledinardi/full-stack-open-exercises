import { useEffect, useState } from 'react';
import axios from 'axios';

const Countries = ({ countries, filter }) => {
  const [weather, setWeather] = useState({});
  const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;

  useEffect(() => {
    if (countries && countries.length === 1) {
      const country = countries[0];

      const url = `https://api.weatherapi.com/v1/current.json?key=${
        import.meta.env.VITE_WEATHERAPI_KEY
      }&q=${country.capital},${country.name.common}`;

      axios
        .get(url)
        .then((response) => setWeather(response.data.current))
        .catch((error) => console.error('Error fetching weather:', error));
    }
  }, [countries, apiKey]);

  if (!countries || countries.length === 0) {
    return <div>No countries found</div>;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    const country = countries[0];

    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>Capital {country.capital}</div>
        <div>Area {country.area}</div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        <h2>Weather in {country.capital}</h2>
        <div>Temperature {weather.temp_c} Celsius</div>
        <img src={weather.condition.icon} alt={weather.condition.text} />
        <div>Wind {Math.round((weather.wind_kph / 3.6) * 10) / 10} m/s</div>
      </div>
    );
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.cca3}>
          {country.name.common}{' '}
          <button onClick={() => filter(country.name.common)}>Show</button>
        </div>
      ))}
    </div>
  );
};

export default Countries;
