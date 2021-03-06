﻿import React, { Component } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default class Login extends Component {
    static displayName = Login.name;

    constructor(props)
    {
        super(props);
        this.state = {
            name : '',
            onClick : this.props.onClick
        }
    }

    updateName(value)
    {
        this.setState({name : value});
    }

    cleanName(name)
    {
         return name.trim().toLowerCase();   
    }

    render() {
        return (
            <div>
                 <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                        <InputGroup.Text id='username'>Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder=''
                        aria-label='username'
                        aria-describedby='username'
                        onChange={(event) => { this.updateName.bind(this)(event.target.value) }}
                        onKeyPress={(event) => { if(event.charCode === 13) this.props.onClick(this.cleanName(this.state.name))}}
                    />
                </InputGroup>
                <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <Button variant="primary" onClick={(event) => { this.props.onClick(this.cleanName(this.state.name))}}>Login</Button>{' '}
                </div>
            </div>
        )
    }
}
