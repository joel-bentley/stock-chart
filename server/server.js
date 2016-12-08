var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var stocks = ['GOOG','TSLA','MMM', 'AAPL'];

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('sentAllStocks', { allStocks: stocks });

  socket.on('addedStock', function(data) {
    stocks = stocks.concat([data.stockToAdd]);

    socket.broadcast.emit('addThisStock', { stockToAdd: data.stockToAdd });
  });

  socket.on('removedStock', function(data) {
    stocks = stocks.filter(function(stock) {
      return stock !== data.stockToRemove
    });

    socket.broadcast.emit('removeThisStock', { stockToRemove: data.stockToRemove });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
});
