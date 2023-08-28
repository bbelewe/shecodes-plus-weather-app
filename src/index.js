const apiKey = "d67f139b6859d42444fb44355b25ce37";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

let now = new Date();

let buttonSelector = document.querySelector("#date-and-time");
let date = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
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
  mainTemp.innerHTML = `${temperature}°F`;
}
function celChange(event) {
  event.preventDefault();
  mainTemp.innerHTML = `15°C`;
}

let farenheit = document.querySelector("#farenheit-js");
let celcius = document.querySelector("#celcius-js");
farenheit.addEventListener("click", fareChange);
celcius.addEventListener("click", celChange);

function fetchWeather(cityName) {
  const url = `${baseUrl}?q=${cityName}&appid=${apiKey}&units=imperial`;
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const temperature = Math.round(data.main.temp);
      const weatherDescription = data.weather[0].description;

      mainTemp.innerHTML = `${temperature}°F`;
      const weatherIcon = getWeatherIcon(data.weather[0].icon);
      document.querySelector("#current").innerHTML = weatherIcon;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching weather data.");
    });
}
// Map weather icons to Font Awesome classes
function getWeatherIcon(weatherCode) {
  const iconMappings = {
    "01d": '<i class="fas fa-sun sunny"></i>',
    "01n": '<i class="fas fa-moon moon"></i>',
    "02d": '<i class="fas fa-cloud-sun sunny-cloudy"></i>',
    "02n": '<i class="fas fa-cloud-moon moon"></i>',
    "03d": '<i class="fas fa-cloud cloudy"></i>',
    "03n": '<i class="fas fa-cloud cloudy"></i>',
    "04d": '<i class="fas fa-cloud cloudy"></i>',
    "04n": '<i class="fas fa-cloud cloudy"></i>',
  };

  return iconMappings[weatherCode] || '<i class="fas fa-question"></i>'; // Default to a question mark icon
}

function fetchCurrentLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error getting current location:", error);
        alert("An error occurred while getting your current location.");
      }
    );
  } else {
    console.log("Geolocation is not available in this browser.");
  }
}

function fetchWeatherByCoords(latitude, longitude) {
  const url = `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const temperature = Math.round(data.main.temp);
      const weatherDescription = data.weather[0].description;

      mainTemp.innerHTML = `${temperature}°F`;
      document.querySelector("#city").textContent = "Current Location";
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching weather data.");
    });
}

fetchCurrentLocationWeather();
