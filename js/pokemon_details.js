$(document).ready(function () {
	var name = getParameterByName('name');

	if (name) {
		$('#pokemon-name').text(name);
		var source = $('#details-template').html();
		var template = Handlebars.compile(source);

		$.ajax({
			url: 'http://pokeapi.co/api/v2/pokemon/' + name,
			success: function (response) {
				var data = {
					front: response.sprites.front_default,
					back: response.sprites.back_default,
					number: response.id
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
				computeDefenses(arrayTypes);

				var arrayAbilities = [];
				$.each(response.abilities, function (i, item) {
					arrayAbilities.unshift({
						name: item.ability.name,
						isHidden: item.is_hidden,
						url: item.ability.url
					});
				});
				data.abilities = arrayAbilities;
				fireRequests(arrayAbilities, 'ability');

				var arrayStats = [];
				$.each(response.stats, function (i, item) {
					arrayStats.unshift({
						name: item.stat.name,
						value: item.base_stat,
						//Assuming the base stats are in the range between 1 and 255
						width: item.base_stat / 2.55
					});
				});
				data.stats = arrayStats;

				var arrayMoves = [];
				$.each(response.moves, function (i, item) {
					arrayMoves.push({
						name: item.move.name,
						url: item.move.url
					});
				});
				data.moves = arrayMoves;
				fireRequests(arrayMoves, 'move');

				$('#main').append(template(data));
			}
		});
	} else {
		window.location.replace('index.html');
	}
});

function fireRequests (array, info) {
	if (info === 'ability' || info === 'move') {
		for (var i=0; i<array.length; i++) {
			$.ajax({
				url: array[i].url,
				success: function (response) {
					if (info === 'move') {
						var effect = response.effect_entries[0].short_effect;
						//Need to check if there's need to replace something else
						var chance = response.effect_chance;
						var reChance = /\$effect\_chance/g;
						effect = effect.replace(reChance, chance);

						var power = response.power !== null ? response.power : '-';
						var accuracy = response.accuracy !== null ? response.accuracy : '-';
						$('#accuracy-' + response.name).append(accuracy);
						$('#power-' + response.name).append(power);
					}else{
						var effect = response.effect_entries[0].effect;
					}
					$('#' + info + '-' + response.name).text(effect);
					$('#collapsible-' + info).collapsible();
				}
			});
		}
	}
}

function computeDefenses (arrayTypes) {
	var promises = [];
	for (var i=0; i<arrayTypes.length; i++) {
		promises.push(
			$.ajax({ url: arrayTypes[i].url })
		);
	}

	$.when.apply($, promises).then(function () {
		var map = new Map();

		for(var j=0; j<arrayTypes.length; j++){
			if(arrayTypes.length === 1){
				var response = arguments[0];
			}else{
				var response = arguments[j][0];
			}

			$.each(response.damage_relations.no_damage_from, function (i, item) {
				map.set(item.name, 0);
			});
			
			$.each(response.damage_relations.half_damage_from, function (i, item) {
				if(map.get(item.name) === undefined) {
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

		var arrayDefenses = [];
		for (var [key, value] of map) {
			if (value != 1) {
				arrayDefenses.push({
					type: key,
					color: getTypeColor(key),
					value: value
				});
			}
		}

		var source = $('#defenses-template').html();
		var template = Handlebars.compile(source);
		var data = { defenses: arrayDefenses };
		$('#div-defenses').append(template(data));
	}, function () {
		//Handle errors
	});
}
