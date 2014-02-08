var globalParam = {
	sortType: { "short-name":"default", "long-name":"Default" }
};

function writeSidebar( data_loc ) {
	$.ajax({
		url: "php/yelpApiHelper.php",
		type: "GET",
		data: { coords: data_loc },
		cache: true,
		dataType: "json",
		success: function( data ) {
			console.log(data);
			var source   = $( "#results-template" ).html();
			var template = Handlebars.compile( source );
			var html     = template( data );
			$( "#results" ).html( html );
			sortElem();
		}
	});
}

function positionElements() {

	var windowWidth = $( window ).innerWidth();
	var windowHeight = $( window ).innerHeight();
	var navHeight = $( "nav" ).outerHeight();

	function positionPanelBox() {
		$( "#dialog" ).css({
							left: windowWidth - 400,
							height: windowHeight - navHeight,
							"margin-top": navHeight
						   });
	}

	function makeMapDraggable() {
		$( "#subwaymap" ).draggable({
			containment: [ windowWidth - 2600, windowHeight - 2808, 0, 0 ]
		});
	}	

	makeMapDraggable();
	positionPanelBox();

}

$(function() {
	positionElements();

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
		prepStationNavbar( station_name );	
		positionElements();
		$( "#dialog" ).removeClass( "hidden" );
		writeSidebar( location );
	});

	$( window ).resize(function() {
		positionElements();
	});

	$( ".sort-list" ).on( "click", function(){
		globalParam[ "sortType" ][ "short-name" ] = $( this ).attr( "data-sort-short-name" );
		globalParam[ "sortType" ][ "long-name" ] = $( this ).attr( "data-sort-long-name" );
		sortElem();
	})
})


function prepStationNavbar( station_name ) {
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
	});
};

function sortElem() {
	var sort_type = globalParam[ "sortType" ][ "short-name" ];
	$( "#sort-picker" ).text( "Sorted By: " + globalParam[ "sortType" ][ "long-name" ] );
	if (sort_type === "default") { return };
	var result = [ ];
	$( ".result-wrapper" ).each(function( i ){
		result[ i ] = {};
		result[ i ][ "rating" ]= $( this ).attr( "data-rating" );
		result[ i ][ "distance" ] = $( this ).attr( "data-distance" );
		result[ i ][ "review_count" ] = $( this ).attr( "data-review-count" );
		result[ i ][ "html" ] = $( this ).html();
	})
 
	result.sort(function( a, b ){
		return b[ sort_type ] - a[ sort_type ];
	})

	result.forEach(function( element, index ){
		$( ".result-wrapper:nth-child(" + ( index + 1 ) + ")" ).html(element[ "html" ])
															   .attr({
																 	"data-rating": element[ "rating" ],
																 	"data-distance": element[ "distance" ],
																 	"data-review-count": element[ "review_count" ]
																 });
	})				
}

var nav_header = '<div class="containers">\
			<h3 id="station" class="navbar-text">New Yelp City</h3>\
			<ul class="nav navbar-nav navbar-right">\
				<a href="#" id="info"><li class="info"><span class="glyphicon glyphicon-info-sign"></span></li></a>\
			</ul>\
		</div>';
