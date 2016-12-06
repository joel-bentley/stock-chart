import React from 'react'
import { Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

import ControlledInput from './components/ControlledInput'

class App extends React.Component {
  state = {
    stocks: []
  }

  handleAddStock = stock => {
    if (stock !== '') {
      const newStocks = JSON.parse(JSON.stringify(this.state.stocks))
                        .concat([ stock ])
      this.setState({ stocks: newStocks })
    }
  }

  handleDeleteStock = deleteIndex => {
    const newStocks = JSON.parse(JSON.stringify(this.state.stocks))
                        .filter((stock, index) => (index !== deleteIndex))
    this.setState({ stocks: newStocks })
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
                  onClick={() => this.handleDeleteStock(index)} />
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
