$(document).ready(function () {
  // Prospective steps
  // 1. find the user's city
  // 2. Display the testing sites on the map (no progress on this yet)
  // 3. grab covid states of the state
  // 4. choosing testing locatioin
  // 5. be provided directions for testing location
  QueryURL = "https://discover.search.hereapi.com/v1/discover?apikey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484&q=Covid&at=30.22,-92.02&limit=3"

  $.ajax({
    url: QueryURL,
    method: "GET"
  }).then(function (currentDay) {
    console.log(currentDay);
  });

  // covid data by country/state
  var provinceOrState = $("<div>");
  var totalConfirmedCases = $("<div>");
  var totalDeaths = $("<div>");
  var totalRecoveredCases = $("<div>");

  // click listener for the search bar
  $("#search-button").click(function () {
    var searchTerm = $("#search-term").val();
    searchTermResults = searchTerm.split(",");
    console.log(searchTermResults)
    covidStats = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=60cc0bce2emsh9ba3c88eb3c4d5dp125545jsnc79365a8f484";

    var querurl = "https://geocode.search.hereapi.com/v1/geocode?q=" + searchTermResults[0] + "+" + searchTermResults[1] + "+US&apiKey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484";

    $.ajax({
      url: querurl,
      method: "GET"
    }).then(function (currentDay) {
      console.log(currentDay);
    });

    $.ajax({
      url: covidStats,
      method: "GET"
    }).then(function (covidInfo) {

      var covidInfoBox = $("#covid-info");
      var searchTerm = $("#search-term").val();
      console.log(searchTerm)
      var arrayLength = covidInfo.stats.breakdowns.length;

      for (i = 0; i < arrayLength - 1; i++) {
        var state = covidInfo.stats.breakdowns[i].location.provinceOrState
        if (searchTerm === state) {

          provinceOrState.text("State: " + covidInfo.stats.breakdowns[i].location.provinceOrState);
          totalConfirmedCases.text("Confirmed cases: " + covidInfo.stats.breakdowns[i].totalConfirmedCases);
          totalDeaths.text("Total deaths: " + covidInfo.stats.breakdowns[i].totalDeaths);
          totalRecoveredCases.text("Total recovered cases: " + covidInfo.stats.breakdowns[i].totalRecoveredCases);

          var ctx = document.getElementById('myChart').getContext('2d');
          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // This creates a chart from the information retrieved from the variables above and placed them into a pie chart.
            data: {
              labels: ['Total Confirmed Cases', 'Total Recovered Cases', 'Total Deaths'],
              datasets: [{
                label: 'My First dataset',
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(230,80,130)', 'rgb(200,50,120)'],
                borderColor: 'rgb(255, 99, 132)',
                data: [covidInfo.stats.breakdowns[i].totalConfirmedCases,
                covidInfo.stats.breakdowns[i].totalRecoveredCases,
                covidInfo.stats.breakdowns[i].totalDeaths],

              }],
            },
            // Configuration options go here
            options: {}
          });
          // Append information obtained above to covid info box
          covidInfoBox.append(provinceOrState, totalConfirmedCases, totalDeaths, totalRecoveredCases);
        }
      }
    })
  })

  // hamburger menu toggle variables
  var navbarToggle = $("#nav-toggle");
  var navMenu = $("#navbarBasicExample");
  var toggle = 0;
  // hamburger menu toggle
  $("#nav-toggle").click(function () {
    if (toggle === 0) {
      navbarToggle.attr("class", "navbar-burger nav-toggle is-active");
      navMenu.attr("class", "navbar-menu is-active");
      toggle++;
    }
    else {
      navbarToggle.attr("class", "navbar-burger nav-toggle");
      navMenu.attr("class", "navbar-menu");
      toggle--;
    }
  })
}) // document ready closing brackets
