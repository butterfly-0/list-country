import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CountryDetails({ match }) {
  const countryCode = match.params.countryCode;
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
      .then(response => {
        setCountry(response.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  }, [countryCode]);

  if (!country) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Деталі країни: {country.name.common}</h2>
      <p>Столиця: {country.capital}</p>
    <p>Регіон: {country.region}</p>
    
    </div>
  );
}

export default CountryDetails;
