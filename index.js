/* Select the elements in the HTML view page */
const notification = document.querySelector(".notification");
const weatherIcon = document.querySelector(".weather-icon");
const temperatureValue = document.querySelector(".temperature-value p");
const temperatureDesc = document.querySelector(".temperature-desc p");
const theLocation = document.querySelector(".location p");
const weatherContainer = document.querySelector(".weather-container");

const key = "686235aad380a833aa98fe1f31e6df6e";

/* Determinate an object with the main characteristics of the weather */
const weather = {
  temperature: {
    value: undefined,
    unit: "C",
  },
  humidity: undefined,
  wind_speed: undefined,
  description: "",
  idIcon: "",
  city: "",
  country: "",
};

function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      console.log(data);
      weather.temperature.value = Math.floor(data.main.temp - 273);
      weather.description = capitalLetter(data.weather[0].description);
      weather.idIcon = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.humidity = data.main.humidity;
      weather.wind_speed = Math.floor(data.wind.speed * 3.6);
    })
    .then(() => {
      displayWeather();
    });
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position, error) => {
      if (error) {
        console.log(error.message);
        notification.style.display = "block";
        notification.innerHTML = `<p> ${error.message} </p>`;
        return;
      }

      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      getWeather(latitude, longitude);
    },
    (err) => {
      if (err) {
        weather.idIcon = "unknown";
        notification.style.display = "block";
        notification.innerHTML = `<p>Can't get geolocation</p>`;
        console.warn("ERROR(" + err.code + "): " + err.message);
      }
    }
  );
} else {
  weather.idIcon = "unknown";
  notification.style.display = "block";
  notification.innerHTML = `<p> Your browser don't support geolocation </p>`;
}

/* Functions useful to comvert the value to Celsius or Fahrenheit */

function celsiusToFahrenheit(value) {
  return Math.floor((value * 9) / 5 + 32);
}

function capitalLetter(string) {
  return string[0].toUpperCase() + string.substring(1);
}

/* Show the object Weather  */
function displayWeather() {
  weatherIcon.innerHTML = `<img src="./svg/${weather.idIcon}.svg">`;
  temperatureValue.innerHTML = `${weather.temperature.value} ° <span>${weather.temperature.unit}</span>`;
  temperatureDesc.innerHTML = `<p class="description">${weather.description}</p>`;
  temperatureDesc.append(`Humidity: ${weather.humidity}%`)
  temperatureDesc.append(` - Wind speed: ${weather.wind_speed} K/h`) 
  theLocation.innerHTML = `${weather.city}, ${weather.country}`;
}

/* Listen when the user clicks on the temperature to change it into other unit */
temperatureValue.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "C") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    weather.temperature.unit = "F";
    temperatureValue.innerHTML = `${fahrenheit} ° <span>${weather.temperature.unit}</span>`;
  } else {
    let celsius = weather.temperature.value;
    weather.temperature.unit = "C";
    temperatureValue.innerHTML = `${celsius} ° <span>${weather.temperature.unit}</span>`;
  }
});

// displayWeather()
