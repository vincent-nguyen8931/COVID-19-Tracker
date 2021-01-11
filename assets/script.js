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
  var isValid = true;

  jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-zA-z][A-z\s]*$/i.test(value);
  }, "Enter city and state");

  $("form[name='validation']").validate({
    rules: {
      searchTermHTML: {
        required: true,
        lettersonly: true
      }
    },
  })

  // click listener for the search bar
    $("#search-button").click(function () {
      $("form[name='validation']").submit(function(e) {
        e.preventDefault();
      })
      var searchTerm = $("#search-term").val().trim();
      console.log(searchTerm)
      var searchTermResults = searchTerm.split(" "); // clears out array as well. useful to keep in even if  isn't being used.



      if (isValid === true) {
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
          // we are using the ajax call method to retrieve the testing sites for covid here//
          $.ajax({
            url: testingSiteURL,
            method: "GET"
          }).then(function (testingSites) {
            $("#testingSites").empty();
            console.log(testingSites)

            /* 
            address[0] order:
            houseNumber street
            city stateCode postalCode
      
            for loop needed for all 3 items.length
            */
            //if search term is valid, then proceed to creating the content//
            if (isValid === true) {
              //this creates the testing location tiles// 
              for (i = 0; i < testingSites.items.length; i++) {

                //We are creating new html elements here//
                var newH1 = $("<h1>");
                var newArticle = $("<article>");
                var topDiv = $("<div>");

                //add content to div
                var testingSiteStreet = $("<div>").text(testingSites.items[i].address.houseNumber + " " + testingSites.items[i].address.street);
                var testingSiteCityStateZip = $("<div>").text(testingSites.items[i].address.city + ", " + testingSites.items[i].address.stateCode + " " + testingSites.items[i].address.postalCode);
                // we are adding classes to the new html elements given the bulma css styling//
                newH1.addClass("subtitle").text(testingSites.items[i].title);
                newArticle.addClass("tile is-child notification is-warning");
                topDiv.addClass("tile is-parent is-4");
                // constructing the new html elements //
                newArticle.append(newH1, testingSiteStreet, testingSiteCityStateZip);
                topDiv.append(newArticle);
                // Appending new html elements to page//
                $("#testingSites").append(topDiv);
              }
            }

            covidStats = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=8e3b8b5f5amsh15e98c7a0edaf6bp1f8a5bjsn9ed5ca6c622e";
            // we are using the ajax call method to get the covid statistics//
            $.ajax({
              url: covidStats,
              method: "GET"
            }).then(function (covidInfo) {
              console.log(covidInfo)
              var covidInfoBox = $("#covid-info");
              // we are specifically getting the covid info that we want and declaring it a variable//
              var arrayLength = covidInfo.stats.breakdowns.length;
              console.log(searchTermResults[searchTermResults.length - 1])
              var stateName = searchTermResults[searchTermResults.length - 1].toUpperCase();
              console.log(stateName)
              var stateNameResults = "US-" + stateName.toUpperCase();

              for (i = 0; i < arrayLength - 1; i++) {
                var state = covidInfo.stats.breakdowns[i].location.isoCode

                if (stateNameResults === state) {

                  // This pulls the information from the ajax call above and creates a text to display//
                  provinceOrState.text("State: " + covidInfo.stats.breakdowns[i].location.provinceOrState);
                  totalConfirmedCases.text("Confirmed cases: " + covidInfo.stats.breakdowns[i].totalConfirmedCases);
                  totalDeaths.text("Total deaths: " + covidInfo.stats.breakdowns[i].totalDeaths);
                  totalRecoveredCases.text("Total recovered cases: " + covidInfo.stats.breakdowns[i].totalRecoveredCases);



                  var ctx = document.getElementById('myChart').getContext('2d');
                  var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'pie',

                    // This creates a chart from the information retrieved from the variables above and places them into a pie chart.
                    data: {
                      // this allows us to insert and compare three statistics of covid//  
                      labels: ['Total Confirmed Cases', 'Total Recovered Cases', 'Total Deaths'],
                      datasets: [{
                        label: 'My First dataset',
                        // This changes the colors of the pie chart //
                        backgroundColor: ['rgb(0, 0, 255, 0.6)', 'rgb(255, 255, 0, 0.9)', 'red'],
                        borderColor: 'rgb(0, 209, 178)',
                        // this pulls the data from the covid statistic api and matches it with the specific labels.
                        data: [
                          // confirmed cases data //
                          covidInfo.stats.breakdowns[i].totalConfirmedCases,
                          // total recovered cases data//
                          covidInfo.stats.breakdowns[i].totalRecoveredCases,
                          // total deaths data //
                          covidInfo.stats.breakdowns[i].totalDeaths],

                      }],
                    },
                    // Configuration options go here
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
      };
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
