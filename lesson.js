
var cheerio = require('cheerio'),
    request = require('request'),
    ncl = require('ncl-connect');

exports.getModules = function(user, callback) {

    ncl.getPage(user, 'https://lesson.cs.ncl.ac.uk/', function(error, $)
    {
        if(error)
            return callback(error);

        var modules = [];

        $('article .span3').each(function() {

            if($(this).find('ul').text().trim() == '')
                return;

            var module = {
                name: $(this).find('h2').text().trim()
            };
            $(this).find('ul li').each(function() {
                var name = $(this).find('a').text().trim();
                if(name == 'Links')
                    module.links = true;
                else if(name == 'Media')
                    module.media = true;
            });
            modules.push(module);

        });
        callback(null, modules);
    });
}

exports.getMediaList = function(module, user, callback) {

    ncl.getPage(user, 'https://lesson.cs.ncl.ac.uk/module/' + module + '/media', function(error, $)
    {
        if(error)
            return callback(error);

        var mediaList = [];

        $('article .span3').each(function() {

            if($(this).find('ul').text().trim() == '')
                return;

            $(this).find('ul li').each(function() {

                var $a = $(this).find('a');
                var media = {
                    name: $a.text().trim(),
                    link: $a.attr('href').split('/').slice(-1)[0]
                };
                mediaList.push(media);
            });

        });
        callback(null, mediaList);
    });
}

exports.getMedia= function(module, media, user, callback) {

    ncl.getPage(user, 'https://lesson.cs.ncl.ac.uk/module/' + module + '/' + media, function(error, $)
    {
        if(error)
            return callback(error);

        callback(null, $('article').html());
    });
}
