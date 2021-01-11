$(document).ready(function () {
  // Prospective steps
  // 1. find the user's city
  // 2. grab covid stats of the state
  // 3. display chart
  // 4. list covid testing sites

  // covid data by country/state
  var provinceOrState = $("<div>");
  var totalConfirmedCases = $("<div>");
  var totalDeaths = $("<div>");
  var totalRecoveredCases = $("<div>");

  // click listener for the search bar
  $("#search-button").click(function () {
    var searchTerm = $("#search-term").val();
    var searchTermResults = searchTerm.split(" "); // clears out array as well. useful to keep in even if , isn't being used.
    console.log(searchTerm.split(" "))
    var cityLoc = "https://geocode.search.hereapi.com/v1/geocode?q=" + searchTermResults[0] + "+" + searchTermResults[1] + "+US&apiKey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484";

    $.ajax({
      url: cityLoc,
      method: "GET"
    }).then(function (cityLocation) {
      // calls the city lat lng and place it into the variables below
      console.log(cityLocation)
      var cityLat = cityLocation.items[0].position.lat
      var cityLng = cityLocation.items[0].position.lng
      // Url uses the variables above 
      testingSiteURL = "https://discover.search.hereapi.com/v1/discover?apikey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484&q=Covid&at=" + cityLat + "," + cityLng + "&limit=3"

      $.ajax({
        url: testingSiteURL,
        method: "GET"
      }).then(function (testingSites) {

        console.log(testingSites)

        /* 
        address[0] order:
        houseNumber street
        city stateCode postalCode
  
        for loop needed for all 3 items.length
        */
        for (i = 0; i < testingSites.items.length; i++) {
          var j = i + 1
          var newH1 = $("<h1>");
          var newArticle = $("<article>");
          var topDiv = $("<div>");

          //add content to div
          var testingSiteStreet = $("<div>").text(testingSites.items[i].address.houseNumber + " " + testingSites.items[i].address.street);
          var testingSiteCityStateZip = $("<div>").text(testingSites.items[i].address.city + ", " + testingSites.items[i].address.stateCode + " " + testingSites.items[i].address.postalCode);

          newH1.addClass("subtitle").text("Testing Location #" + j);
          newArticle.addClass("tile is-child notification is-warning");
          topDiv.addClass("tile is-parent is-4");

          newArticle.append(newH1, testingSiteStreet, testingSiteCityStateZip);
          topDiv.append(newArticle);

          $("#testingSites").append(topDiv);
        }



        covidStats = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=60cc0bce2emsh9ba3c88eb3c4d5dp125545jsnc79365a8f484";

        $.ajax({
          url: covidStats,
          method: "GET"
        }).then(function (covidInfo) {
          console.log(covidInfo)
          var covidInfoBox = $("#covid-info");

          var arrayLength = covidInfo.stats.breakdowns.length;
          console.log(searchTermResults[searchTermResults.length - 1])
          var stateName = searchTermResults[searchTermResults.length - 1].toUpperCase();
          console.log(stateName)
          var stateNameResults = "US-" + stateName.toUpperCase();

          for (i = 0; i < arrayLength - 1; i++) {
            var state = covidInfo.stats.breakdowns[i].location.isoCode
            // console.log(stateNameResults)
            // console.log(state)
            if (stateNameResults === state) {

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
                    backgroundColor: ['rgb(0, 0, 255, 0.6)', 'rgb(255, 255, 0, 0.9)', 'red'],
                    borderColor: 'rgb(0, 209, 178)',
                    data: [
                      covidInfo.stats.breakdowns[i].totalConfirmedCases,
                      covidInfo.stats.breakdowns[i].totalRecoveredCases,
                      covidInfo.stats.breakdowns[i].totalDeaths],

                  }],
                },
                // Configuration options go here
                options: {}
              });
              // Append information obtained above to covid info box
              covidInfoBox.append(provinceOrState, totalConfirmedCases, totalDeaths, totalRecoveredCases);
              searchTerm.val(" ");
            }
          }
        })
      })
    });
  });

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
