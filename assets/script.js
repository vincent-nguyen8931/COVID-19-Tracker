$(document).ready(function () {

  var newDiv = $("<div>")
  console.log(newDiv)
  var covidInfoBox = $("#covid-info").append(newDiv)

  // geolocte api 
  //  grab location
  // grab covid guidelines of the state
  // testing locations
  // choosing testing locatioin
  // be provided directions for testing location
  QueryURL = "https://discover.search.hereapi.com/v1/discover?apikey=cm9nka7Eq7NC7YfrsKwehxVumUyYYWiARjJBuXRa484&q=Covid&at=30.22,-92.02&limit=3"

  $.ajax({
    url: QueryURL,
    method: "GET"
  }).then(function (currentDay) {
    console.log(currentDay);
  });

  // on click
  // this.val(items[i])


  // QueryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/jsonp?origin=Lafayette&units=imperial&key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI"


  // places google
  // QueryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyDs01d715oubUTbz2ZrZSYWVH-k7N9n9xI"

  // covid data by country/state
  QueryURL2 = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=60cc0bce2emsh9ba3c88eb3c4d5dp125545jsnc79365a8f484"

  $.ajax({
    url: QueryURL2,
    method: "GET"
  }).then(function (currentDay) {

    console.log(currentDay);
  });
  let map;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 41.5, lng: -100 },
      zoom: 4
    });
  }

  initMap();


  var searchTerm = $("#search-term").val()

  $("#search-button").click(function () {
    Queryurl3 = "https://coronavirus-smartable.p.rapidapi.com/stats/v1/US/?rapidapi-key=60cc0bce2emsh9ba3c88eb3c4d5dp125545jsnc79365a8f484"
    console.log(Queryurl3);

    // var cityName;
    // var searchTerm = $("#search-term").val()
    // cityName = searchTerm
    $.ajax({
      url: Queryurl3,
      method: "GET"
    }).then(function (covidInfo) {
      console.log(covidInfo);


      // *needs fixing* //
      // button here
      var covidInfoBox = $("#covid-info")
      // $("#search-button").click(function () {

      // console.log("hello world");

      // var searchTerm = $("#search-term").val()
      // console.log(searchTerm)
      // for (i = 0; i < covidInfo.stats.breakdowns.length; i++);
      console.log(searchTerm);
      console.log(covidInfo.stats.breakdowns[0].location.provinceOrState);
      // if (searchTerm == covidInfo.stats.breakdowns[].location.provinceOrState);

      //   var provinceOrState = $("<div>").text(covidInfo.stats.breakdowns[i].location.provinceOrState);
      //   var totalConfirmedCases = $("<div>").text(covidInfo.stats.breakdowns[i].totalConfirmedCases);
      //   var totalDeaths = $("<div>").text(covidInfo.stats.breakdowns[i].totalDeaths);
      //   var totalRecoveredCases = $("<div>").text(covidInfo.stats.breakdowns[i].totalRecoveredCases);

      //   covidInfoBox.append(provinceOrState, totalConfirmedCases, totalDeaths, totalRecoveredCases);
    })





  });

  // // button here
  // var covidInfoBox = $("#covid-info")
  // $("#search-button").click(function (event) {
  //   console.log(event);
  //   // console.log("hello world");

  //   var searchTerm = $("#search-term").val()
  //   console.log(searchTerm)
  //   for (i = 0; i < stats.breakdowns.length; i++);
  //   if (searchTerm === stats.breakdowns[i].location.provinceOrState);

  //   var provinceOrState = $("<div>").text(stats.breakdowns[i].location.provinceOrState);
  //   var totalConfirmedCases = $("<div>").text(stats.breakdowns[i].totalConfirmedCases);
  //   var totalDeaths = $("<div>").text(stats.breakdowns[i].totalDeaths);
  //   var totalRecoveredCases = $("<div>").text(stats.breakdowns[i].totalRecoveredCases);

  //   covidInfoBox.append(provinceOrState, totalConfirmedCases, totalDeaths, totalRecoveredCases);
  // })

  // for (j = 0 j < length; i++)


})








