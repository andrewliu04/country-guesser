const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// fetching random country from restcountries API
router.get('/question', auth, async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,continents');
    const countries = response.data;

    // generate random country
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];

    const countryData = {
      country: randomCountry.name.common,
      flag: randomCountry.flags.svg, 
      continent: randomCountry.continents[0],
    };

    res.json(countryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'error fetching data' });
  }
});

// logic for checking answer correctness
router.post('/submit-answer', auth, async (req, res) => {
  const { selectedLatLng, currentCountry } = req.body;

  try {
    const options = {
      method: 'GET',
      url: 'https://reverse-geocoder.p.rapidapi.com/v1/getCountryByLocation',
      params: {
        lat: selectedLatLng[0],  
        lon: selectedLatLng[1]  
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'reverse-geocoder.p.rapidapi.com'
      }
    };


    const response = await axios.request(options);
    const clickedCountry = response.data.address?.country;

    let isCorrect = false;
    if (clickedCountry === currentCountry.country) {
      isCorrect = true;
    }

    res.json({ isCorrect, clickedCountry });
  } catch (err) {
    console.error('error validating answer:', err);
    res.status(500).json({ msg: 'error validating answer' });
  }
});

module.exports = router;
