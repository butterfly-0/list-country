// CountryList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CountryList.css';

function CountryList({ countries, currentPage, itemsPerPage, handleCountryMouseEnter, handleCountryMouseLeave }) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="Border">
      {currentCountries.map((country, index) => (
        <div key={country.name.common} onMouseEnter={() => handleCountryMouseEnter(country)} onMouseLeave={handleCountryMouseLeave}>
          {`${index + 1 + (currentPage - 1) * itemsPerPage}.`} <img src={country.flags.svg} alt={`${country.name.common} прапор`} />
          <Link to={`/${country.name.common}`}>
            {country.name.common}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CountryList;
