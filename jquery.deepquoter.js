/*
*	DeepQuoter JQuery plugin, v.0.1
* 	@Author Iñaki Iglesias Cancio
*
*	Lacks proper documentation -I'm on it.
* 	DeepQuoter runs on IE9+, Firefox and Chrome;
*	It runs on jQuery 1.9.1+ (proved). Previous versions may pose  unexpectedproblems.
*	
*/

(function($){
	
	$.deepquoter = function(options){
		var defaults = {
			'mode' : 'coelho',
			'url' : 'quotes.coelho.json',
			'maxIterations' : 4
		};

		var plugin = this;
		plugin.settings = {};

		var init = function()
		{
			plugin.quotesDoc = {};

			plugin.subject = false;
			plugin.verb = false;
			plugin.directComplement = false;
			plugin.indirectComplement = false;
			plugin.settings = $.extend({}, defaults, options);
			
			$.ajax({
				url: plugin.settings.url,
				async: false,
				dataType: 'json',
				success: function(data)
				{
					plugin.quotesDoc = data;

					if (plugin.settings.mode !== false)
						plugin.quotesDoc = plugin.quotesDoc[plugin.settings.mode];
				}
			});
			return plugin.generateQuote(true);
			
			// return plugin.quote;
		};

		plugin.generateQuote = function(recursive)
		{
			var quote = '';
			quote = basicQuote(quote);
			var i = 0;
			while(i < plugin.settings.maxIterations)
			{

				var random = Math.floor((Math.random()*10))%5;
				if (random == 0) quote = addDirectComplement(quote);
				else if(random == 1) quote = addIndirectComplement(quote);
				else if (random == 2) quote = addCircumstancialComplement(quote);
				else if (random == 3 && recursive) 
				{
					plugin.subject = false;
					plugin.verb = false;
					plugin.directComplement = false;
					plugin.indirectComplement = false;
					quote = plugin.generateQuote(false) + ' ' + capitaliseFirst(quote.trim());
					break;
				}
				i++;
			}
			// console.log(quote);
			return capitaliseFirst(quote.trim()) + '.';
		};

		var basicQuote = function(quote)
		{
			if (Boolean(Math.floor(Math.random())))
			{
				quote = addSubject(quote);
				quote = addVerb(quote);
			}
			else 
			{
				quote = addVerb(quote);
				quote = addSubject(quote);
			}

			return quote;
		}

		var addSubject = function(quote)
		{
			if (plugin.subject) return quote;

			var subject = getRandomElement(plugin.quotesDoc.subjects);
			if (quote.length > 0) quote = quote + ' ' + subject;
			else quote = subject;

			plugin.subject = true;
			return quote;
		}

		var addVerb = function(quote)
		{
			if (plugin.verb) return quote;
			
			var verb = getRandomElement(plugin.quotesDoc.verbs);
			if (quote.length > 0) quote = quote + ' ' + verb;
			else quote = verb;

			plugin.verb = true;
			return quote;
		}

		var addDirectComplement = function(quote)
		{
			if (plugin.directComplement) return quote;

			var dc = getRandomElement(plugin.quotesDoc.direct_complements);

			if (Boolean(Math.floor(Math.random()))) quote = quote + ' ' + dc;
			else quote = dc + ' ' + quote;

			plugin.directComplement = true;
			return quote;
		}

		var addIndirectComplement = function(quote)
		{
			if (plugin.indirectComplement) return quote;

			var ic = getRandomElement(plugin.quotesDoc.indirect_complements);

			if (Boolean(Math.floor(Math.random()))) quote = quote + ' ' + ic;
			else quote = ic + ' ' + quote;

			plugin.indirectComplement = true;
			return quote;
		}

		var addCircumstancialComplement = function(quote)
		{
			var cc = getRandomElement(plugin.quotesDoc.circumstancial_complements);

			if (Boolean(Math.floor(Math.random()))) quote = quote + ' ' + cc;
			else quote = cc + ' ' + quote;

			return quote;
		}

		var getRandomElement = function(list)
		{
			return list[Math.floor(Math.random() * list.length)];
		}

		var capitaliseFirst = function(string)
		{
			return string.charAt(0).toUpperCase() + string.substring(1);
		}

		return init();
	};

}) (jQuery);