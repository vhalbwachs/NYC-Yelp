(function () {

  var app = {};

  app.globalParam = {
  sortType: { "short-name":"default", "long-name":"Default" }
  };
  
  app.writeSidebar = function ( data_loc ) {
    $( "#sort-picker" ).text( "Sorted By: " + app.globalParam[ "sortType" ][ "long-name" ] );
    $.ajax({
      url: "php/yelpApiHelper.php",
      type: "GET",
      data: { coords: data_loc },
      cache: true,
      dataType: "json",
      success: function( data ) {
        var source   = $( "#results-template" ).html();
        var template = Handlebars.compile( source );
        var html     = template( data );
        $( "#results" ).html( html );
        app.sortElem();
      }
    });
  }

  app.positionElements = function () {

    var windowWidth = $( window ).innerWidth();
    var windowHeight = $( window ).innerHeight();
    var navHeight = $( "nav" ).outerHeight();

    $( "#dialog" ).css({
      left: windowWidth - 400,
      height: windowHeight - navHeight,
      "margin-top": navHeight
    });

    $( "#subwaymap" ).css({
      "margin-top": navHeight
    });

    $( "#subwaymap" ).draggable({
      containment: [ windowWidth - 2600, windowHeight - 2808 - navHeight, 0, 0 ]
    }); 
  };

  app.sortElem = function () {
    //get the value of what we want to sort by
    var sort_type = app.globalParam[ "sortType" ][ "short-name" ];
    //set text to display what it's being sorted by
    $( "#sort-picker" ).text( "Sorted By: " + app.globalParam[ "sortType" ][ "long-name" ] );
    if (sort_type === "default") { return };
    //start a new array of results so we can sort them in memory
    var result = [ ];
    //push all attributes and html of each result into the array
    $( ".result-wrapper" ).each(function( i ){
      result[ i ] = {};
      result[ i ][ "rating" ]= $( this ).attr( "data-rating" );
      result[ i ][ "distance" ] = $( this ).attr( "data-distance" );
      result[ i ][ "review_count" ] = $( this ).attr( "data-review-count" );
      result[ i ][ "html" ] = $( this ).html();
    });
    //sort array based on whatever the sort type is
    result.sort(function( a, b ){
      return b[ sort_type ] - a[ sort_type ];
    });
    //now that results are in order, rewrite each result wrapper with the html and update attributes so we can still sort
    result.forEach(function( element, index ){
      $( ".result-wrapper:nth-child(" + ( index + 1 ) + ")" ).html(element[ "html" ])
                                                             .attr({
                                                              "data-rating": element[ "rating" ],
                                                              "data-distance": element[ "distance" ],
                                                              "data-review-count": element[ "review_count" ]
                                                             });
    });        
  };

  app.prepStationNavbar = function( station_name ) {
    var nav_header = '<div class="containers">\
          <h3 id="station" class="navbar-text">New Yelp City</h3>\
          <ul class="nav navbar-nav navbar-right">\
            <a href="#" id="info"><li class="info"><span class="glyphicon glyphicon-info-sign"></span></li></a>\
          </ul>\
        </div>';

    var station_header = '<div class="containers">\
          <h3 id="station" class="navbar-text">Pelham Bay Parkway <br> Test</h3>\
          <ul class="nav navbar-nav navbar-right" id="exit">\
            <li class="red"><a href="#">Exit</a></li>\
          </ul>\
        </div>';
    $( "nav" ).html( station_header );
    $( "#station" ).html( station_name );
    $( "#exit" ).on( "click", function(){
        $( "#dialog" ).addClass( "hidden" );
        $( "nav" ).html( nav_header );
        $( "#info" ).on( "click", function(){
          $( "#about-modal" ).modal();
        });
        app.positionElements();
    });
  };

  // when document is ready:

  $(function() {
    app.positionElements();

    $( "#info" ).on( "click", function(){
      $( "#about-modal" ).modal();
    });

    $( document ).on({
      ajaxStart: function() { 
        $( "#results" ).empty();
        $( "#loader" ).removeClass( "hidden" ); 
      },
      ajaxStop: function() { 
        $( "#loader" ).addClass( "hidden" ); 
      }    
    });

    $( "map" ).on( "click", "area", function() {
      var location = $( this ).attr( "data-loc" );
      var station_name = $( this ).attr( "alt" );
      app.prepStationNavbar( station_name );  
      app.positionElements();
      $( "#dialog" ).removeClass( "hidden" );
      app.writeSidebar( location );
    });

    $( window ).resize(function() {
      app.positionElements();
    });

    $( ".sort-list" ).on( "click", function(){
      app.globalParam[ "sortType" ][ "short-name" ] = $( this ).attr( "data-sort-short-name" );
      app.globalParam[ "sortType" ][ "long-name" ] = $( this ).attr( "data-sort-long-name" );
      app.sortElem();
    });
  }); 
  return app;

})();




