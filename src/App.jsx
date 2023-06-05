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
            <img className="img-country" src={selectedCountry.coatOfArms?.svg} alt='' />
          </div>
          <div className='text-size'>
            <p>Країна: {selectedCountry.name.common}</p>
            <p>Столиця: {selectedCountry.capital}</p>
            <p>Площа: {selectedCountry.area} км²</p>
            <p>Континент: {selectedCountry.continents}</p>
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

  const countryFlag = countryData.flags.svg;
  const countryFlags = countryData.coatOfArms.svg;
  const countryFullName = countryData.name.common;
  const countryRegions = countryData.region;
  const countrySubregion = countryData.subregion;
  const countryStatus = countryData.status;
  const countryCapital = countryData.capital;
  const countryAltSpellings = countryData.altSpellings;
  const countryAreas = countryData.area;
  const countryContinents = countryData.continents;
  const countryStartOfWeek = countryData.startOfWeek;
  const countryCodes = countryData.cca2;
  const countryPopulation = countryData.population;
  const countryBorders = countryData.borders;
  const countryFifa = countryData.fifa;
  const countryTld = countryData.tld;
  const countryOfficial = countryData.official;
  const countryFlagEmoji = countryData.flags.emoji;
  const countryLandlock = countryData.landlocked;
  const countryIndependent = countryData.independent;
  const countryUnMember = countryData.unMember;
  const countryTimezones = countryData.timezones;
  const countryCurrencies = Object.values(countryData.currencies || {});

  return (
    <div className="country-details">
            <Link className="link" to="/">
          Повернутися на головну сторінку
        </Link>
      <div className="country-info">

        <img src={countryFlag} alt="Прапор країни" />
        <i>Прапор країни</i>
        <p className="choise">Назва країни: {countryFullName}</p>
        <p>Регіон: {countryRegions}</p>
        <p>Підрегіон: {countrySubregion}</p>
        <p>Статус: {countryStatus}</p>
        <p>Столиця: {countryCapital}</p>
        <p>Альтернативне написання: {countryAltSpellings.join(', ')}</p>
        <p>Площа: {countryAreas} км²</p>
        <p>Континенти: {countryContinents.join(', ')}</p>
        <p>Старт тижня: {countryStartOfWeek}</p>
        <p>Код країни: {countryCodes}</p>
        <p>Населення: {countryPopulation}</p>
        <p>Fifa: {countryFifa}</p>
        <p>Tld: {countryTld}</p>
        <p>Official: {countryOfficial}</p>
        <p>Landlocked: {countryLandlock ? 'Так' : 'Ні'}</p>
        <p>Independent: {countryIndependent ? 'Так' : 'Ні'}</p>
        <p>UN Member: {countryUnMember ? 'Так' : 'Ні'}</p>
        <p>Часові пояси: {countryTimezones.join(', ')}</p>
        <p>Валюти: {countryCurrencies.join(', ')}</p>
        <p>Країни, що межують:</p>
        <ul>
          {neighboringCountries.map((country) => (
            <li key={country.name.common}>
              <Link to={`/${country.name.common}`}>{country.name.common}</Link>
            </li>
          ))}
        </ul>
   
      </div>
    </div>
  );
}
document.body.style.display = 'initial';

function CountryList() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubregion, setSelectedSubregion] = useState('');
  const [regions, setRegions] = useState([]);
  const [subregions, setSubregions] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const uniqueRegions = [...new Set(response.data.map((country) => country.region))];
        setCountries(response.data);
        setRegions(uniqueRegions);
        setSubregions([]);
        setSelectedRegion('');
        setSelectedSubregion('');
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedRegion === '' && selectedSubregion === '') {
      resetSorting();
    } else {
      const filteredCountries = countries.filter((country) => {
        if (selectedRegion !== '' && selectedSubregion !== '') {
          return country.region.includes(selectedRegion) && country.subregion === selectedSubregion;
        } else if (selectedRegion !== '') {
          return country.region.includes(selectedRegion);
        } else {
          return country.subregion === selectedSubregion;
        }
      });
      setCountries(filteredCountries);
      setCurrentPage(1);
    }
  }, [selectedRegion, selectedSubregion]);

  useEffect(() => {
    const uniqueSubregions = [...new Set(countries.map((country) => country.subregion))];
    setSubregions(uniqueSubregions);
  }, [countries]);

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

  const handleRegionSelect = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedSubregion('');
  };

  const handleSubregionSelect = (event) => {
    setSelectedSubregion(event.target.value);
    setSelectedRegion('');
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
          <input className='ged' type="text" placeholder="Пошук країни" onChange={handleSearch} />

          <div className="search-container">
            <select className='Sort' value={selectedRegion} onChange={handleRegionSelect}>
              <option value="">Всі регіони</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select className='Sort-2' value={selectedSubregion} onChange={handleSubregionSelect}>
              <option value="">Всі підрегіони</option>
              {subregions.map((subregion) => (
                <option key={subregion} value={subregion}>
                  {subregion}
                </option>
              ))}
            </select>
          </div>
          <div className="button-container">
            <button onClick={resetSorting}>Скинути сортування</button>
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
        <div className="pagination">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item"
            linkClass="page-link"
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
