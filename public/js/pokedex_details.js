$(document).ready(function () {
	var name = getParameterByName('name');

	if (name) {
		$('#pokedex-name').text(name + ' Pokédex');
		var source = $('#table-template').html();
		var template = Handlebars.compile(source);

		$.ajax({
			url: 'https://pokeapi.co/api/v2/pokedex/' + name,
			success: function (response) {
				var arrayPokemon = new Array();
				$.each(response.pokemon_entries, function (i, item) {
					var number = item.entry_number;
					var pokemonName = item.pokemon_species.name;
					arrayPokemon.push({ id: number, name: pokemonName });
				});
				var data = { pokemons: arrayPokemon };
				$('.loading').hide();
				$('#main').append(template(data));
			}
		});
	} else {
		window.location.replace('index.html');
	}
	
	$('#search').keyup(function () {
		var query = this.value.toLowerCase();
		var rows = $('#pokemon').find('tr');
		if (query) {
			rows.hide();
			rows.filter(function (i, v) {
				if ($(this).is(':contains("' + query + '")')) {
					return true;
				} else {
					return false;
				}
			}).show();
		} else {
			rows.show();
		}
	});
});
