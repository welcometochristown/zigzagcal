import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

export class WeeklyBreakdown extends Component {
    static displayName = WeeklyBreakdown.name;

    constructor(props) {
        super(props);
    }

    render() {

        const items = []

        new Array(7).fill(0).map((zero, index) =>
            items.push(
                <InputGroup className="mb-3" key={index}>
                <InputGroup.Prepend>
                    <InputGroup.Checkbox aria-label={"day_" + index + "_chk"} />
                </InputGroup.Prepend>
                <FormControl
                    placeholder="0"
                    aria-label={"day_" + index}
                    aria-describedby={"day" + index}
                    onChange={(event) => { this.props.onChange(index, event.target.value) }}
                />
                    
            </InputGroup>)
        );

        return (
            <div>
               
                {items}
           </div>
        );
    }
}