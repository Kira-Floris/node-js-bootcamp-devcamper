const nodeGeocoder = require('node-geocoder');

const env_variables = require('../envData');

const options = {
    provider: env_variables.GEOCODER_PROVIDER,
    httpAdaper: 'https',
    apiKey: env_variables.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = nodeGeocoder(options);

module.exports = geocoder;