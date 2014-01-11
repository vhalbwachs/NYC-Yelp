$(function () {
	$( "#subwaymap" ).draggable({
		containment: [ window.innerWidth-2400, window.innerHeight-2865, 0, 0 ]
	});
	$('#dialog').css('left', window.innerWidth-400);
	$("area").click(function() {
		$("#dialog").removeClass("hidden",1000, "easeInBack");
		$("#station_name").text($(this).attr('alt'));
		writeSidebar($(this).attr('data-loc'));
	});
})

function writeSidebar(data_loc) {
	$.ajax({
		url: 'php/yelpApiHelper.php',
		type: 'GET',
		data: {coords: data_loc},
		cache: true,
		dataType: 'json',
		jsonpCallback: 'cb',
		success: function(data) {
			console.log(data);
			var source   = $("#results-template").html();
			var template = Handlebars.compile(source);
			var html     = template(data);
			$("#results").html(html);

		}
	});
}
