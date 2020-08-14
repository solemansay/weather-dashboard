$(document).ready(function () {
    var cityName = [];
    var APIKey = "f378a622b41dd82d10888eacc8fc38ae";
    var cityInput;

    // This gets today's forecast
    function getTodaysForcast(city) {


        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;


        $.ajax({
            url: weatherURL,
            method: "GET"
        })
            .then(function (response) {

                var makeImg = $("<img class='wIcon floatLeft' src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='Weather Icon'>");

                var lon = response.coord.lon;
                var lat =  response.coord.lat;
                var city = response.name;
                var todayForecast = Math.round(response.main.temp);
                var todayDesc = response.weather[0].description;
                var todayWind = Math.round(response.wind.speed);
                var todayHumidity = response.main.humidity;
                var UV = "http://api.openweathermap.org/data/2.5/uvi/history?appid={appid}&lat=" + lat + "&lon=" + lon

                console.log(lon, lat)

                var day = $("<div>")
                day.append("<h1>" + city + "'s Forecast" + "</h1>"
                    + "<h2 class='floatLeft'>" + "Today" + "</h2>");
                day.append(makeImg);
                day.append("<div class='clear'>" +
                    "<br>" +
                    "Temperature: " + todayForecast + "F" + "<br>" +
                    todayDesc + "<br> " +
                    "Wind Speed: " + todayWind + "MPH " + "<br>" +
                    "Humidity: " + todayHumidity + "% " + "</div>" +
                    "UV index: "  + UV 
                );

                $("#todaysForecast").append(day);

            });
    }

    
    // This function takes the user's input and retrieves the data from the weather api as well as push the input into the array declared at the top of this page
    function rendercities() {
        $("#displayWeather").empty();
        $("#todaysForecast").empty();

        cityInput = $("#city-input").val().trim();

        getTodaysForcast(cityInput);
        getFourDayForecast(cityInput);

        // Checks to see if the city entered already exists in the cityName array. If so, it does not add it again
        if (cityName.includes(cityInput)) {
            return;
        }
        else {
            cityName.push(cityInput);
        }
        storeCities();
        cityHistory();
        searchResults();
    }


    $("#add-city").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation()
        rendercities();
        storeCities();
    });

    function storeCities() {
        localStorage.setItem("cityName", JSON.stringify(cityName));
    }

    // This function creates buttons to create a history of recently searched cities
    function cityHistory() {
        $("#searchHistory").empty();
        for (var i = 0; i < cityName.length; i++) {
            var city = cityName[i];
            var li = $("<li class='styleList'>");
            li.css("list-style-type", "none");
            var button = $("<button class='btn btn-link'>" + city + "</button>");
            li.append(button);
            $("#searchHistory").append(li);

        }
    }
    // Checks to see if a button was clicked, if so, it takes the text of the button and displays the weather for that city
    function searchResults() {
        $("li").click(function (event) {
            event.preventDefault()
            event.stopPropagation()

            var target = $(event.target);
            if (target.is("button")) {
                $("#displayWeather").empty();
                $("#todaysForecast").empty();

                cityInput = $(event.target).text()
                getTodaysForcast(cityInput);
                getFourDayForecast(cityInput);

            }
        });
    }

    // Displays the buttons for all recently searched cities
    function init() {
        var storedCities = JSON.parse(localStorage.getItem("cityName"));
        if (storedCities !== null) {
            cityName = storedCities;
        }
        cityHistory()
    }
})