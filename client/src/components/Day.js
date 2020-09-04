import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import './styles.css'

export class Day extends Component {
    static displayName = Day.name;
      
    render() {

        let classes = ["weekday-label", this.props.day_of_week.toLowerCase()]

        return (

            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id={this.props.day_of_week} className={classes} >{this.props.day_of_week}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="0"
                    aria-label={this.props.day_of_week}
                    aria-describedby={this.props.day_of_week}
                    onChange={(event) => { this.props.onChange(this.props.day_of_week, event.target.value) }}
                    value={this.props.value}
                    type="number"
                    onFocus={(event) => { event.target.select() }}
                />
            </InputGroup>);
    }
}