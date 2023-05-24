import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { BrowserRouter, Route, Link } from 'react-router-dom';
import CountryList from './CountryList.jsx';
import CountryDetails from './CountryDetails.jsx';
import './App.css';
import Pagination from 'react-js-pagination';




function SelectedCountry({ selectedCountry }) {
  return (
    <div className="selected-country">
      {selectedCountry.name.common !== "Russia" ? (
        <div>
          <div>
            <img className='img-country' src={selectedCountry.coatOfArms?.svg} alt={`${selectedCountry.name.common} coat of arms`} />
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


function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
      .catch(error => console.log(error));
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleCountryMouseEnter = (country) => {
    setSelectedCountry(country);
  }

  const handleCountryMouseLeave = () => {
    setSelectedCountry(null);
  }
  const handleCountryClick = (country) => {
    window.location.href = `/${country.cca2}`;
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
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
        setCurrentPage(1);
      })
      .catch(error => console.log(error));
  };

  const totalItemsCount = countries.length;
  const totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage);

  return (
    <BrowserRouter>
    <div className='Prapor'>
      
      {selectedCountry && <SelectedCountry selectedCountry={selectedCountry} />}
      <div className="App">
        <div className="header">
          <h2>Список країн</h2>
          <div className="button-container">
            <button onClick={sortCountriesByRegion}>Сортувати за регіоном</button>
            <button onClick={sortCountriesByName}>Сортувати за назвою</button>
            <button onClick={resetSorting}>Скинути сортування</button>
          </div>
        </div>
        <CountryList
          countries={countries}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handleCountryMouseEnter={handleCountryMouseEnter}
          handleCountryMouseLeave={handleCountryMouseLeave}
          handleCountryClick={handleCountryClick}
        />
        <div className="pagination-container">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
            prevPageText={'Назад'}
            nextPageText={'Вперед'}
            activeClass={'active'}
          />
        </div>
        
      </div>
      <Routes>
      <Route path="/:countryCode" element={<CountryDetails />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
