#!/usr/bin/env /Users/camwyn/.nvm/versions/node/v9.11.2/bin/node
/* jshint esversion: 6, loopfunc: true */

/*
<bitbar.title>Tribe Central</bitbar.title>
<bitbar.version>v1.0.0</bitbar.version>
<bitbar.author>Matthew Batchelder</bitbar.author>
<bitbar.author.github>borkweb</bitbar.author.github>
<bitbar.desc>Based on the Tribe Central script built by Gustavo Bordoni (bordoni)</bitbar.desc>
<bitbar.image></bitbar.image>
<bitbar.dependencies>node, npm, npm/fs, npm/home-config, npm/googleapis, npm/google-auth-library, npm/http, npm/moment, npm/open</bitbar.dependencies>
<bitbar.abouturl></bitbar.abouturl>
*/
var ver = '1.0.0';

if ( process.env.BitBar ) {
	var icon = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9WiTo4AAAABnRSTlMAT72/wcNFk5JmAAAAAWJLR0QHFmGI6wAAAD9JREFUCNdjYMAOzNIgQIGBAcpKSwAyIZJsICYbBKIxkRQgaUNiioEVwRVAmWIQU2CiUCaaWogJYVCmAwMhAADe4SPxRecIYgAAAABJRU5ErkJggg==';

	console.log(`| dropdown=false templateImage=${icon}`);
	console.log('---');
}

const fs = require( 'fs' );

var stat;
var sections = {};

try {
	sections = require( './tribe-central/sections.json' );
} catch( err ) {
	sections = require( './tribe-central/sections.sample.json' );
}

if ( ! process.env.BitBar ) {
	return;
}


var section = null;
var prefix = null;

for ( var key in sections ) {
	if ( ! sections.hasOwnProperty( key ) ) {
		continue;
	}

	section = sections[ key ];

	if (
		null !== section
		&& 'object' !== typeof section
	) {
		try {
			section = require( './tribe-central/' + section );
		} catch( err ) {
			section = {};
		}
	}

	if ( 'undefined' === typeof section.name ) {
		continue;
	}

	prefix = section.nested ? '--' : '';

	function eachRecursive( child, nest ) {
		if ( 'undefined' === typeof nest ) {
			nest = 0;
		}

		var sep = '--';
		sep = prefix + sep.repeat(nest);

		if ( 'undefined' !== typeof child.nested || 'undefined' !== typeof child.items ) {
			console.log( sep + '---' );
			console.log( sep + child.name );
			child.items.forEach( function( grandchild ) {
				eachRecursive( grandchild , nest + 1 );
			} );
		} else {
			if ( 'undefined' !== typeof child.url ) {
				console.log( sep + child.name + ' | href=' + child.url );
			} else if ( 'undefined' !== typeof child.id ) {
				console.log( sep + child.name + ' | href=https://central.tri.be/issues/' + child.id );
				console.log( sep + child.name + ' ⬅ | alternate=true href=https://central.tri.be/issues/' + child.id + '/time_entries/new' );
			} else {
				console.log( sep + child.name );
			}
		}
	}

	console.log( '---' );
	console.log( section.name );

	section.items.forEach( function( child ) {
		eachRecursive( child );
	} );

}

console.log('---');
console.log('Refresh | refresh=true terminal=false');

