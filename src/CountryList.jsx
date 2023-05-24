import React from 'react';
import { Link } from 'react-router-dom';

function CountryList({ countries, currentPage, itemsPerPage, handleCountryMouseEnter, handleCountryMouseLeave, handleCountryClick }) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="Border">
      {currentCountries.map((country, index) => (
        <div key={country.name.common} onMouseEnter={() => handleCountryMouseEnter(country)} onMouseLeave={handleCountryMouseLeave}>
          {`${index + 1 + (currentPage - 1) * itemsPerPage}.`} <img src={country.flags.svg} alt={`${country.name.common} flag`} />
         <Link to={`/${country.cca2}`} onClick={() => handleCountryClick(country)}>
  {country.name.common}
</Link>

        </div>
      ))}
    </div>
  );
}

export default CountryList;
