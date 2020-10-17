import React, { Component } from 'react'

export default class PieChart extends Component {
    render() {
        return (
            <div style={{ width: '250px', margin : 'auto' }} >
                <PieChart
                    slices={[
                        {
                            color: this.props.colors[0],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.monday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[1],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.tuesday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[2],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.wednesday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[3],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.thursday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[4],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.friday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[5],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.props.weekly.saturday / this.props.totals.total_weekly) * 100),
                        },
                        {
                            color: this.props.colors[6],
                            value: (this.props.totals.total_weekly === 0 ? 0 : (this.state.record.weekly.sunday / this.state.total_weekly) * 100),
                        },
                        {
                            color: '#E2E3E5',
                            value: ((this.props.totals.total_weekly <= 0 || this.props.totals.total_remaining <= 0) ? 0 : (this.props.totals.total_remaining / this.props.totals.total_weekly) * 100),
                        }
                    ]}
                />
            </div>
        )
    }
}
