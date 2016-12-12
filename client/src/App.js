import React from 'react'
import { Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap'
import io from 'socket.io-client'
const socket = io('http://localhost:3001')

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

    if (stockNameToAdd !== '') {
      const newStocks = stocks
                          .filter( stock => (stock.name !== stockNameToAdd) )
                          .concat([ {
                                      name: stockNameToAdd,
                                      data: []
                                    } ])
      this.setState({ stocks: newStocks })

      socket.emit('addedStock', { stockNameToAdd })
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

    highchartsConfig.series = stocks

    return (
      <div className="container">
        <ReactHighstock config={highchartsConfig} />

        <div>
          <ListGroup>
            {
              stocks.map((stock, index) => {

                const isLoading = !stock.data.length
                const style = isLoading ? {textColor: 'gray'} : {}

                return (
                  <ListGroupItem key={`stocks-${index}`}>
                    <span className="h3" style={style}>{stock.name}</span>
                    <Glyphicon
                      glyph="remove"
                      style={{ float: 'right', color: 'red'}}
                      onClick={() => this.handleDeleteStock(stock.name)} />
                  </ListGroupItem>
                )
              })
            }
            <ListGroupItem>
              <ControlledInput
              placeholder=""
              onSubmit={this.handleAddStock}
              buttonText="Add Stock" />
            </ListGroupItem>
          </ListGroup>

        </div>
      </div>
    );
  }
}

export default App;
