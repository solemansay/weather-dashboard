$(document).ready(function () {
    var cityName = [];
    var APIKey = "f378a622b41dd82d10888eacc8fc38ae";
    var cityInput;
    init();
    // Displays the buttons for all searched cities
    function init() {
        if (localStorage.getItem("cityArr")) {
            var storedCities = JSON.parse(localStorage.getItem("cityArr"));
            cityName = storedCities
            cityHistory();
        } else {
            cityName
        }

    }


    // This gets today's forecast
    function getTodaysForcast(city) {


        var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

        $("#todaysForecast").empty()
        $.ajax({
            url: weatherURL,
            method: "GET"
        })
            .then(function (response) {
                $("#displayWeather").empty()
                console.log(response)
                var makeImg = $("<img class='wIcon floatLeft' src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='Weather Icon'>");

                var lon = response.coord.lon;
                var lat = response.coord.lat;
                var city = response.name;
                var todayForecast = Math.round(response.main.temp);
                var todayDesc = response.weather[0].description;
                var todayWind = Math.round(response.wind.speed);
                var todayHumidity = response.main.humidity;

                var day = $("<div>")
                day.append("<h1>" + city + "'s Forecast" + "</h1>"
                    + "<h2 class='floatLeft'>" + "Today" + "</h2>");
                day.append(makeImg);
                day.append("<div class='clear'>" +
                    "<br>" +
                    "Temperature: " + todayForecast + "F" + "<br>" +
                    todayDesc + "<br> " +
                    "Wind Speed: " + todayWind + "MPH " + "<br>" +
                    "Humidity: " + todayHumidity + "% " + "</div>"
                );

                $("#todaysForecast").append(day);

                renderUV(lat, lon, day)

                getFourDayForecast(city)


            });


    }

    function renderUV(lat, lon, day) {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon

        $.get(uvURL).then(function (res) {
            console.log(res)
            var UV = res.value

            if (UV >= 8) {
                day.append($("<P>").text("UV index: " + UV).addClass('badge badge-danger'))
            } else {
                day.append($("<P>").text("UV index: " + UV))
            }

        })

    }


    // This function takes the user's input and retrieves the data from the weather api as well as push the input into the array declared at the top of this page
    function rendercities() {
        $("#displayWeather").empty();
        $("#todaysForecast").empty();

        cityInput = $("#city-input").val().trim();

        getTodaysForcast(cityInput);

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
        event.stopPropagation();
        rendercities();
        storeCities();
    });


    function storeCities() {
        localStorage.setItem("cityArr", JSON.stringify(cityName));
    }

    // This function creates buttons to create a history of recently searched cities
    function cityHistory() {
        $("#displayWeather").empty()
        $("#searchHistory").empty();
        for (var i = 0; i < cityName.length; i++) {
            var city = cityName[i];
            var li = $("<li class='styleList'>");
            li.css("list-style-type", "none");
            li.text(city)
            li.addClass('past')
            li.attr("data-name", city)
            $("#searchHistory").append(li);

        }
    }
    // Checks to see if a button was clicked, if so, it takes the text of the button and displays the weather for that city
    $("#searchHistory").on("click", ".past", function () {
        
        getTodaysForcast($(this).attr("data-name"))
    });


    function getFourDayForecast(city) {
        $("#displayWeather").empty()
        $.get('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey)
            .then(function (res) {
                console.log(res)
                var inc = 0
                for (let i = 0; i < res.list.length; i++) {
                    var curr = res.list[i]

                    if (curr.dt_txt.includes("12:00")) {
                        console.log(curr)
                        inc++

                        var makeImg = $("<img class='wIcon onTop' src='http://openweathermap.org/img/w/" + curr.weather[0].icon + ".png' alt='Weather Icon'>");

                        var date = $("<h6>").attr("class", "card-title text-center mt-2").text((moment().add(inc, "days").format("M/D/YYYY")));

                        var tempC5 = curr.main.temp;
                        var tempF5 = (tempC5 - 273.15) * 1.80 + 32;

                        var wind = Math.round(curr.wind.speed);
                        var humidity = curr.main.humidity;
                        var div = $("<div>").attr("class", "card bg-info")

                        $(".card-deck").append(div)
                        div.append(date);
                        div.append(makeImg);
                        div.append(
                            tempF5.toFixed(2)
                            + "F " + '<br>'+
                            "Wind Speed: " + "<br>" + wind + "MPH " + "<br>" +
                            "Humidity: " + humidity + "% ");
                    }

                }
            })

    }
})