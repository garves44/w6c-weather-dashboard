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
 *   1.2 citySearch()
 *   1.3 Time function
 * 
 * 2. Document Ready
 *   2.1 Render Schedule on ready
 *   2.2 Add click listeners (add, edit, delete, reset)
 * 
 * 3. Dead Code
 * 
 *********************************************************/

/* ===============[ 0. GLOBALS ]=========================*/

/* ===============[ 1. Functions ]=========================*/

/**
 * 1.1 getWeather()
 */
var getWeather = function(city) {

    var apiUrl ="http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=904755abfca69992b8a848481a87baea";

    fetch(apiUrl)
    .then(function (response){
        if (response.ok) {
            response.json().then(function (data){
                displayWeather(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Unable to gather weather data!");
    });
};

/**
 * 1.2 citySearch()
 */
var citySearch = function (event) {
    event.preventDefault();
    var city = $('#city').value.trim();

    if (city) {
        getUserRepos(city);
        $('#city').value = "";
    } else {
        alert("Please enter a city name!");
    }

};



/* ===============[ 2. Document Ready ]=========================*/










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
//             statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issues";
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

