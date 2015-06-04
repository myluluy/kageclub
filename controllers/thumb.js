var Thumb = require('../proxy').Thumb;
var utility = require('utility');
var fs = require('fs');
var config = require('../config');
var request = require('request');


exports.index = function(req,res,next){
    Thumb.get({},function(err,thumbs){
        res.render('thumb', {thumbs : thumbs});
    });
}

exports.img = function(req,res,next){
    var name = req.params.name;
    Thumb.getOne({url :'/thumbs/' + name},function(err,thumb){
        if(thumb) {
            var locale = 'http://' + config.host;
            var pname = thumb.source.split('\/');
            if(config.port != 80) {
                locale += (':' + config.port);
            }

            request.get(locale + '/thumb/' + thumb.path + pname[pname.length-1])
            .on('response', function (response) {
              res.set(response.headers);
            })
            .on('error', function (err) {
              console.error(err);
            })
            .pipe(res);

        }
    });

}

