// CountryDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function CountryDetails({ hideApp, showApp }) {
  const { countryName } = useParams();
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountryData(data[0]);
          hideApp(); // Приховати `div App`
        }
      })
      .catch((error) => console.log(error));
  }, [countryName, hideApp]);

  useEffect(() => {
    return () => {
      showApp(); // Показати `div App` при виході зі сторінки деталей
    };
  }, [showApp]);

  if (!countryData) {
    return <div>Loading...</div>;
  }

  const countryFlag = countryData.flags.png;
  const countryFullName = countryData.name.common;

  return (
    <div className="country-details">
      <h2>Деталі країни: {countryFullName}</h2>
      <img src={countryFlag} alt="Прапор країни" />
      <Link to="/">Повернутися до списку країн</Link>
    </div>
  );
}

export default CountryDetails;
