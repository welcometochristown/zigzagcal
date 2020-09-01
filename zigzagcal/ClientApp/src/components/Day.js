import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import './styles.css'

export class Day extends Component {
    static displayName = Day.name;

    constructor(props) {
        super(props);
    }


    render() {
        return (

            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id={this.props.day_of_week} className="weekday-label" style={{ backgroundColor: this.props.bgColor }} >{this.props.day_of_week}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    className="totals-input"
                    placeholder="0"
                    aria-label={this.props.day_of_week}
                    aria-describedby={this.props.day_of_week}
                    onChange={(event) => { this.props.onChange(this.props.day_of_week, event.target.value) }}
                />
            </InputGroup>);
    }
}