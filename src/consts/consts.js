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

// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const HazardousConditions = ['Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado', 'Thunderstorm']

module.exports = {
    ActivitySearchQueries,
    HazardousConditions
}