﻿import React, { Component } from 'react';
import { InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import './styles.css'

export class Breakdown extends Component {
    static displayName = Breakdown.name;

    render() {
        
        let classes = []

        if(this.props.day_complete !== '')
        {
            classes.push("strikethrough");
            classes.push(this.props.day_complete);
        }

        return (
             <InputGroup className="mb-3" key={this.props.index}>
                   <DropdownButton variant="secondary" id="dropdown-basic-button" title="">
                    {['<None>', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day =>
                        (<Dropdown.Item onClick={(event) => { this.props.onComplete(this.props.index,  day.replace('<None>', '').toLowerCase()) }} >{day}</Dropdown.Item>)
                    )}
                </DropdownButton>
                <FormControl
                    className={classes}
                    placeholder="0"
                    aria-label={"day_" + this.props.index}
                    aria-describedby={"day" + this.props.index}
                    onChange={(event) => { this.props.onChange(this.props.index, event.target.value) }}
                    value={this.props.value}
                    readOnly={this.props.day_complete !== ''}
                    type="number"
                    onFocus={(event) => { event.target.select() }}
                />
 
            </InputGroup>
        );
    }
}