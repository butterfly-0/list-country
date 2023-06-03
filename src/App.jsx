import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import './App.css';

function SelectedCountry({ selectedCountry }) {
  return (
    <div className="selected-country">
      {selectedCountry.name.common !== 'Russia' ? (
        <div>
          <div>
            <img className="img-country" src={selectedCountry.coatOfArms?.svg} alt={`${selectedCountry.name.common} герб`} />
          </div>
          <div>
            <p>Країна: {selectedCountry.name.common}</p>
            <p>Регіон: {selectedCountry.region}</p>
            <p>Площа: {selectedCountry.area} км²</p>
          </div>
        </div>
      ) : (
        <p>Інформація не знайдена</p>
      )}
    </div>
  );
}

function CountryDetails() {
  const { countryName } = useParams();
  const [countryData, setCountryData] = useState(null);
  const [neighboringCountries, setNeighboringCountries] = useState([]);

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountryData(data[0]);

          const borderCountries = data[0].borders;
          if (borderCountries && borderCountries.length > 0) {
            const neighboringCodes = borderCountries.map((code) => code.toUpperCase());
            axios
              .get(`https://restcountries.com/v3.1/alpha?codes=${neighboringCodes}`)
              .then((response) => {
                setNeighboringCountries(response.data);
              })
              .catch((error) => console.log(error));
          }
        }
      })
      .catch((error) => console.log(error));
  }, [countryName]);

  if (!countryData) {
    return <div>Loading...</div>;
  }

  const countryFlag = countryData.flags.png;
  const countryFullName = countryData.name.common;
  const countryRegions = countryData.region;
  const countryAreas = countryData.area;
  const countryCodes = countryData.cca2;
  const countryCapital = countryData.capital;
  const countryPopulation = countryData.population;
  const countryBorders = countryData.borders;

  return (
    
    <div className="country-details">
      <img src={countryFlag} alt="Прапор країни" />
      <p className='choise'>Назва країни: {countryFullName}</p>
      <p>Регіон: {countryRegions}</p>
      <p>Площа: {countryAreas} км²</p>
      <p>Код країни: {countryCodes}</p>
      <p>Столиця: {countryCapital}</p>
      <p>Населення: {countryPopulation}</p>
      <p>Країни, що межують:</p>
      <ul>
        {neighboringCountries.map((country) => (
          <li key={country.name.common}>
            <Link to={`/${country.name.common}`}>{country.name.common}</Link>
          </li>
        ))}
      </ul>
      <Link to="/">Повернутися на головну сторінку</Link>
      
    </div>
  );
}

function CountryList() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => setCountries(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCountryMouseEnter = (country) => {
    setSelectedCountry(country);
  };

  const handleCountryMouseLeave = () => {
    setSelectedCountry(null);
  };

  const handleCountryClick = (country) => {
    window.location.href = `/${country.name.common}`;
  };

  const sortCountriesByRegion = () => {
    const sortedCountries = [...countries].sort((a, b) => a.region.localeCompare(b.region));
    setCountries(sortedCountries);
    setCurrentPage(1);
  };

  const sortCountriesByName = () => {
    const sortedCountries = [...countries].sort((a, b) => a.name.common.localeCompare(b.name.common));
    setCountries(sortedCountries);
    setCurrentPage(1);
  };

  const resetSorting = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data);
        setCurrentPage(1);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCountries = countries.filter((country) => {
    const countryName = country.name.common.toLowerCase();
    return countryName.includes(searchQuery.toLowerCase());
  });

  const totalItemsCount = filteredCountries.length;
  const totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage);

  return (
    <div>
      {selectedCountry && <SelectedCountry selectedCountry={selectedCountry} />}
      <div className="App">
        <div className="header">
          <h2>Список країн</h2>
          <div className="button-container">
            <button onClick={sortCountriesByRegion}>Сортувати за регіоном</button>
            <button onClick={sortCountriesByName}>Сортувати за назвою</button>
            <button onClick={resetSorting}>Скинути сортування</button>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Пошук країни" onChange={handleSearch} />
          </div>
        </div>
        <div className="country-list">
          {filteredCountries
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((country, index) => (
              <div
                key={country.name.common}
                onMouseEnter={() => handleCountryMouseEnter(country)}
                onMouseLeave={handleCountryMouseLeave}
              >
                {`${index + 1 + (currentPage - 1) * itemsPerPage}.`}{' '}
                <img src={country.flags.svg} alt={`${country.name.common} прапор`} />
                <Link to={`/${country.name.common.toLowerCase()}`} onClick={() => handleCountryClick(country)}>
                  {country.name.common}
                </Link>
              </div>
            ))}
        </div>
        <div className="pagination-container">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/:countryName" element={<CountryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
