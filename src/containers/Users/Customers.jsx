import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { baseURL, CONFIG, formatCurrency } from '../../configs/exports';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Select from 'react-select'
export class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.applyCallback = this.applyCallback.bind(this);

        this.columns = [
            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "Date",
                className: "tsc",
                align: "left"
            },
            {
                key: "mhour",
                TrOnlyClassName: 'tsc',
                text: "Hour",
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
                key: "count",
                TrOnlyClassName: 'tsc',
                text: "Count",
                className: "tsc",
                align: "left"
            },
            {
                key: "mGGR",
                TrOnlyClassName: 'tsc',
                text: "GGR",
                className: "tsc",
                align: "left"
            }
            ,
            {
                key: "mGGRP",
                TrOnlyClassName: 'tsc',
                text: "GGR_%",
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
                excel: true,
                print: false,
                csv: true
            }
        }

        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        this.state = {
            admins: [],
            isLoading: true,
            showModal: false,
            showError: false,
            isShowError: false,
            showComponent: false,
            hideComponent: false,
            data: [],
            start: start,
            end: end,
            total: 0,
            count: 0,
            isPageLoad: true,
            channel: 293,
            terms_channel: [
                {
                    label: '293',
                    value: '293',
                },
                {
                    label: '551',
                    value: "551"
                }
                ,
                {
                    label: '216',
                    value: "216"
                }
                ,
                {
                    label: '466',
                    value: "466"
                }
                ,
                {
                    label: '447',
                    value: "447"
                }
                ,
                {
                    label: '406',
                    value: "406"
                }
                ,
                {
                    label: '441',
                    value: "441"
                }
                ,
                {
                    label: '883',
                    value: "883"
                }
                ,
                {
                    label: '274',
                    value: "274"
                }
                ,
                {
                    label: '729',
                    value: "729"
                }
                ,
                {
                    label: '292',
                    value: "292"
                }
                ,
                {
                    label: '624',
                    value: "624"
                }
                ,
                {
                    label: '277',
                    value: "277"
                }
                ,
                {
                    label: '25143',
                    value: "25143"
                }

            ]

        };
    }
    componentDidMount() {
        this.setState({
            startDate: moment(new Date()).format('DD MMM, YYYY'),
            endDate: moment(new Date()).format('DD MMM, YYYY'),
            isPageLoad: true,
            valuedate: "Today"
        })


        // alert(JSON.stringify(this.props.record_id.id))

        localStorage.setItem("STARTDATE", moment(new Date()).format('YYYY-MM-DD'))
        localStorage.setItem("ENDDATE", moment(new Date()).format('YYYY-MM-DD'))

        this.getData("", moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'), this.state.channel)
    }

    getData = (queryString = "", startDate, endDate, channel) => {

        let url = baseURL + `depositperhourperhour?channel=${channel}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`;
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

                        mcount = mcount + this.state.admins[i].count

                        let mbonus = { mstake_amount: formatCurrency(this.state.admins[i].stake_amount) };
                        let mbalance = { mwon_amount: formatCurrency(this.state.admins[i].won_amount) };

                        let mgr = { mGGR: formatCurrency(this.state.admins[i].GGR) };

                        let mgrp = { mGGRP: this.state.admins[i].GGR_P + "%" };

                        let mhour = { mhour: (this.state.admins[i].hours).toString() };

                        let date = { dates: moment.utc(this.state.admins[i].DATE).format('YYYY-MM-DD HH:mm:ss') };

                        data.push(Object.assign(date, mgr, mgrp, mhour, mbonus, mbalance, this.state.admins[i]));
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

        this.getData("", moment(new Date(startDate)).format('YYYY-MM-DD'), moment(new Date(endDate)).format('YYYY-MM-DD'), this.state.channel)
    }



    tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }

        }).join('&');

        this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD'), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD'), this.state.channel)


    }




    getDataUpdate() {
        // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

        this.getData("", moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'), this.state.channel)
    }

    handleChangeChannel = value => {
        if (value != null) {

            this.getData("", moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'), value.value)

            this.setState(
                {
                    channel: value.value,
                });
        }
        else {
            this.setState(
                {
                    channel: "",
                });

        }
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

                                        <h3>Statistics   <b>{this.state.channel}</b></h3>
                                        <br />

                                    </div>
                                </div>
                                <div className="col-md-4">

                                    <Select
                                        isClearable
                                        options={this.state.terms_channel}
                                        placeholder="Select Shortcode"
                                        autosize={true}
                                        onChange={this.handleChangeChannel}
                                        className="selected"
                                        menuPortalTarget={document.body}
                                        name="namffe"
                                    />
                                </div>

                                <br />
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
            </div >

        )
    }
}