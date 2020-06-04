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
var cityEl = $("#city");
var displayForecastEl = $("#display-forecast");
var displayWeatherEl = $("#display");
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 getWeather()
 */
var getWeather = function (city) {


    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=904755abfca69992b8a848481a87baea";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                .then(function (data) {
                    console.log("response ok");
                    return displayWeather(data);
                }).then(function(WeatherResults) {
                    let {lat, lon} = WeatherResults; 
                    getUVIndex(lat, lon);
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
    var city = cityEl.val().trim();

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
    var currentDate = moment.unix(data.dt).format("MM/DD/YYYY");
    var iconID = data.weather[0].icon;

    // var uvIndexUrl =

    var weatherEl = $("<div>")
    .addClass("list-item flex-row justify-space-between align-center");
    

    var cityDateEl = $("<h2>")
    .addClass("list-item flex-row justify-space-between col-sm")
    .text(`${data.name} ${currentDate}`);
    cityDateEl.append(getIcon(iconID));
    weatherEl.append(cityDateEl);

    var tempEl = $("<div>")
    .addClass("list-item flex-row justify-space-between col-sm")
    .text(`Temp: ${data.main.temp}`);
    weatherEl.append(tempEl);

    var humidityEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm")
    .text(`Humidity: ${data.main.humidity}`);
    weatherEl.append(humidityEl);

    var windSpeedEl = $("<div>")
    .addClass("list-item flex-row justify-space-between col-sm")
    .text(`Wind Speed: ${data.wind.speed}`);
    weatherEl.append(windSpeedEl);

    var uvIndexEl = $("<div>")
    .addClass("list-item flex-row justify-space-between col-sm")
    .attr("id","uv-index");
    weatherEl.append(uvIndexEl);

    displayWeatherEl.append(weatherEl);

    return { 
        lat: data.coord.lat, 
        lon: data.coord.lon 
    };
};

/**
 * 1.5 displayForecast()
 */
var displayForecast = function (data) {
    for (var i = 0; i < data.list.length; i = i + 8) {
        var iconID = data.list[i].weather[0].icon;
        // i + 8 because 3 hour increments. want to push 24 hours.
        var currentDate = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
        
        var forecastEl = $("<div>");
        forecastEl.addClass("list-item flex-row justify-space-between align-center");

        var dateEl = $("<div>");
        dateEl.addClass("list-item flex-row justify-space-between col-sm");
        dateEl.text(currentDate);
        forecastEl.append(dateEl);

        dateEl.append(getIcon(iconID));

        var tempEl = $("<div>");
        tempEl.addClass("list-item flex-row justify-space-between col-sm");
        tempEl.text(`Temp: ${data.list[i].main.temp}`);
        forecastEl.append(tempEl);

        var humidityEl = $("<div>");
        humidityEl.addClass("list-item flex-row justify-space-between col-sm");
        humidityEl.text(`Humidity: ${data.list[i].main.humidity}`);
        forecastEl.append(humidityEl);

        displayForecastEl.append(forecastEl);
    }
};

/**
 * 1.6 getIcon()
 */
var getIcon = function(iconID) {
    var iconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
    var iconEl = $("<img>").attr("alt", "Weather icon").attr("src", iconUrl);
    return iconEl;
};

 /**
 * 1.7 getUvIndex()
 */
var getUVIndex = function( latitude, longitude){
    var APIKEY = "904755abfca69992b8a848481a87baea";
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = {};
    queryParams.appid = APIKEY;
    queryParams.lat = latitude;
    queryParams.lon = longitude;
  
    apiUrl = apiUrl + $.param(queryParams);
    console.log("-----------[ API URL ]------------------------");
    console.log(apiUrl);
    console.log("-----------------------------------------------");
  
    fetch(apiUrl)
      .then(function (response) {
          if (response.ok) {
              response.json().then(function (data) {
                  $("#uv-index").html(`UV Index ${data.value}`);
  
                  if(data.value > 5 ){
                      $("#uv-index").addClass("badge badge-danger");
                  }else if(data.value > 2){
                      $("#uv-index").addClass("badge badge-warning");
                  }else{
                      $("#uv-index").addClass("badge badge-success");
                  }
  
              });
  
          } else {
              alert("Error: " + response.statusText);
          }
      })
      .catch(function (error) {
          alert("Unable to getUVIndex data!");
      });
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