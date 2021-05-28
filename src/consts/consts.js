const ActivitySearchQueries = new Map([
    ['hiking', ['hiking trail']],
    ['basketball', ['basketball court', 'indoor basketball court', 'basketball park']],
    ['picnic', ['park', 'picnic area']],
    ['biking', ['biking trail']],
    ['snowboarding', ['ski resort']],
    ['eating', ['restaurants', 'food']],
    ['rock_climbing', ['rock climbing']],
    ['kayaking', ['kayaking']],
    ['canoeing', ['canoeing']],
    ['fishing', ['fishing']],
    ['skiing', ['ski resort']],
    ['soccer', ['soccer field']],
    ['volleyball', ['volleyball court']],
    ['walking', ['walking trail', 'park']],
    ['football', 'football field'],
    ['swimming', ['swimming pool', 'indoor pool', 'beach']],
    ['beach', ['beach']],
    ['golf', ['golf course']],
    ['baseball', ['baseball field']],
    ['badminton', ['badminton court']],
    ['tennis', ['tennis court']],
    ['camping', ['camp sites', 'camping grounds']],
    ['shooting', ['shooting range', 'gun range']],
    ['skateboarding', ['skateboarding park', 'skate park']],
    ['archery', ['archery', 'archery range']]

    //
    // TODO: fill out more activities/queries
    //
]);

const ActivityDetails = new Map([
    ['hiking', {title: 'Hiking', backgroundImageURL: 'archery.jpg'}],
    ['basketball', {title: 'Basketball', backgroundImageURL: 'archery.jpg'}],
    ['picnic', {title: 'Picnicking', backgroundImageURL: 'archery.jpg'}],
    ['biking', {title: 'Biking', backgroundImageURL: 'archery.jpg'}],
    ['snowboarding', {title: 'Snowboarding', backgroundImageURL: 'archery.jpg'}],
    ['eating', {title: 'Eating', backgroundImageURL: 'archery.jpg'}],
    ['rock_climbing', {title: 'Rock Climbing', backgroundImageURL: 'archery.jpg'}],
    ['kayaking', {title: 'Kayaking', backgroundImageURL: 'archery.jpg'}],
    ['canoeing', {title: 'Canoeing', backgroundImageURL: 'archery.jpg'}],
    ['fishing', {title: 'Fishing', backgroundImageURL: 'archery.jpg'}],
    ['skiing', {title: 'Skiing', backgroundImageURL: 'archery.jpg'}],
    ['soccer', {title: 'Soccer', backgroundImageURL: 'archery.jpg'}],
    ['volleyball', {title: 'Volleyball', backgroundImageURL: 'archery.jpg'}],
    ['walking', {title: 'Walking', backgroundImageURL: 'archery.jpg'}],
    ['football', {title: 'Football', backgroundImageURL: 'archery.jpg'}],
    ['swimming', {title: 'Swimming', backgroundImageURL: 'archery.jpg'}],
    ['beach', {title: 'Beach', backgroundImageURL: 'archery.jpg'}],
    ['golf', {title: 'Golf', backgroundImageURL: 'archery.jpg'}],
    ['baseball', {title: 'Baseball', backgroundImageURL: 'archery.jpg'}],
    ['badminton', {title: 'Badminton', backgroundImageURL: 'archery.jpg'}],
    ['tennis', {title: 'Tennis', backgroundImageURL: 'archery.jpg'}],
    ['camping', {title: 'Camping', backgroundImageURL: 'archery.jpg'}],
    ['shooting', {title: 'Shooting', backgroundImageURL: 'archery.jpg'}],
    ['skateboarding', {title: 'Skateboarding', backgroundImageURL: 'archery.jpg'}],
    ['archery', {title: 'Archery', backgroundImageURL: 'archery.jpg'}]
])

// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const HazardousConditions = ['Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado', 'Thunderstorm']

module.exports = {
    ActivitySearchQueries,
    ActivityDetails,
    HazardousConditions
}