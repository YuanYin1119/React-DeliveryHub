import React, { Component } from 'react'
const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

class TextSearch extends Component {
  state = {
    value: ''
  }

  timer = null

  handleChange = e => {
    clearTimeout(this.timer)
    this.setState({ value: e.target.value })
    this.props.clearErrMsg('')
    this.timer = setTimeout('', WAIT_INTERVAL)
  }

  handleKeyDown = e => {
    //   console.log(e.keyCode)
    if (e.keyCode === ENTER_KEY) {
        // console.log('enter') 
      clearTimeout(this.timer)
      this.triggerChange()
      // this.setState({ value:'' })
      e.target.select()
    }
  }

  handleClick = e => {
      e.target.select()
    
  }


  triggerChange = () => {
    const { value } = this.state

    this.props.onKeyDown( {value:this.state, keyval:ENTER_KEY })
  }

  render() {
    const { ...rest } = this.props

    return (
      <input
        type={rest.type}
        className={rest.className}
        placeholder={rest.placeholder}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
      />
    )
  }
}

export default TextSearch