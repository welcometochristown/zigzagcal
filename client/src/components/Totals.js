import React, { Component } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'

export default class Totals extends Component {
    render() {
        return (
            <div>
                <div>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='total_weekly_calories' className='totals-label'>Weekly Goal</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                className="totals"
                                placeholder='0'
                                aria-label='total_weekly_calories'
                                aria-describedby='total_weekly_calories'
                                readOnly
                                value={this.props.totals.total_weekly}
                            />
                        </InputGroup>
                </div>   
                <div>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='total_remaining_calories' className='totals-label'>Remaining</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl 
                                className="totals"
                                placeholder='0'
                                aria-label='total_remaining_calories'
                                aria-describedby='total_remaining_calories'
                                readOnly
                                value={this.props.totals.total_remaining}
                            />
                        </InputGroup>
                </div>
                <div>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='total_uneaten_calories' className='totals-label'>Uneaten</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl 
                                className="totals"
                                placeholder='0'
                                aria-label='total_uneaten_calories'
                                aria-describedby='total_uneaten_calories'
                                readOnly
                                value={this.props.totals.total_uneaten}
                            />
                        </InputGroup>
                </div>
            </div>
        )
    }
}
