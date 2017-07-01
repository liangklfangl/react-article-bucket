// var makeTable = require('./render-server');

// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});

//   var table = makeTable();
//   //获取到服务端渲染成功后的html字符串
//   //我们的makeTable其实是渲染了我们的Table组件，所以会发现在table上有react-data-checksum
//   //<table data-reactroot="" data-reactid="1" data-react-checksum="-1732342869"></table>
//   var html = '<!doctype html>\n\
//               <html>\
//                 <head>\
//                     <title>react server render</title>\
//                 </head>\
//                 <body><div id="react-content">' +
//                 //我们将table组件的渲染结果放置到react-content元素中
//                     table +
//                 '</div></body>\
//               </html>';

//   res.end(html);
// }).listen(1337, "127.0.0.1");

// console.log('Server running at http://127.0.0.1:1337/');



var makeTable = require('./render-server');
var http = require('http');
http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        //这里仅仅是渲染了一个Table组件，否则必须通过下面的方式完成
        //renderProps.components.forEach
        //Detail:http://www.toutiao.com/i6284121573897011714/
        makeTable(function (table) {
            var html = '<!doctype html>\n\
                      <html>\
                        <head>\
                            <title>react server render</title>\
                        </head>\
                        <body>' +
                            table +
                            '<script src="pack.js"></script>\
                        </body>\
                      </html>';

            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.end();
    }

}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');