const apiKey = "d67f139b6859d42444fb44355b25ce37";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
let farenheitTemperature = null;

let now = new Date();

let buttonSelector = document.querySelector("#date-and-time");
let date = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes().toString().padStart(2, "0");
let year = now.getFullYear();
let days = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];

buttonSelector.innerHTML = `${day} ${month} ${date}, ${hours}:${minutes}, ${year}`;

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#exampleDataList");
  let city = document.querySelector("#city");
  if (searchInput.value) {
    city.innerHTML = `${searchInput.value}`;
    fetchWeather(searchInput.value);
  } else {
    alert(`Please type something`);
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

let mainTemp = document.querySelector("#main-temp-js");
function fareChange(event) {
  event.preventDefault();
  let roundUpF = Math.round(`${farenheitTemperature}`);
  mainTemp.innerHTML = `${roundUpF}°F`;
}
function celChange(event) {
  event.preventDefault();
  let celciusTemperature = ((farenheitTemperature - 32) * 5) / 9;
  let roundUpC = Math.round(`${celciusTemperature}`);
  mainTemp.innerHTML = `${roundUpC}°C`;
}

let farenheit = document.querySelector("#farenheit-js");
let celcius = document.querySelector("#celcius-js");
farenheit.addEventListener("click", fareChange);
celcius.addEventListener("click", celChange);

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKee = "ad793a6d772939c31783de5822791acf";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKee}&units=imperial`;
  console.log(url);
  axios.get(url).then(displayForecast);
}

function fetchWeather(cityName) {
  const url = `${baseUrl}?q=${cityName}&appid=${apiKey}&units=imperial`;
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const temperature = Math.round(data.main.temp);
      const weatherIcon = data.weather[0].icon;
      const description = data.weather[0].description;
      const speed = data.wind.speed;

      farenheitTemperature = data.main.temp;

      mainTemp.innerHTML = `${temperature}°F`;
      document.querySelector(
        "#current"
      ).innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png" alt="Weather Icon" class="main-icon">`;
      document.querySelector(
        "#descript"
      ).innerHTML = `Weather Description: ${description}`;
      document.querySelector("#speed").innerHTML = `Wind Speed: ${speed} Km/H`;

      getForecast(response.data.coord);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching weather data.");
    });
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let currentDay = new Date().getDay();

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    let forecastDayOfWeek = new Date(forecastDay.dt * 1000).getDay();
    if (index > 0 && forecastDayOfWeek !== currentDay) {
      forecastHTML += `<div class="col-2">
        <div class="weather-forecast">
          <div class="days alignment">${formatDay(forecastDay.dt)}</div>
          <img src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" class="forecast-icons" width="75"/>
          <div class="temperatures ocean alignment">
            <span class="tempMax">${Math.round(forecastDay.temp.max)}°</span> /
            <span class="tempMIN">${Math.round(forecastDay.temp.min)}°</span>
          </div>
        </div>
      </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
window.onload = function () {
  fetchWeather("New York");
};
