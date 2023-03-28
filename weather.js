
function getGeolocation (cityName) {
    let apiKey = '0ebbceaeaaed1688505c655f379d7f8d';
    return fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1' + '&appid=' + apiKey)
        .then(response => response.json())
        .then(response => response[0])
        .catch(err => console.error(err));
}

async function getWeather (latitude, longitude) {
    return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + 
    '&hourly=cloudcover,temperature_2m,precipitation_probability,precipitation,weathercode,relativehumidity_2m,apparent_temperature&current_weather=true' + /* hourly weather */
    '&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode,sunrise,sunset&timezone=auto') /* daily weather */
        .then(response => response.json())
        .catch(err => console.error(err));
}

async function getAllInfo () {
    const inputCity = document.getElementById("search-input").value;
    // Get the information about the city
    const cityInfo = await getGeolocation(inputCity);
    const city = cityInfo.name;
    const country = cityInfo.country;
    const latitude = cityInfo.lat;
    const longitude = cityInfo.lon;
    const weather = await getWeather(latitude, longitude);
    const sunrise = new Date(weather.daily.sunrise[0]);
    const sunset = new Date(weather.daily.sunset[0]);
    const humidity = getHumidity(weather.hourly.time, weather.hourly.relativehumidity_2m);
    const precipitation = getPrecipitation(weather.hourly.time, weather.hourly.precipitation_probability);
    const cloudCover = getCloudCover(weather.hourly.time, weather.hourly.cloudcover);
    document.getElementById("city").innerHTML = city + " (" + country + ")";
    document.getElementById("current-weather").innerText = weather.current_weather.temperature + `\u00B0C`;
    document.getElementById("wind").innerText = weather.current_weather.windspeed + 'km/h';
    document.getElementById("humidity").innerText = humidity + "%";
    document.getElementById("precipitation").innerText = precipitation + "%";
    document.getElementById("sunrise").innerText = ` ${sunrise.getHours()}:${sunrise.getMinutes()}`;
    document.getElementById("sunset").innerText = ` ${sunset.getHours()}:${sunset.getMinutes()}`;
    document.getElementById("weather-code").innerText = getWeatherInterpretation(weather.current_weather.weathercode);
    document.getElementById("cloud-cover").innerText = cloudCover + '%';
    changeBackground(weather.current_weather.weathercode);
    displayDailyTemperatures(weather.daily.time, weather.daily.temperature_2m_min, weather.daily.temperature_2m_max);
}

function getHourlyValue (time, values) {
    let currentHour = (new Date()).getHours();
    let currentDay = (new Date()).getDate();
    let index = -1;
    for (let i = 0; i < time.length; i++) {
        let hour = (new Date(time[i])).getHours();
        let day = (new Date(time[i])).getDate();
        if (hour == currentHour && day == currentDay) {
            index = i;
        }
    }
    return values[index];
}

function getHumidity (time, humidity) {
    return getHourlyValue(time, humidity);
}

function getPrecipitation (time, precipitation) {
    return getHourlyValue(time, precipitation);
}

function getCloudCover (time, cloudCover) {
    return getHourlyValue(time, cloudCover);
}

function displayDailyTemperatures (time, minTemp, maxTemp) {
    let daysOfWeek = {
        "0": "SUN",
        "1": "MON",
        "2": "TUE",
        "3": "WED",
        "4": "THU",
        "5": "FRI",
        "6": "SAT",
    }
    for (let i = 0; i < time.length; i++) {
        let day = daysOfWeek[(new Date(time[i])).getDay() + ""];
        let min = minTemp[i];
        let max = maxTemp[i];
        document.getElementById('day' + (i+1)).innerText = day;
        document.getElementById('highest' + (i+1)).innerText = max + "\u00B0C ";
        document.getElementById('lowest' + (i+1)).innerText = "/" + min + "\u00B0C";
    }
}

// change background based on weather code
function changeBackground(code) {
    switch (code) {
        case 0:
            document.getElementById("bg-image").style.backgroundImage="url('./images/0.jpg')";
            break;
        case 1:
            document.getElementById("bg-image").style.backgroundImage="url('./images/1.jpg')";
            break;
        case 2:
            document.getElementById("bg-image").style.backgroundImage="url('./images/2.jpg')";
            break;
        case 3:
            document.getElementById("bg-image").style.backgroundImage="url('./images/3.jpg')";
            break;
        case 45:
        case 48:
            document.getElementById("bg-image").style.backgroundImage="url('./images/45,48.jpg')";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            document.getElementById("bg-image").style.backgroundImage="url('./images/51,53,55,56,57.jpg')";
            break;
        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
            document.getElementById("bg-image").style.backgroundImage="url('./images/61,63,65,80,81,82.jpg')";
            break;
        case 66:
        case 67:
            document.getElementById("bg-image").style.backgroundImage="url('./images/66,67.jpg')";
            break;
        case 71:
        case 73:
        case 75:
            document.getElementById("bg-image").style.backgroundImage="url('./images/71,73,75.jpg')";
            break;
        case 77:
            document.getElementById("bg-image").style.backgroundImage="url('./images/77.png')";
            break;
        case 85:
        case 86:
            document.getElementById("bg-image").style.backgroundImage="url('./images/85,86.jpg')";
            break;
        case 95:
            document.getElementById("bg-image").style.backgroundImage="url('./images/95.jpg')";
            break;
        case 96:
        case 99:
            document.getElementById("bg-image").style.backgroundImage="url('./images/96,99.jpg')";
            break;
        default:
            document.getElementById("bg-image").style.backgroundImage="background-image: url('./images/default.jpg')";  
    }
}

function getWeatherInterpretation (code) {
    let weatherInterpretation = {
        "0": "Clear sky",
        "1": "Mainly clear",
        "2": "Partly cloudy",
        "3": "Overcast",
        "45": "Fog",
        "48": "Rime ice",
        "51": "Light drizzle",
        "53": "Drizzle",
        "55": "Dense drizzle",
        "56": "Light freezing drizzle",
        "57": "Dense freezing drizzle",
        "61": "Light rain",
        "63": "Rain",
        "65": "Heavy rain",
        "66": "Light freezing rain",
        "67": "Heavy freezing rain",
        "71": "Slight snowfall",
        "73": "Snowfall",
        "75": "Heavy snowfall",
        "77": "Hail",
        "80": "Slight rain shower",
        "81": "Rain shower",
        "82": "Violent rain shower",
        "85": "Slight snow shower",
        "86": "Heavy snow shower",
        "95": "Thunderstorm",
        "96": "Thunderstorm with slight hail",
        "99": "Thunderstorm with heavy hail"
    }
    return weatherInterpretation[code];
}


document.addEventListener("DOMContentLoaded", function() {
    var searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        document.getElementById("search-button").click();
      }
    });
});