/////react components
import React, { Component } from 'react';

/////bootstrap components
import {  Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';

///// prototypes
import '../prototypes/proto-date';
import { database } from '../utility/database';

/////local components
import DateDisplay from './DateDisplay';
import Day from './Day';
import Breakdown from './Breakdown';
import Login from './Login'
import Welcome from './Welcome'
import Totals from './Totals'
import Pie from './Pie'

/////additional components
import { confirmAlert } from 'react-confirm-alert'; 

///// css
import 'react-confirm-alert/src/react-confirm-alert.css';
import './styles.css';

export class Tracker extends Component {
    static displayName = Tracker.name;
    static days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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

    async load(user, datesk) {

        var record = await database.load(user, datesk);
        console.log({record});

        if(!record)
        {
            record = this.createEmptyRecord(true);
            record.datesk = datesk;

            var latest =  await database.load(user, datesk, true);
            console.log({latest});

            if(latest)
            {
                record.breakdown = latest.breakdown;
                record.breakdown.forEach((_, index) => record.breakdown[index].day_complete = '');
            }
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

    async prevDateBtnClicked() {
        await this.load(this.state.record.name, 
            Date.fromDateSK(this.state.record.datesk).prevWeek().yyyymmdd());
    }

    async nextDateBtnClicked() {
        await this.load(this.state.record.name, 
            Date.fromDateSK(this.state.record.datesk).nextWeek().yyyymmdd());
    }

    async loginBtnClicked(user) {
        this.props.history.push('/tracker/' + user);
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
        console.log(this.state.record)
        const colors = ['#CCE5FF', '#FFDDC9', '#D4EDDA', '#F8D7DA', '#FFF3CD', '#D1ECF1', '#E1D0EF']

        const weekly_items = []
        const breakdown_items = []

        var completed = this.state.record.breakdown.map(n => n.day_complete);
        var days = [...Tracker.days].filter((n,i) => !completed.includes(n.toLowerCase()));

        for (const day in Tracker.days) {
            weekly_items.push(<Day key={day} day_of_week={Tracker.days[day]} value={Number(this.state.record.weekly[Tracker.days[day].toLowerCase()])} onChange={this.dayValueChanged.bind(this)} />);
            breakdown_items.push(<Breakdown days={[...days]} key={day} index={day} value={Number(this.state.record.breakdown[day].value)} onChange={this.breakdownValueChanged.bind(this)} day_complete={this.state.record.breakdown[day].day_complete} onComplete={this.breakdownCompletionChanged.bind(this)}/>);
        }
        
        const totals = {
            total_weekly: this.state.total_weekly, 
            total_remaining: this.state.total_remaining, 
            total_uneaten: this.state.total_uneaten
        };

        const content = (
            <Container>
            <Row>
                <Col>
                <Welcome name={this.state.record.name} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DateDisplay 
                        value={Date.formatDateSK(this.state.record.datesk)} 
                        onDatePrev={this.prevDateBtnClicked.bind(this)} 
                        onDateNext={this.nextDateBtnClicked.bind(this)} 
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
                    {weekly_items}
                </Col>
            </Row>
            <Row>
                <Col>
                  <Totals 
                    totals={totals}
                />
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
                    {/* <Pie 
                        totals={totals}
                        weekly={this.state.record.weekly}
                        colors={colors}
                    /> */}
                </Col>              
            </Row>
             <Row>
                 <div style={{paddingBottom:"100px"}}/>
             </Row>
            </Container>);

        const login = (
            <Login onClick={this.loginBtnClicked.bind(this)}/>
        );        

        return (
             <div>
                {typeof this.state.record.name === 'undefined' ? login : content}
             </div>
            );
    }
}