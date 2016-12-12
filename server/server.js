var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dotenv = require('dotenv');
dotenv.load();

var getStockData = require('./getStockData');

var stockNames = ['GOOG','TSLA','MMM', 'AAPL'];

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});


io.on('connection', function(socket){
  console.log('a user connected');

  getStockData(stockNames)
    .then(function(allStocks) {
      
        socket.emit('sentAllStocks', { allStocks: allStocks });
      })
    .catch(err => console.log('error:', err))



  socket.on('addedStock', function(data) {

    var stockNameToAdd = data.stockNameToAdd;

    getStockData([ stockNameToAdd ])
      .then(function(stockData) {

          var stockToAdd = stockData[0];

          if (stockToAdd.data.length) {
            stockNames = stockNames.concat([stockNameToAdd]);
            return io.emit('addThisStock', { stockToAdd: stockToAdd });
          }

          socket.emit('removeThisStock', { stockNameToRemove: stockNameToAdd });
        })
      .catch(err => {
          socket.emit('removeThisStock', { stockNameToRemove: stockNameToAdd });
          return console.log('error:', err);
        });

  });


  socket.on('removedStock', function(data) {
    var stockNameToRemove = data.stockNameToRemove;

    stockNames = stockNames.filter(function(stockName) {
      return stockName !== stockNameToRemove
    });

    socket.broadcast.emit('removeThisStock', { stockNameToRemove: stockNameToRemove });
  });


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
});
