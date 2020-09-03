import React, { Component } from 'react';
import { InputGroup, FormControl, Alert, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Day } from './Day';
import PieChart from 'react-simple-pie-chart';
import { Breakdown } from './Breakdown';
import { Login } from './Login'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
 
import './styles.css';

export class Tracker extends Component {
    static displayName = Tracker.name;

    getHostnameFromRegex = (url) => {
        // run against regex
        const matches = url.match(/^https?\:\/\/([^\/:?#]+)/i);
        // extract hostname (will be null if no match is found)
        return matches && matches[1];
    }

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        const { user } = params;

        this.state = {
            user : user,
            record: {
                name: user,
                breakdown: [...Array(7).keys()].map(i => ({ value : 0, day_complete : '' })),
                weekly: {
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0,
                    saturday: 0,
                    sunday: 0,
                }
            },
            total_weekly: 0,
            total_remaining: 0,
            total_uneaten: 0,
            loading : true
        }

        //init variables here
    }

    async populateCalorieData() {
        console.log(window.location.hostname);
        const url = 'http://' + window.location.hostname + ':1337/' + this.state.user;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        })
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                this.setState({
                    record: data[0],
                    loading: false
                });
            }
        });

        console.log(this.state);
        this.updateTotals();
    }

    componentDidMount() {
        if(this.state.user)
            this.populateCalorieData();
    }

    updateTotals() {

     
       // var total = this.state.record.breakdown.(+this.state.record.breakdown["0"].value + +this.state.record.breakdown["1"].value + +this.state.record.breakdown["2"].value + +this.state.record.breakdown["3"].value + +this.state.record.breakdown["4"].value + +this.state.record.breakdown["5"].value + +this.state.record.breakdown["6"].value);
        //var eaten = (+this.state.record.weekly['monday'] + +this.state.record.weekly['tuesday'] + +this.state.record.weekly['wednesday'] + +this.state.record.weekly['thursday'] + +this.state.record.weekly['friday'] + +this.state.record.weekly['saturday'] + +this.state.record.weekly['sunday']);
        
        var total = this.state.record.breakdown.map(n => n.value).reduce((a, b) => a + b, 0);
        var total_complete = this.state.record.breakdown.filter(n => n.day_complete != '').map(n => n.value).reduce((a, b) => a + b, 0);
        var eaten = Object.keys(this.state.record.weekly).map(n => this.state.record.weekly[n]).reduce((a, b) => a+b, 0);
        
        var remaining = (+total - +eaten);
        var uneaten = (+total_complete - +eaten);

        console.log({total,total_complete, eaten, remaining});

        this.setState({
            total_weekly: total,
            total_remaining : remaining,
            total_uneaten : uneaten
        });

    }
    async breakdownCompletionChanged(instance, day) {
        console.log({instance, day});

        let newRecord = { ... this.state.record };
        newRecord.breakdown[instance].day_complete = day;

        await this.setState({
            record: newRecord
        }, () => {
            this.save()
            console.log(this.state);
        });

        
    }

    async breakdownValueChanged(instance, value) {

        let newRecord = { ... this.state.record };
        newRecord.breakdown[instance].value = Number(value);

        await this.setState({
            record: newRecord
        }, () => {
            this.updateTotals();
            this.save()
        });
    }

    async dayValueChanged(day, value) {

        let newRecord = { ... this.state.record };
        newRecord.weekly[day.toLowerCase()] = Number(value);
        this.setState({
            record: newRecord
        }, () => {
            this.updateTotals();
            this.save()
        });
    }

    async save() {
        const url = 'http://' + window.location.hostname + ':1337';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.state.record)
        })
        .then(res => {
            this.updateTotals();
        });
    }

    async loginbtnclicked(user)
    {
        this.props.history.push('/tracker/' + user);
    }

    submitreset= () => {
        confirmAlert({
          title: 'Confirm Reset',
          message: 'Are you sure you want to reset all your data. All information will be lost.',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.reset()
            },
            {
              label: 'No'
            }
          ]
        });
      };

    async reset()
    {
        console.log('resetting');
        var emptyRecord = {
            name: this.state.user,
            breakdown: [...Array(7).keys()].map(i => ({ value : this.state.record.breakdown[i].value, day_complete : '' })),
            weekly: {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
            }
        };

        await this.setState(
            {
                record : emptyRecord,
            }, 
            () => {
            this.updateTotals();
            this.save();
        });

    }

    render() {

        console.log('rendering');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const colors = ['#CCE5FF', '#FFDDC9', '#D4EDDA', '#F8D7DA', '#FFF3CD', '#D1ECF1', '#E1D0EF']

        const weekly_items = []

        for (const day in days) {
            weekly_items.push(<Day key={day} day_of_week={days[day]} value={Number(this.state.record.weekly[days[day].toLowerCase()])} onChange={this.dayValueChanged.bind(this)} />);
        }

        const breakdown_items = []

        for (const day in days) {
            breakdown_items.push(<Breakdown key={day} index={day} value={Number(this.state.record.breakdown[day].value)} onChange={this.breakdownValueChanged.bind(this)} day_complete={this.state.record.breakdown[day].day_complete} onComplete={this.breakdownCompletionChanged.bind(this)}/>);
        }

        const content = (
            <Container>
            <Row>
                <Col>
                    <Alert variant='info'>
                        <Alert.Heading>{this.state.user}</Alert.Heading>
                        Welcome to ZigZagCal. Enjoy!
                    </Alert>
                </Col>
            </Row>     
            <Row>
                <Col>
                    {breakdown_items}
                </Col>
            </Row>
            <Row>
                <Col>
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
                            value={this.state.total_weekly}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    {weekly_items}
                </Col>
            </Row>

            <Row>
                <Col>
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
                            value={this.state.total_remaining}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Row>
                <Col>
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
                            value={this.state.total_uneaten}
                        />
                    </InputGroup>
                </Col>
            </Row>


            <Row>
                    <Col>
                    <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                        <Button variant="primary" onClick={this.submitreset.bind(this)}>Reset</Button>{' '}
                    </div>
                    </Col>
                </Row>
            <Row>
                <Col>
                    <div style={{ width: '250px', margin : 'auto' }} >
                        <PieChart
                            slices={[
                                {
                                    color: colors[0],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.monday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[1],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.tuesday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[2],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.wednesday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[3],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.thursday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[4],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.friday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[5],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.saturday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[6],
                                    value: (this.state.total_weekly == 0 ? 0 : (this.state.record.weekly.sunday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: '#E2E3E5',
                                    value: ((this.state.total_weekly <= 0 || this.state.total_remaining <= 0) ? 0 : (this.state.total_remaining / this.state.total_weekly) * 100),
                                }
                            ]}
                        />
                        </div>
                </Col>              
            </Row>
             <Row>
                 <div style={{paddingBottom:"100px"}}/>
             </Row>
            </Container>);

        const login = (
            <Login onClick={this.loginbtnclicked.bind(this)}/>
        );        

        return (
             <div>
                {typeof this.state.user === 'undefined' ? login : content}
             </div>
            );
    }
}