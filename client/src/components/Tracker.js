import React, { Component } from 'react';
import { InputGroup, FormControl, Alert, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Day } from './Day';
import PieChart from 'react-simple-pie-chart';
import { Breakdown } from './Breakdown';
import { Login } from './Login'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { DateDisplay } from './DateDisplay';
import './styles.css';
import '../prototypes/proto-date';
import { database } from '../utility/database';

export class Tracker extends Component {
    static displayName = Tracker.name;
    static days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    /*
        render() {
            if(!loggedIn)
            {
                <Login />
            }
            else
            {
                <Welcome />
                <DateNavigation />
                <Breakdown />
                <Weekly />
                <Totals />
                <PieChart />
            }
        }

    */
    
    constructor(props) {
        super(props);

        let { match: { params } } = this.props;
        let { user, datesk } = params;

        if(!datesk)
            datesk = (new Date()).sow().yyyymmdd();

        this.state = {
            record: {
                name: user,
                datesk: datesk,
                breakdown: [...Array(7).keys()].map(i => ({ value : 0, day_complete : '' })),
                weekly: Object.fromEntries( Tracker.days.map(day => [day.toLowerCase(),0]) )
            },
            total_weekly: 0,
            total_remaining: 0,
            total_uneaten: 0
        }
    }

    async getLatestBreakdown(user, datesk)
    {      
        const url = 'http://' + window.location.hostname + ':1337/last/' + user + '/' + datesk;

        return await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
                if(data.length > 0)
                {
                    data[0].breakdown.forEach((val, index) => data[0].breakdown[index].day_complete = '');
                    return data[0].breakdown;
                }
                else {
                    return null;
                }
        });
    }

    async load(user, datesk) {

        var record = database.load(user, datesk);

        if(!record)
        {
            record = this.createEmptyRecord(true);
            record.datesk = datesk;

            var latest =  await this.getLatestBreakdown(user, datesk);

            if(!latest)
                newRecord.breakdown = latest;
        }

        await this.update((r) => record, false);
    }

    componentDidMount() {
        if(this.state.record.name)
            this.load(this.state.record.name, this.state.record.datesk);
    }

    async save() {
       await database.save(this.state.record);
    }

    async update(func, save=true)
    {
        await this.setState({
            record: func({ ...this.state.record })
        }, () => {
            this.updateTotals();

            if(save)
                this.save()
        });
    }

    async breakdownCompletionChanged(instance, day) {
        await this.update((record) =>{ 
            record.breakdown[instance].day_complete = day; 
            return record;
        })
    }
    async breakdownValueChanged(instance, value) {
        await this.update((record) =>{ 
            record.breakdown[instance].value = Number(value); 
            return record;
        })
    }
    async dayValueChanged(day, value) {
        await this.update((record) =>{ 
            record.weekly[day.toLowerCase()] = Number(value); 
            return record;
        })
    }

    updateTotals() {

        var total = this.state.record.breakdown.map(n => n.value).reduce((a, b) => a + b, 0);
        var total_complete = this.state.record.breakdown.filter(n => n.day_complete !== '').map(n => n.value).reduce((a, b) => a + b, 0);
        var eaten = Object.keys(this.state.record.weekly).map(n => this.state.record.weekly[n]).reduce((a, b) => a+b, 0);
        
        this.setState({
            total_weekly: total,
            total_remaining : (+total - +eaten),
            total_uneaten : (+total_complete - +eaten)
        });

    }

    async loginbtnclicked(user) {
        this.props.history.push('/tracker/' + user);
    }

    async prevdatebtnclicked()
    {
        await this.load(this.state.record.name, Date.fromDateSK(this.state.record.datesk).prevWeek().yyyymmdd());
    }

    async nextdatebtnclicked()
    {
        await this.load(this.state.record.name, Date.fromDateSK(this.state.record.datesk).nextWeek().yyyymmdd());
    }

    createEmptyRecord(clearbreakdown)
    {
        return {
            name: this.state.record.name,
            datesk : this.state.record.datesk,
            breakdown: [...Array(7).keys()].map(i => ({ value : (clearbreakdown?0:this.state.record.breakdown[i].value), day_complete : '' })),
            weekly: Object.fromEntries( Tracker.days.map(day => [day.toLowerCase(),0]) )
        };
    }

    async reset() {
        await this.update((record) =>{ 
            return this.createEmptyRecord(false);
        })
    }

    submitreset= () => {
        confirmAlert({
            title: 'Confirm Reset',
            message: 'Are you sure you want to reset all your data. All information will be lost.',
            buttons: [{ label: 'Yes', onClick: () => this.reset()}, {label: 'No'} ]
        });
    }

    render() {

        const colors = ['#CCE5FF', '#FFDDC9', '#D4EDDA', '#F8D7DA', '#FFF3CD', '#D1ECF1', '#E1D0EF']

        const weekly_items = []
        const breakdown_items = []

        var days = [...Tracker.days].filter((n,i) => this.state.record.breakdown[i].day_complete == '');

        for (const day in Tracker.days) {
            weekly_items.push(<Day key={day} day_of_week={Tracker.days[day]} value={Number(this.state.record.weekly[Tracker.days[day].toLowerCase()])} onChange={this.dayValueChanged.bind(this)} />);
            breakdown_items.push(<Breakdown days={[...days]} key={day} index={day} value={Number(this.state.record.breakdown[day].value)} onChange={this.breakdownValueChanged.bind(this)} day_complete={this.state.record.breakdown[day].day_complete} onComplete={this.breakdownCompletionChanged.bind(this)}/>);
        }

        const content = (
            <Container>
            <Row>
                <Col>
                    <Alert variant='info'>
                        <Alert.Heading>{this.state.record.name}</Alert.Heading>
                        Welcome to ZigZagCal. Enjoy!
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DateDisplay 
                        value={this.formatDateSK(this.state.record.datesk)} 
                        onDatePrev={this.prevdatebtnclicked.bind(this)} 
                        onDateNext={this.nextdatebtnclicked.bind(this)} 
                    />
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
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.monday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[1],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.tuesday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[2],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.wednesday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[3],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.thursday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[4],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.friday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[5],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.saturday / this.state.total_weekly) * 100),
                                },
                                {
                                    color: colors[6],
                                    value: (this.state.total_weekly === 0 ? 0 : (this.state.record.weekly.sunday / this.state.total_weekly) * 100),
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
                {typeof this.state.record.name === 'undefined' ? login : content}
             </div>
            );
    }
}