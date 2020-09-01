import React, { Component } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import './styles.css'

export class Breakdown extends Component {
    static displayName = Breakdown.name;

    constructor(props) {
        super(props);
    }

    render() {

        return (
             <InputGroup className="mb-3" key={this.props.index}>
                <InputGroup.Prepend>
                    <InputGroup.Checkbox aria-label={"day_" + this.props.index + "_chk"} />
                </InputGroup.Prepend>
                <FormControl
                    placeholder="0"
                    aria-label={"day_" + this.props.index}
                    aria-describedby={"day" + this.props.index}
                    onChange={(event) => { this.props.onChange(this.props.index, event.target.value) }}
                    value={this.props.value}
                />
                    
            </InputGroup>
        );
    }
}