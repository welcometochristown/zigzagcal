import React, { Component } from 'react';
import { InputGroup, FormControl, Alert } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Day } from './Day';
import PieChart from 'react-simple-pie-chart';
import { Breakdown } from './Breakdown';
import './styles.css';

export class Tracker extends Component {
    static displayName = Tracker.name;

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        const { user } = params;

        this.state = {
            user : user,
            record: {
                _id : '',
                name: user,
                breakdown: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0
                },
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
            loading : true
        }

        //init variables here
    }

    async populateCalorieData() {
        const url = 'http://localhost:1337/' + this.state.user;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                record: data[0],
                loading: false
            });
        });

        console.log(this.state);
        this.updateTotals();
    }

    componentDidMount() {
        this.populateCalorieData();
    }

    updateTotals() {

        var total = (+this.state.record.breakdown["0"] + +this.state.record.breakdown["1"] + +this.state.record.breakdown["2"] + +this.state.record.breakdown["3"] + +this.state.record.breakdown["4"] + +this.state.record.breakdown["5"] + +this.state.record.breakdown["6"]);
        var remaining = (+total - (+this.state.record.weekly['monday'] + +this.state.record.weekly['tuesday'] + +this.state.record.weekly['wednesday'] + +this.state.record.weekly['thursday'] + +this.state.record.weekly['friday'] + +this.state.record.weekly['saturday'] + +this.state.record.weekly['sunday']));

        this.setState({
            total_weekly: total,
            total_remaining : remaining
        });

        console.log(this.state);

    }

    async breakdownValueChanged(instance, value) {

        let newRecord = { ... this.state.record };
        newRecord.breakdown[instance] = value;
        this.setState({
            record: newRecord
        })
        this.updateTotals();
        await this.save();
    }

    async dayValueChanged(day, value) {

        let newRecord = { ... this.state.record };
        newRecord.weekly[day.toLowerCase()] = value;
        this.setState({
            record: newRecord
        })
        this.updateTotals();
        await this.save();
    }

    async save() {
        const url = 'http://localhost:1337/' + this.state.user;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: this.state.record
        });

        console.log(this.state);
        this.updateTotals();
    }

    render() {

        console.log('rendering');
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const colors = ['#CCE5FF', '#FFDDC9', '#D4EDDA', '#F8D7DA', '#FFF3CD', '#D1ECF1', '#E1D0EF']

        const weekly_items = []

        for (const day in days) {
            weekly_items.push(<Day key={day} day_of_week={days[day]} bgColor={colors[day]} value={this.state.record.weekly[days[day].toLowerCase()]} onChange={this.dayValueChanged.bind(this)}/>);
        }

        const breakdown_items = []

        for (const day in days) {
            breakdown_items.push(<Breakdown key={day} index={day} value={this.state.record.breakdown[day]} onChange={this.breakdownValueChanged.bind(this)} />);
        }

        return (
            <div>
            <Container>
                    <Row>
                        <Col>
                            <Alert variant='info'>
                                <Alert.Heading>{this.state.name}</Alert.Heading>
                                Welcome to ZigZagCal. Enjoy!
                             </Alert>
                         </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id='total_weekly_calories' className='totals-label'>Weekly Goal</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder='0'
                                    aria-label='total_weekly_calories'
                                    aria-describedby='total_weekly_calories'
                                    readOnly
                                    value={this.state.total_weekly}
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id='total_remaining_calories' className='totals-label'>Remaining</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
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
                            {breakdown_items}
                        </Col>
                        <Col>
                                <div style={{ width: '250px', margin : 'auto' }} >
                                <PieChart
                                    slices={[
                                        {
                                            color: colors[0],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Monday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[1],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Tuesday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[2],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Wednesday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[3],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Thursday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[4],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Friday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[5],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Saturday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: colors[6],
                                            value: (this.state.total_weekly == 0 ? 0 : (this.state.Sunday / this.state.total_weekly) * 100),
                                        },
                                        {
                                            color: '#E2E3E5',
                                            value: ((this.state.total_weekly <= 0 || this.state.total_remaining <= 0) ? 0 : (this.state.total_remaining / this.state.total_weekly) * 100),
                                        }
                                    ]}
                                />
                                </div>
                            </Col>
                            <Col>
                                {weekly_items}
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
    }
}