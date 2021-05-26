const got = require('got')

const searchForPlaces = async (searchTerms, location, radius) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=' + process.env.GOOGLE_PLACES_API_KEY + '&location=' + location.latitude + ',' + location.longitude + '&radius=' + radius + '&keyword=' + encodeURIComponent(searchTerms.join(','));

    let res = await got(url);

    return JSON.parse(res.body);
};

module.exports = searchForPlaces;