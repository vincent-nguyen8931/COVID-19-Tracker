$(document).ready(function () {

  // covid data by country/state
  var provinceOrState = $("<div>");
  var totalConfirmedCases = $("<div>");
  var totalDeaths = $("<div>");
  var totalRecoveredCases = $("<div>");

  // Closes the error modal
  $("#closeModal").click(function () {
    $("#errorModal").removeClass("is-active")
  })

  // click listener for the search bar
  $("#search-button").click(function (e) {
      e.preventDefault();

    // reads in the value of the search term
    var searchTerm = $("#search-term").val().trim();

    // error check to ensure text is only letters and spaces
    if (!/^[a-zA-z][A-z\s]*$/i.test(searchTerm)) { 
      $("#errorModal").addClass("is-active");
      $("#search-term").val(""); 
      return; 
    }
    // clears out array each split to accept new input
    var searchTermResults = searchTerm.split(" ");

    var cityLoc = "https://geocode.search.hereapi.com/v1/geocode?q=" + searchTermResults[0] + "+" + searchTermResults[1] + "+US&apiKey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484";

    $.ajax({
      url: cityLoc,
      method: "GET"
    }).then(function (cityLocation) {

      // calls the city lat lng and place it into the variables below
      var cityLat = cityLocation.items[0].position.lat
      var cityLng = cityLocation.items[0].position.lng

      // Url uses the variables above 
      testingSiteURL = "https://discover.search.hereapi.com/v1/discover?apikey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484&q=Covid&at=" + cityLat + "," + cityLng + "&limit=3"

      //use the ajax call method to retrieve the testing sites for covid
      $.ajax({
        url: testingSiteURL,
        method: "GET"
      }).then(function (testingSites) {
        $("#testingSites").empty();

        //create the testing location tiles
        for (i = 0; i < testingSites.items.length; i++) {

          //create new html elements to give one tile per testing location
          var newH1 = $("<h1>");
          var newArticle = $("<article>");
          var topDiv = $("<div>");

          //add name of testing site and address to tiles along the bottom of the page
          var testingSiteStreet = $("<div>").text(testingSites.items[i].address.houseNumber + " " + testingSites.items[i].address.street);
          var testingSiteCityStateZip = $("<div>").text(testingSites.items[i].address.city + ", " + testingSites.items[i].address.stateCode + " " + testingSites.items[i].address.postalCode);

          //add classes to the new html elements given the bulma css styling
          newH1.addClass("subtitle").text(testingSites.items[i].title);
          newArticle.addClass("tile is-child notification is-warning");
          topDiv.addClass("tile is-parent is-4");

          // append testing location and address to tiles at the bottom of the page
          newArticle.append(newH1, testingSiteStreet, testingSiteCityStateZip);
          topDiv.append(newArticle);

          // append new html elements to tiles along the bottom
          $("#testingSites").append(topDiv);
        }

        covidStats = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=8e3b8b5f5amsh15e98c7a0edaf6bp1f8a5bjsn9ed5ca6c622e";

        // use the ajax call method to get the covid statistics
        $.ajax({
          url: covidStats,
          method: "GET"
        }).then(function (covidInfo) {
          var covidInfoBox = $("#covid-info");

          // variables to add in state information then uppcase it
          var arrayLength = covidInfo.stats.breakdowns.length;
          var stateName = searchTermResults[searchTermResults.length - 1].toUpperCase();
          var stateNameResults = "US-" + stateName.toUpperCase();

          for (i = 0; i < arrayLength - 1; i++) {
            var state = covidInfo.stats.breakdowns[i].location.isoCode

            if (stateNameResults === state) {

              // pull desired covid info from ajax call and apply to variables
              provinceOrState.text("State: " + covidInfo.stats.breakdowns[i].location.provinceOrState);
              totalConfirmedCases.text("Confirmed cases: " + covidInfo.stats.breakdowns[i].totalConfirmedCases);
              totalDeaths.text("Total deaths: " + covidInfo.stats.breakdowns[i].totalDeaths);
              totalRecoveredCases.text("Total recovered cases: " + covidInfo.stats.breakdowns[i].totalRecoveredCases);

              provinceOrState.addClass("is-size-3");
              totalConfirmedCases.addClass("is-size-3");
              totalDeaths.addClass("is-size-3");
              totalRecoveredCases.addClass("is-size-3");

              //chart goes here// 
              var ctx = document.getElementById('myChart').getContext('2d');
              var chart = new Chart(ctx, {
                // type of chart to create
                type: 'pie',

                // create a chart from the information retrieved from the variables above and places them into a pie chart.
                data: {
                  // insert and compare three statistics of covid 
                  labels: ['Total Confirmed Cases', 'Total Recovered Cases', 'Total Deaths'],
                  datasets: [{
                    label: 'My First dataset',
                    // change the colors of the pie chart
                    backgroundColor: ['rgb(0, 0, 255, 0.6)', 'rgb(255, 255, 0, 0.9)', 'red'],
                    borderColor: 'rgb(0, 209, 178)',
                    // pull the data from the covid statistic api and matches it with the specific labels.
                    data: [
                      // confirmed cases data
                      covidInfo.stats.breakdowns[i].totalConfirmedCases,
                      // total recovered cases data
                      covidInfo.stats.breakdowns[i].totalRecoveredCases,
                      // total deaths data 
                      covidInfo.stats.breakdowns[i].totalDeaths],
                  }],
                },
                // Configuration options for chart
                options: {}
              });
              // Append information obtained above to Covid Info box
              covidInfoBox.append(provinceOrState, totalConfirmedCases, totalDeaths, totalRecoveredCases);
              $("#search-term").val("");
            }
          }
        })
      })
    });
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
