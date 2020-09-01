import React, { Component } from 'react';
import { InputGroup, FormControl, Alert } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Day } from './Day';
import PieChart from 'react-simple-pie-chart';
import { WeeklyBreakdown } from './WeeklyBreakdown';
import './styles.css';

export class Tracker extends Component {
    static displayName = Tracker.name;

    constructor(props) {
        super(props);

        this.state = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0,
            instances: [0,0,0,0,0,0,0],
            total_weekly: 0,
            total_remaining: 0

        }

        //init variables here
    }

    updateTotals() {
        this.state.total_weekly = +this.state.instances[0] + +this.state.instances[1] + +this.state.instances[2] + +this.state.instances[3] + +this.state.instances[4] + +this.state.instances[5] + +this.state.instances[6];
        this.state.total_remaining = +this.state.total_weekly - (+this.state.Monday + +this.state.Tuesday + +this.state.Wednesday + +this.state.Thursday + +this.state.Friday + +this.state.Saturday + +this.state.Sunday);
        this.setState(this.state);
    }

    instanceValueChanged(instance, value) {
        this.state.instances[instance] = value;
        this.updateTotals();
    }

    dayValueChanged(day, value) {
        this.state[day] = value;
        this.updateTotals();
    }

    load() {
        //load from database
    }

    save() {
        //save to database
    }

    render() {
        const { match: { params } } = this.props;
        const { user } = params;

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const colors = ['#CCE5FF', '#FFDDC9', '#D4EDDA', '#F8D7DA', '#FFF3CD', '#D1ECF1', '#E1D0EF']

        const items = []

        for (const day in days) {
            items.push(<Day key={day} day_of_week={days[day]} bgColor={colors[day]} onChange={this.dayValueChanged.bind(this)}/>);
        }

        return (
            <div>
            <Container>
                    <Row>
                        <Col>
                            <Alert variant="info">
                                <Alert.Heading>{user}</Alert.Heading>
                                Welcome to ZigZagCal. Enjoy!
                             </Alert>
                         </Col>
                    </Row>
                    <Row>
                        <Col>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="total_weekly_calories" className="totals-label">Weekly Goal</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="0"
                                    aria-label="total_weekly_calories"
                                    aria-describedby="total_weekly_calories"
                                    readOnly
                                    value={this.state.total_weekly}
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="total_remaining_calories" className="totals-label">Remaining</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="0"
                                    aria-label="total_remaining_calories"
                                    aria-describedby="total_remaining_calories"
                                    readOnly
                                    value={this.state.total_remaining}
                                />
                            </InputGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <WeeklyBreakdown onChange={this.instanceValueChanged.bind(this)}/>
                        </Col>
                        <Col>
                            <div style={{ width: '250px', margin : "auto" }} >
                            <PieChart
                                slices={[
                                    {
                                        color: colors[0] ,
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Monday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color: colors[1],
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Tuesday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color:  colors[2] ,
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Wednesday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color:  colors[3] ,
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Thursday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color:  colors[4] ,
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Friday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color:  colors[5] ,
                                        value: (this.state.total_weekly == 0 ? 0 : (this.state.Saturday / this.state.total_weekly) * 100),
                                    },
                                    {
                                        color:  colors[6] ,
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
                                {items}
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
    }
}