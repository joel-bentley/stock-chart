var highchartsConfig = {

  rangeSelector: {
      selected: 4
  },

  title: {
    text: 'Stock Chart'
  },

  yAxis: {
      labels: {
          formatter: function () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%';
          }
      },
      plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
      }]
  },

  navigator: {
    enabled: false
  },

  scrollbar: {
    enabled: false
  },

  credits: {
      enabled: false
  },

  plotOptions: {
      series: {
          compare: 'percent',
          showInNavigator: true
      }
  },

  tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true
  },

  series: null
}

export default highchartsConfig
