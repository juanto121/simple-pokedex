$(document).ready(function () {
	$('.button-collapse').sideNav();

	var currentTime = new Date();
	var year = currentTime.getFullYear().toString();

	if (year === '2016') {
		$('.footer-copyright > .container').append('<span>2016</span>');
	} else {
		$('.footer-copyright > .container').append('<span>2016 - ' + year + '</span>');
	}
});

function getParameterByName(name) {
	var url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);
	if (!results) {
		return null;
	}
	if (!results[2]) {
		return '';
	}
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getTypeColor (type) {
	if (type === 'normal') {
		//Not sure what color to put here
		return 'brown lighten-4';
	} else if (type === 'fighting') {
		return 'deep-orange accent-4';
	} else if (type === 'flying') {
		return 'deep-purple lighten-3';
	} else if (type === 'poison') {
		return 'purple darken-3';
	} else if (type === 'ground') {
		return 'lime darken-4';
	} else if (type === 'rock') {
		return 'yellow darken-2';
	} else if (type === 'bug') {
		return 'lime darken-1';
	} else if (type === 'ghost') {
		return 'deep-purple darken-3';
	} else if (type === 'steel') {
		return 'grey lighten-1';
	} else if (type === 'fire') {
		return 'orange darken-2';
	} else if (type === 'water') {
		return 'light-blue';
	} else if (type === 'grass') {
		return 'light-green lighten-1';
	} else if (type === 'electric') {
		return 'yellow darken-1';
	} else if (type === 'psychic') {
		return 'pink lighten-2';
	} else if (type === 'ice') {
		return 'cyan lighten-4';
	} else if (type === 'dragon') {
		return 'deep-purple accent-3';
	} else if (type === 'dark') {
		return 'brown darken-4';
	} else if (type === 'fairy') {
		return 'pink lighten-4';
	} else if (type === 'unknown' || type === 'shadow') {
		return 'grey darken-3';
	}
}
