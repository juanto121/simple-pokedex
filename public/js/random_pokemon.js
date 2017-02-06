$(document).ready(function () {
	$('select').material_select();
	$('main span').addClass('black-text');
	
	$('#btn-go').on('click', function () {
		chooseRandom();
	});
});

function chooseRandom () {
	var name = $('#select-pokedex').val();
	if (name !== null) {
		$('#team').empty();
		$('#team').hide();
		$('.loading').show();
		$.ajax({
			url: 'https://pokeapi.co/api/v2/pokedex/' + name,
			success: function (response) {
				var max = response.pokemon_entries.length;
				var team = [];
				for (var i=0; i<6; i++) {
					var chosen = Math.floor(Math.random() * max);
					var pokemonName = response.pokemon_entries[chosen].pokemon_species.name;
					team.push(pokemonName);
				}
				loadDetails(team);
			}
		});
	}
}

function loadDetails(team) {
	var source = $('#team-template').html();
	var template = Handlebars.compile(source);

	var promises = [];
	for (var i=0; i<6; i++) {
		promises.push(
			$.ajax({ url: 'https://pokeapi.co/api/v2/pokemon/' + team[i] })
		);
	}

	$.when.apply($, promises).then(function () {
		var arrayDetails = [];
		for(var j=0; j<6; j++){
			arrayDetails.push({
				name: arguments[j][0].forms[0].name,
				image: arguments[j][0].sprites.front_default
			});
		}
		var data = { details: arrayDetails };
		$('.loading').hide();
		$('#team').append(template(data));
		$('#team').show();
	}, function () {
		//Handle errors
	});
}
