var axios = require('axios');

var getStockData = function(stockList) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  return new Promise(function(resolve, reject) {
      axios.get('https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?' +
            'ticker=' + stockList.join(',') +
            '&qopts.columns=ticker,date,open' +
            '&api_key=' + process.env.QUANDL_API_KEY +
            '&date.gte=' + (year - 1) + '-' + month + '-' + date)
          .then(function(res) {
            if (res.data.hasOwnProperty('datatable')) {
              return resolve({ allData: res.data.datatable.data, stockList })
            }
            reject(res.data)
          })
          .catch(err => reject(err));
    })
  .then(function({ allData, stockList }) {

      return stockList.map( stockName => (
        {
          name: stockName,
          data: allData.filter( item => item[0] === stockName )
                  .map( item => {
                    return [ Date.parse(item[1]), item[2] ];
                  })
        }
      ))
    });
};

module.exports = getStockData;
