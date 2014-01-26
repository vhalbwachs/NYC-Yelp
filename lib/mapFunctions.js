function writeSidebar(data_loc) {
	$.ajax({
		url: 'php/yelpApiHelper.php',
		type: 'GET',
		data: {coords: data_loc},
		cache: true,
		dataType: 'json',
		jsonpCallback: 'cb',
		success: function(data) {
			console.log(data); //debugging purposes
			var source   = $('#results-template').html();
			var template = Handlebars.compile(source);
			var html     = template(data);
			$('#results').html(html);
		}
	});
}

var sidebar = '<div id="dialog" class="panel panel-default">
		<div class="panel-heading">
			<div class="panel-title"><h1 id="station_name"><!-- station name goes here --></h1></div>
		</div>
		<div id="results" class="panel-body">
		<!-- results go here -->
		</div>
		<div id="loader">
			Loading content from <br> <img src="http://s3-media3.ak.yelpcdn.com/assets/2/www/img/65526d1a519b/developers/Powered_By_Yelp_Red.png">
		</div>
	</div>';

$(function () {
	$('#subwaymap').draggable({
		containment: [$(window).width()-2600, $(window).height()-2808, 0, 0]
	});
	$(document).on({
		ajaxStart: function() { 
			$('#results').empty();
			$('#loader').removeClass('hidden'); 
		},
		ajaxStop: function() { 
			$('#loader').addClass('hidden'); 
		}    
	});
	$('#dialog').css('left', $(window).width()-400);
	$('area').click(function() {
		$('#dialog').removeClass('hidden');
		$('#station_name').html($(this).attr('alt'));
		writeSidebar($(this).attr('data-loc'));
	});
	$(window).resize(function() { //in case window gets resized, fix position of results panel and draggable containment params
		$('#dialog').css('left', $(window).width()-400);
		$('#subwaymap').draggable({
			containment: [$(window).width()-2600, $(window).height()-2808, 0, 0]
		});
	});
})