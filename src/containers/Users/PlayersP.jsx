import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { baseURL, CHANNEL, CONFIG, formatCurrency, HOURS_FROM, HOURS_TO } from '../../configs/exports';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'

export class PlayersHour extends React.Component {
    constructor(props) {
        super(props);
        this.applyCallback = this.applyCallback.bind(this);

        this.columns = [

            {
                key: "name",
                TrOnlyClassName: 'tsc',
                text: "Name",
                className: "tsc",
                align: "left"
            },
            {
                key: "msisdn",
                TrOnlyClassName: 'tsc',
                text: "Number",
                className: "tsc",
                align: "left"
            },
            {
                key: "mstake_amount",
                TrOnlyClassName: 'tsc',
                text: "Amount",
                className: "tsc",
                align: "left"
            },
            {
                key: "mwon_amount",
                TrOnlyClassName: 'tsc',
                text: "Won Amount",
                className: "tsc",
                align: "left"
            },

            {
                key: "plays",
                TrOnlyClassName: 'tsc',
                text: "Plays",
                className: "tsc",
                align: "left"
            },
            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "Date",
                className: "tsc",
                align: "left"
            }
        ];


        this.config = {
            key_column: "tsc",
            length_menu: [100, 200, 500],
            show_filter: false,
            show_pagination: true,
            pagination: 'advance',
            page_size: 100,
            show_length_menu: true,
            language: {
                loading_text: "Please be patient while data loads...",
                no_data_text: "No data was found",
                filter: "Enter date (YYYY-MM-DD)",
                pagination: {
                    next: <span>&#9658;</span>,
                    previous: <span>&#9668;</span>
                    // next
                    // previous
                }
            },
            button: {
                // excel: true,
                // print: false,
                // csv: true
            }
        }
        this.state = {
            admins: [],
            isLoading: true,
            showModal: false,
            showError: false,
            isShowError: false,
            showComponent: false,
            hideComponent: false,
            data: [],
        };
        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        this.state = {
            start: start,
            end: end,
            total: 0,
            count: 0,
            isPageLoad: true,
        }
    }
    componentDidMount() {
        this.setState({
            startDate: moment(new Date()).format('DD MMM, YYYY'),
            endDate: moment(new Date()).format('DD MMM, YYYY'),
            isPageLoad: true,
            valuedate: "Today"
        })


        // alert(JSON.stringify(this.props.record_id.id))

        localStorage.setItem("STARTDATE", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
        localStorage.setItem("ENDDATE", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))

        this.getData("", moment(new Date()).format('YYYY-MM-DD 00:00:00'), moment(new Date()).format('YYYY-MM-DD 23:59:59'))
    }

    getData = (queryString = "", startDate, endDate) => {

        let url = baseURL + `dailydeposit_hour?channel=${CHANNEL}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`;

        // alert(url)
        this.setState({
            isLoading: true,
        })

        // alert(url)
        axios.all([
            axios.get(url, CONFIG)
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data,
                isLoading: false,
            }, function () {
                var data = [];
                let mtotal = 0

                let mcount = 0

                if (this.state.admins.length > 0) {

                    for (let i = 0; i < this.state.admins.length; i++) {
                        mtotal = mtotal + this.state.admins[i].stake_amount
                        mcount = mcount + this.state.admins[i].plays
                        let mbonus = { mstake_amount: formatCurrency(this.state.admins[i].stake_amount) };
                        let mbalance = { mwon_amount: formatCurrency(this.state.admins[i].won_amount) };
                        let date = { dates: moment.utc(this.state.admins[i].date_created).format('YYYY-MM-DD HH:mm:ss') };
                        data.push(Object.assign(date, mbonus, mbalance, this.state.admins[i]));
                        console.log("bugs", data);
                    }


                    const b = data.sort(function (a, b) {
                        return new Date(a.dates) - new Date(b.dates)
                    })

                    this.setState({
                        data: b.reverse(),
                        total: mtotal,
                        count: mcount,
                        mdata: branchResponse.data[0].total_page
                    })

                } else {

                    this.setState({
                        data: data,
                        isLoading: false,

                    })
                    console.log("bugs", data);
                }
            }
            );
        }))
    }


    applyCallback(startDate, endDate) {

        localStorage.setItem("STARTDATE", startDate)
        localStorage.setItem("ENDDATE", endDate)
        let Sdate1 = moment(startDate).format('DD MMM, YYYY');
        let Edate2 = moment(endDate).format('DD MMM, YYYY');
        this.setState({
            valuedate: Sdate1 + " " + Edate2,
            startDate: Sdate1,
            isPageLoad: true,
            endDate: Edate2
        })



        this.getData("", moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'));
    }



    tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }

        }).join('&');

        this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD HH:mm:ss'), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD HH:mm:ss'))


    }




    getDataUpdate() {
        // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

        this.getData("", moment(new Date()).format('YYYY-MM-DD 00:00:00'), moment(new Date()).format('YYYY-MM-DD 23:59:59'))
    }

    render() {
        let ranges = {
            "Today Only": [moment(this.state.start), moment(this.state.end)],
            "Yesterday Only": [
                moment(this.state.start).subtract(1, "days"),
                moment(this.state.end).subtract(1, "days")
            ],
            "3 Days": [moment(this.state.start).subtract(3, "days"), moment(this.state.end)],
            "5 Days": [moment(this.state.start).subtract(5, "days"), moment(this.state.end)],
            "1 Week": [moment(this.state.start).subtract(7, "days"), moment(this.state.end)],
            "2 Weeks": [moment(this.state.start).subtract(14, "days"), moment(this.state.end)],
            "1 Month": [moment(this.state.start).subtract(1, "months"), moment(this.state.end)],
            "1 Year": [moment(this.state.start).subtract(1, "years"), moment(this.state.end)]
        };
        let local = {
            "format": "DD-MM-YYYY",
            "sundayFirst": false
        }




        return (
            <div style={{ marginTop: '-20px' }} >
                < >
                    < Card >
                        <CardBody >
                            < >

                                <div className="row">
                                    <div className="col-md-8">

                                        <h3>Players  <b>{this.state.mdata}</b></h3>
                                    </div>
                                </div>
                                <br />

                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-6">
                                                    <DateTimeRangeContainer
                                                        ranges={ranges}
                                                        start={this.state.start}
                                                        end={this.state.end}
                                                        local={local}
                                                        applyCallback={this.applyCallback}>
                                                        <FormControl
                                                            id="formControlsTextB"
                                                            type="text"
                                                            value={this.state.valuedate}
                                                            label="Text"
                                                            placeholder="Filter by Date"
                                                        />
                                                    </DateTimeRangeContainer>
                                                </div>
                                                <div className="col-6 float-left">

                                                    <button className=" float-left btn btn-primary btn-sm" onClick={e => {
                                                        this.getDataUpdate();
                                                        this.setState({
                                                            startDate: moment(new Date()).format('DD MMM, YYYY'),
                                                            endDate: moment(new Date()).format('DD MMM, YYYY'),
                                                            valuedate: "Today"
                                                        })
                                                    }} >Clear</button>
                                                    {/* <input id="input" type="text" readOnly /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div><br />

                                <h3>Total Counts  <b>{this.state.count}</b></h3>

                                <h3>Total Stake  <b>{this.state.total}</b></h3>
                                <br />
                                <div className="panel-body" >
                                    <ReactDatatable
                                        config={this.config}
                                        records={this.state.data}
                                        columns={this.columns}
                                        dynamic={true}
                                        id="tsc"
                                        loading={this.state.isLoading}
                                        total_record={this.state.mdata}
                                        onChange={this.tableChangeHandler} />
                                </div>
                            </>

                        </CardBody>

                    </Card>
                </>
            </div>

        )
    }
}