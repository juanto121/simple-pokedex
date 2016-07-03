$(document).ready(function () {
	$.ajax({
		url: 'http://pokeapi.co/api/v2/pokedex/national',
		success: function (response) {
			var pokemonArray = [];
			$.each(response.pokemon_entries, function (i, item) {
				var pokemonName = item.pokemon_species.name;
				pokemonArray.push({ name: pokemonName });
			});
			var source = $('#select-template').html();
			var template = Handlebars.compile(source);
			$('select').append(template({ pokemons: pokemonArray }));
			$('select').chosen({ width: "100%" });
			$('.loading').hide();
			$('.row').show();
		}
	});
});

$('#btn-go').click(function () {
	var poke1 = $('#select1').val();
	var poke2 = $('#select2').val();
	if (poke1 && poke2) {
		$('#div-details > div').empty();
		$('.loading').show();
		loadPokemon(poke1, 1);
		loadPokemon(poke2, 2);
	}
});

function loadPokemon (name, index) {
	var source = $('#details-template').html();
	var template = Handlebars.compile(source);

	$.ajax({
		url: 'http://pokeapi.co/api/v2/pokemon/' + name,
		success: function (response) {
			var data = {
				name: name,
				index: index,
				front: response.sprites.front_default,
				back: response.sprites.back_default
			};

			var arrayTypes = [];
			$.each(response.types, function (i, item) {
				//The API gives the types in reverse order, so they must be inserted with 'unshift'
				arrayTypes.unshift({
					name: item.type.name,
					color: getTypeColor(item.type.name),
					url: item.type.url
				});
			});
			data.types = arrayTypes;
			computeDefenses(index, arrayTypes);

			var array_stats = [];
			$.each(response.stats, function (i, item) {
				array_stats.unshift({
					name: item.stat.name,
					value: item.base_stat,
					//Assuming the base stats are in the range between 1 and 255
					width: item.base_stat / 2.55
				});
			});
			data.stats = array_stats;

			$('#details' + index).append(template(data));
			$('.loading').hide();
		}
	});
}

function computeDefenses (index, arrayTypes) {
	var promises = [];
	for (var i=0; i<arrayTypes.length; i++) {
		promises.push(
			$.ajax({ url: arrayTypes[i].url })
		);
	}

	$.when.apply($, promises).then(function () {
		var map = new Map();

		for (var j=0; j<arrayTypes.length; j++) {
			if (arrayTypes.length === 1) {
				var response = arguments[0];
			} else {
				var response = arguments[j][0];
			}

			$.each(response.damage_relations.no_damage_from, function (i, item) {
				map.set(item.name, 0);
			});
			
			$.each(response.damage_relations.half_damage_from, function (i, item) {
				if (map.get(item.name) === undefined) {
					map.set(item.name, 0.5);
				} else {
					var x = map.get(item.name);
					map.set(item.name, x*0.5);
				}
			});
			
			$.each(response.damage_relations.double_damage_from, function (i, item) {
				if(map.get(item.name) === undefined) {
					map.set(item.name, 2);
				} else {
					var x = map.get(item.name);
					map.set(item.name, x*2);
				}
			});
		}

		var arrayDefenses = new Array();
		for (var [key, value] of map) {
			if (value !== 1) {
				arrayDefenses.push({
					type: key,
					color: getTypeColor(key),
					value: value
				});
			}
		}

		var source = $('#defenses-template').html();
		var template = Handlebars.compile(source);
		$('#div-defenses-' + index).append(template({ defenses: arrayDefenses }));
	}, function () {
		//Handle errors
	});
}
