/*********************************************************
 * Weather Dashboard
 * @package w6c-Weather-Dashboard
 * @author Jeremy C Collins
 * @version develop
 * @license none (public domain)
 * 
 * ===============[ TABLE OF CONTENTS ]===================
 * 0. Globals
 * 1. Functions
 *   1.1 getWeather()
 *   1.2 getForecast()
 *   1.3 citySearch()
 *   1.4 displayWeather()
 *   1.5 displayForecast()
 * 
 * 2. Document Ready
 *   2.1 Render Weather on ready
 *   2.2 Add click listeners (add, edit, delete, reset)
 * 
 * 3. Dead Code
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var cityEl = document.getElementById("city");
var displayForecastEl = document.getElementById("display-forecast");
var displayWeatherEl = document.getElementById("display");
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 getWeather()
 */
var getWeather = function (city) {


    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=904755abfca69992b8a848481a87baea";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log("response ok");
                    displayWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to gather weather data!");
        });
};

/**
 * 1.2 getForecast()
 */
var getForecast = function (city) {


    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=904755abfca69992b8a848481a87baea";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log("response ok");
                     displayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to gather weather data!");
        });
};

/**
 * 1.3 citySearch()
 */
var citySearch = function (event) {
    event.preventDefault();
    var city = cityEl.value.trim();

    if (city) {
        getWeather(city);
        getForecast(city);
        city.value = "";
    } else {
        alert("Please enter a city name!");
    }

};

/**
 * 1.4 displayWeather()
 */

var displayWeather = function (data) {
    console.log("data.weather.icon", data.weather[0].icon);
    console.log("data.weather", data.weather[0]);
    var currentDate = moment.unix(data.dt).format("MM/DD/YYYY");

    var iconID = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`;




    var iconEl = $("<img>").attr("alt", "Weather icon").attr("src", iconUrl);

    // iconEl = $("<span>").append(iconEl);
    console.log("iconEl =",iconEl);
    



    var weatherEl = document.createElement("div");
    weatherEl.classList = "list-item flex-row justify-space-between align-center";

    var cityDateEl = $("<h2>");
    cityDateEl.addClass("list-item flex-row justify-space-between col-sm").text(`${data.name} ${currentDate}`);
    cityDateEl.append(iconEl);

    // cityDateEl.classList = "list-item flex-row justify-space-between col-sm"
    // cityDateEl.textContent = `${data.name} ${currentDate} ${iconEl}`
    // cityDateEl.append(iconEl);
    weatherEl.append(cityDateEl);
    console.log("cityDateEl =", cityDateEl);

    var tempEl = document.createElement("div");
    tempEl.classList = "list-item flex-row justify-space-between col-sm"
    tempEl.textContent = `Temp: ${data.main.temp}`;
    weatherEl.appendChild(tempEl);

    var humidityEl = document.createElement("div");
    humidityEl.classList = "list-item flex-row justify-space-between col-sm"
    humidityEl.textContent = `Humidity: ${data.main.humidity}`;
    weatherEl.appendChild(humidityEl);

    var windSpeedEl = document.createElement("div");
    windSpeedEl.classList = "list-item flex-row justify-space-between col-sm"
    windSpeedEl.textContent = `Wind Speed: ${data.wind.speed}`;
    weatherEl.appendChild(windSpeedEl);

    var uvIndexEl = document.createElement("div");
    uvIndexEl.classList = "list-item flex-row justify-space-between col-sm"
    uvIndexEl.textContent = `UV Index INCOMPLETED`;
    weatherEl.appendChild(uvIndexEl);

    displayWeatherEl.appendChild(weatherEl);
};

/**
 * 1.5 displayForecast()
 */
var displayForecast = function (data) {
    for (var i = 0; i < data.list.length; i = i + 8) {
        // i + 8 because 3 hour increments. want to push 24 hours.
        var currentDate = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
        console.log("for loop has started and is on position", i);
        var forecastEl = document.createElement("div");
        forecastEl.classList = "list-item flex-row justify-space-between align-center";

        var dateEl = document.createElement("div");
        dateEl.classList = "list-item flex-row justify-space-between col-sm"
        dateEl.textContent = currentDate;
        forecastEl.appendChild(dateEl);

        // var iconEl =  NEEDS TO BE DONE STILL

        var tempEl = document.createElement("div");
        tempEl.classList = "list-item flex-row justify-space-between col-sm"
        tempEl.textContent = `Temp: ${data.list[i].main.temp}`;
        forecastEl.appendChild(tempEl);

        var humidityEl = document.createElement("div");
        humidityEl.classList = "list-item flex-row justify-space-between col-sm"
        humidityEl.textContent = `Humidity: ${data.list[i].main.humidity}`;
        forecastEl.appendChild(humidityEl);

        displayForecastEl.appendChild(forecastEl);
    }
};



/* ===============[ 2. Document Ready ]=========================*/

/**
 * 2.1 Render Weather on ready
 */

/**
 * 2.2 Add click listeners (add, edit, delete, reset)
 */

$("#submit-weather").on("click", citySearch);









/* ===============[ 3. Dead Code ]=========================*/

// /**
//  * 1.3 displayRepos()
//  */
// var displayRepos = function (repos, searchTerm) {
//     if (repos.length === 0) {
//         repoContainerEl.textContent = "No repositories found.";
//         return;
//     }
//     // Reset Content
//     repoContainerEl.textContent = "";
//     repoSearchTerm.textContent = searchTerm;

//     // Loop over Repo
//     for (var i = 0; i < repos.length; i++) {
//         var repoName = repos[i].owner.login + "/" + repos[i].name;
//         var repoEl = document.createElement("a");
//         repoEl.classList = "list-item flex-row justify-space-between align-center";
//         repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
//         var titleEl = document.createElement("span");
//         titleEl.textContent = repoName;
//         repoEl.appendChild(titleEl);
//         var statusEl = document.createElement("span");
//         statusEl.classList = "flex-row align-center";

//         if (repos[i].open_issues_count > 0) {
//             statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></img>" + repos[i].open_issues_count + " issues";
//         } else {
//             statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//         }
//         repoEl.appendChild(statusEl);
//         repoContainerEl.appendChild(repoEl);
//     }
// };
// /**
//  * 1.4 getFeaturedRepos()
//  */
// var getFeaturedRepos = function(language) {d
//     var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

//     fetch(apiUrl)
//     .then(function(response){
//         if (response.ok) {
//             response.json().then(function(data){
//                 displayRepos(data.items, language);
//             });
//         } else {
//             alert("Error: " + response.statusText);
//         }
//     });
// };
// /**
//  * 1.5 buttonClickHandler()
//  */
// var buttonClickHandler = function(event){
//     var language = event.target.getAttribute("data-language");
//     if (language) {
//         getFeaturedRepos(language);
//         repoContainerEl.textContent = "";
//     }
// };