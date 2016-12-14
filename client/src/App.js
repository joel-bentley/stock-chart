import React from 'react'
import { Col, Glyphicon } from 'react-bootstrap'
import io from 'socket.io-client'
const socket = io(process.env.REACT_SERVER_URL)

import ControlledInput from './components/ControlledInput'

import ReactHighstock from 'react-highcharts/ReactHighstock'
import highchartsConfig from './config/highchartsConfig'

import './App.css'


class App extends React.Component {
  state = {
    stocks: []
  }

  componentDidMount() {

    socket.on('sentAllStocks', ({ allStocks }) => {
      this.setState({ stocks: allStocks })
    })

    socket.on('addThisStock', ({ stockToAdd }) => {
      const { stocks } = this.state

      const newStocks = stocks
                          .filter( stock => (stock.name !== stockToAdd.name) )
                          .concat([ stockToAdd ])
      this.setState({ stocks: newStocks })
    })

    socket.on('removeThisStock', ({ stockNameToRemove }) => {
      const { stocks } = this.state

      const newStocks = stocks.filter( stock => (stock.name !== stockNameToRemove) )
      this.setState({ stocks: newStocks })
    } )
  }

  handleAddStock = stockNameToAdd => {
    const { stocks } = this.state

    stockNameToAdd = stockNameToAdd.toUpperCase()

    const anyNotLetters = /[^A-Z]/

    if (stockNameToAdd !== '' && stockNameToAdd.length <= 6 && !anyNotLetters.test(stockNameToAdd)) {
      const newStocks = stocks
                          .filter( stock => (stock.name !== stockNameToAdd) )
                          .concat([ {
                                      name: stockNameToAdd,
                                      data: []
                                    } ])
      this.setState({ stocks: newStocks })

      socket.emit('addedStock', { stockNameToAdd })

    } else {
      console.log('Invalid input')
    }
  }

  handleDeleteStock = stockNameToRemove => {
    const { stocks } = this.state

    const newStocks = stocks
                        .filter( stock => stock.name !== stockNameToRemove )
    this.setState({ stocks: newStocks })

    socket.emit('removedStock', { stockNameToRemove })
  }

  render() {
    const { stocks } = this.state

    const columnWidths = {
      xs: 12,
      sm: 6,
      md: 4,
      lg: 3
    }

    highchartsConfig.series = stocks.length ? (
      stocks
    ) : (
      [{name: null, data: null}]
    )

    return (
      <div className="container">

        <ReactHighstock config={highchartsConfig} />
        <br />
        <div>

          {
            stocks.map((stock, index) => {

              const isLoading = !stock.data.length
              const style = isLoading ? {color: '#bbb'} : {}
              return (
                <Col {...columnWidths} key={`stocks-${index}`}>
                  <div className="card stock">
                    <span className="h3" style={style}>{stock.name}</span>
                    <Glyphicon
                      glyph="remove"
                      style={{ float: 'right', color: 'red'}}
                      onClick={() => this.handleDeleteStock(stock.name)} />
                  </div>
                </Col>
              )
            })
          }
          <Col {...columnWidths}>
            <div className="card input">
              <ControlledInput
              placeholder=""
              onSubmit={this.handleAddStock}
              buttonText="Add Stock" />
            </div>
          </Col>

        </div>
      </div>
    )
  }
}

export default App
