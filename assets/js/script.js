/*********************************************************
 * Weather Dashboard
 * @package w6c-Weather-Dashboard
 * @author Jeremy C Collins
 * @version Final
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
 *   1.6 getIcon()
 *   1.7 getUvIndex()
 *   1.8 saveSearch()
 * 
 * 2. Document Ready
 *   2.1 Add click listeners (add, edit, delete, reset)
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/
var cityEl = $("#city");
var displayForecastEl = $("#display-forecast");
var displayWeatherEl = $("#display");
var searchHistoryEl = $("#search-history");
var recentCity = (localStorage.getItem("city-names") === null) ? [] : JSON.parse(localStorage.getItem("city-names"));
/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 getWeather()
 */
var getWeather = function (city) {
    var apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=904755abfca69992b8a848481a87baea`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        return displayWeather(data);
                    }).then(function (WeatherResults) {
                        let {
                            lat,
                            lon,
                        } = WeatherResults;
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
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=904755abfca69992b8a848481a87baea`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
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
var citySearch = function (city) {
    // removes old search
    $(".remover").empty();

    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        return;
    }
    saveSearch(city);
};

/**
 * 1.4 displayWeather()
 */

var displayWeather = function (data) {
    var currentDate = moment.unix(data.dt).format("MM/DD/YYYY");
    var iconID = data.weather[0].icon;

    var weatherEl = $("<div>").addClass("remover list-item flex-row justify-space-between align-center");

    var cityDateEl = $("<h2>").addClass("list-item flex-row justify-space-between col-sm").text(`${data.name} ${currentDate}`);
    cityDateEl.append(getIcon(iconID));
    weatherEl.append(cityDateEl);

    var tempEl = $("<div>").addClass("flex-row justify-space-between col-sm").text(`Temp: ${data.main.temp}`);
    weatherEl.append(tempEl);

    var humidityEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").text(`Humidity: ${data.main.humidity}`);
    weatherEl.append(humidityEl);

    var windSpeedEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").text(`Wind Speed: ${data.wind.speed}`);
    weatherEl.append(windSpeedEl);

    var uvIndexEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").attr("id", "uv-index");
    weatherEl.append(uvIndexEl);

    displayWeatherEl.append(weatherEl);

    return {
        lat: data.coord.lat,
        lon: data.coord.lon,
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

        var forecastEl = $("<div>").addClass("remover list-item flex-row justify-space-between align-center");

        var dateEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").text(currentDate);
        forecastEl.append(dateEl);
        dateEl.append(getIcon(iconID));

        var tempEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").text(`Temp: ${data.list[i].main.temp}`);
        forecastEl.append(tempEl);

        var humidityEl = $("<div>").addClass("list-item flex-row justify-space-between col-sm").text(`Humidity: ${data.list[i].main.humidity}`);
        forecastEl.append(humidityEl);

        displayForecastEl.append(forecastEl);
    }
};

/**
 * 1.6 getIcon()
 */
var getIcon = function (iconID) {
    var iconUrl = `http://openweathermap.org/img/wn/${iconID}@2x.png`;
    var iconEl = $("<img>").attr("alt", "Weather icon").attr("src", iconUrl);
    return iconEl;
};

/**
 * 1.7 getUvIndex()
 */
var getUVIndex = function (latitude, longitude) {
    var APIKEY = "904755abfca69992b8a848481a87baea";
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?";
    var queryParams = {};
    queryParams.appid = APIKEY;
    queryParams.lat = latitude;
    queryParams.lon = longitude;

    apiUrl = apiUrl + $.param(queryParams);

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    $("#uv-index").html(`UV Index ${data.value}`);

                    if (data.value > 5) {
                        $("#uv-index").addClass("badge badge-danger");
                    } else if (data.value > 2) {
                        $("#uv-index").addClass("badge badge-warning");
                    } else {
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
/**
 * 1.8 saveSearch()
 */
var saveSearch = function (city) {
    cityEl.empty();
    searchHistoryEl.empty();

    if(city === ""){
        alert("Enter City Name!");// prevent empty search history
        return;
    }
    console.log("RECENTCITY  ============", recentCity);
    if (recentCity.indexOf(city) === -1) {
        recentCity.push(city);
    }
    console.log("RECENTCITY  ============", recentCity);
    if (recentCity.length > 0) {
        searchHistoryEl.show();
        var searchCity = $("<h4>").append("Recent Cities").addClass("remover");
        searchHistoryEl.append(searchCity);
        for (var i = 0; i < recentCity.length; i++){
            var btn = $("<btn>").addClass("btn btn-secondary remover").attr("data-topic-index", i).text(recentCity[i]);
            searchHistoryEl.append(btn);  
        }
    } else {
        searchHistoryEl.hide();
    }
    localStorage.setItem("city-names", JSON.stringify(recentCity));
};

/* ===============[ 2. Document Ready ]=========================*/
$(function () {
/**
 * 2.1 Add click listeners (add, edit, delete, reset)
 */
$("#submit-weather").on("click", function(){
    var city = cityEl.val().trim();
    citySearch(city);
});
searchHistoryEl.on("click", '.btn-secondary', function(){
    var city = $(this).text();
    city = (city !== undefined) ? city.trim() : "";
    citySearch(city);
});

});
