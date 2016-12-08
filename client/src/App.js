import React from 'react'
import { Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

import ControlledInput from './components/ControlledInput'

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

      const newStocks = [ ...stocks, stockToAdd ]
      this.setState({ stocks: newStocks })
    })

    socket.on('removeThisStock', ({ stockToRemove }) => {
      const { stocks } = this.state

      const newStocks = stocks.filter( stock => (stock !== stockToRemove) )
      this.setState({ stocks: newStocks })
    } )
  }

  handleAddStock = stockToAdd => {
    const { stocks } = this.state

    if (stockToAdd !== '') {
      const newStocks = [ ...stocks, stockToAdd ]
      this.setState({ stocks: newStocks })

      socket.emit('addedStock', { stockToAdd })
    }
  }

  handleDeleteStock = stockToRemove => {
    const { stocks } = this.state

    const newStocks = stocks.filter( stock => stock !== stockToRemove )
    this.setState({ stocks: newStocks })

    socket.emit('removedStock', { stockToRemove })
  }

  render() {
    const { stocks } = this.state

    return (
      <div className="container" style={{width: '250px'}}>
        <ListGroup>
          {
            stocks.map((stock, index) => (
              <ListGroupItem key={`stocks-${index}`}>
                <span className="h3">{stock}</span>
                <Glyphicon
                  glyph="remove"
                  style={{ float: 'right', color: 'red'}}
                  onClick={() => this.handleDeleteStock(stock)} />
              </ListGroupItem>
            ))
          }
        </ListGroup>
        <ControlledInput
          placeholder=""
          onSubmit={this.handleAddStock}
          buttonText="Add Stock" />
      </div>
    );
  }
}

export default App;
