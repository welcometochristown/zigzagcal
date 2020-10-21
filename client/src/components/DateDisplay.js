import React, { Component } from 'react'
import { Pagination, InputGroup, FormControl } from 'react-bootstrap'

export default class DateDisplay extends Component {
    
    render() {
        return (
            <Pagination>
            <Pagination.Prev onClick={(event) => { this.props.onDatePrev() }}/>
                    <InputGroup className="mb-3">
                        <FormControl
                            aria-label="date-input"
                            aria-describedby="basic-addon1"
                            readOnly
                            className="text-center"
                            value={this.props.value}
                        />
                    </InputGroup>

            <Pagination.Next onClick={(event) => { this.props.onDateNext() }}/>
          </Pagination>
        )
    }
}
