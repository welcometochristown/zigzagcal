import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

export default class Welcome extends Component {
    render() {
        return (
            <div>
                <Alert variant='info'>
                        <Alert.Heading>{this.props.name}</Alert.Heading>
                        Welcome to ZigZagCal. Enjoy!
                </Alert>
            </div>
        )
    }
}
