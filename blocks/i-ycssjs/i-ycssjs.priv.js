(function () {
    var fs = require('fs'),
        projectPath = process.argv[1].replace(/[\w\.]+\/[\w\.]+\/[\w\.]+$/, '');

    BEM.blocks['i-router'].define('GET', /^[\w\/]+\.(js|css)$/, 'i-ycssjs');
    BEM.decl({block: 'i-ycssjs'}, null, {
        
        init: function (matches, req, res) {
            var path = projectPath + matches[0],
                suffix = matches[1];
            fs.readFile(path, 'utf8', function (err, source) {
                var result;

                if (err) {
                    res.writeHead(404);
                    return res.end();
                }

                result = source.replace(/include\(['"](.+)['"]\);?/g, function (p, p1) {
                    return fs.readFileSync(p1, 'utf8');
                });

                res.writeHead(200, {
                    'Content-Type': suffix === 'js' ? 'application/javascript' : 'text/css'
                });
                res.end(result);

            });
            return Vow.fulfill();
        }

    });
}());

