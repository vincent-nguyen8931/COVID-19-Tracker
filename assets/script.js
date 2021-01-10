// Only loads map on the index.html page. Used to keep hamburger menu working on about and doc html page.
var counter = 0;
if (counter === 0) {


  let map;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 41.5, lng: -100 },
      zoom: 4
    });
  }
  initMap();
}
$(document).ready(function () {
  if (window.location.pathname == "/index.html") {
    let map;

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.5, lng: -100 },
        zoom: 4
      });
    }
    initMap();

  }
});

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


  // // QueryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/jsonp?origin=Lafayette&units=imperial&key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI"

  // var searchTerm = $("#search-term").val();
  //   // places google. api key invalid error. 
  // QueryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + searchTerm + "&inputtype=textquery&key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI" ;

  // test text for google place
  // https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Walmart&inputtype=textquery&key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI%22

  // autocomplete places. needs more testing
  // var searchTerm = $("#search-term").val();
  // QueryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?" + searchTerm + "key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI"



  // $.ajax({
  //   url: QueryURL2,
  //   method: "GET"
  // }).then(function (currentDay) {

  //   console.log(currentDay);
  // });

  // var clickCount =0 ;

  // covid data by country/state
  var provinceOrState = $("<div>")
  var totalConfirmedCases = $("<div>")
  var totalDeaths = $("<div>")
  var totalRecoveredCases = $("<div>")

  $("#search-button").click(function () {
    covidStats = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=60cc0bce2emsh9ba3c88eb3c4d5dp125545jsnc79365a8f484";

    $.ajax({
      url: covidStats,
      method: "GET"
    }).then(function (covidInfo) {
      // console.log(covidInfo)
      var covidInfoBox = $("#covid-info");
      var searchTerm = $("#search-term").val();
      var arrayLength = covidInfo.stats.breakdowns.length;

      // solve the double click issue with this click
      // clickCount++
      // console.log(clickCount)
      for (i = 0; i < arrayLength - 1; i++) {
        var state = covidInfo.stats.breakdowns[i].location.provinceOrState
        if (searchTerm === state) {

          provinceOrState.text("State: " + covidInfo.stats.breakdowns[i].location.provinceOrState);
          totalConfirmedCases.text("Confirmed cases: " + covidInfo.stats.breakdowns[i].totalConfirmedCases);
          totalDeaths.text("Total deaths: " + covidInfo.stats.breakdowns[i].totalDeaths);
          totalRecoveredCases.text("Total recovered cases: " + covidInfo.stats.breakdowns[i].totalRecoveredCases);

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

  // var ctx = document.getElementById('#covid-info').getContext('2d');
  // var myPieChart = new Chart(ctx, {
  //   type: 'pie',
  //   // The data for our dataset
  //   data: {
  //     labels: ['State', 'Total Confirmed Cases', 'Total Deaths', 'Total Recovered Cases'],
  //     datasets: [{
  //       label: "proevinceOrState",
  //       backgroundColor: 'rgb(255, 99, 132)',
  //       borderColor: 'rgb(255, 99, 132)',
  //       data: []
  //     }]
  //   },

  //   // Configuration options go here
  //   options: {}
  // });


















}) // document ready closing brackets
