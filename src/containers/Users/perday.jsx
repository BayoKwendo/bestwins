import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, } from 'reactstrap';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import { baseURL, AGENTEKEYWORD, CONFIG } from '../../configs/exports';
import Select from 'react-select'


export class NewlyCustomersCount extends React.Component {
    constructor(props) {
        super(props);
        this.applyCallback = this.applyCallback.bind(this);


        this.columns = [
            {
                key: "msisdn",
                TrOnlyClassName: 'tsc',
                text: "Customer",
                className: "tsc",
                align: "left"
            },
            {
                key: "name",
                TrOnlyClassName: 'tsc',
                text: "Name",
                className: "tsc",
                align: "left"
            },
            {
                key: "ussd",
                TrOnlyClassName: 'tsc',
                text: "USSD",
                className: "tsc",
                align: "left"
            },

            {
                key: "channel",
                TrOnlyClassName: 'tsc',
                text: "Channel",
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
            length_menu: [20000, 50000, 100000, 200000, 300000],
            show_filter: false,
            show_pagination: true,
            pagination: 'advance',
            page_size: 1000,
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
                csv: true
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
            isPageLoad: true,
            channel: "1",
            ussd: '',
            terms_channel: [
                {
                    label: '885',
                    value: '885'
                },
                {
                    label: '538',
                    value: '538'
                }
                ,
                {
                    label: '599',
                    value: '599'
                }
            ]

        }
    }
    componentDidMount() {
        this.setState({
            startDate: moment(new Date()).format('DD MMM, YYYY'),
            endDate: moment(new Date()).format('DD MMM, YYYY'),
            isPageLoad: true,
            valuedate: "Today"
        })


        localStorage.setItem("STARTDATE", moment(new Date()).format('YYYY-MM-DD'))
        localStorage.setItem("ENDDATE", moment(new Date()).format('YYYY-MM-DD'))

        this.getData("")
    }

    getData = (queryString = "", channel = "", ussd = "666", startDate, endDate,) => {
        // eslint-disable-next-line
        let url = baseURL + `per_day_report?presenter=${channel}&ussd=${ussd}` + queryString

        // alert(url)
        console.log(url)
        this.setState({
            isLoading: true,
        })
        const config = CONFIG

        // alert(url)
        axios.all([
            axios.get(url, config),
        ]).then(axios.spread((branchResponse,) => {
            this.setState({
                admins: branchResponse.data.data,
                mdata: branchResponse.data.total,
                isLoading: false,
            },
                function () {
                    var data = [];
                    console.log("BUG", this.state.admins)

                    if (this.state.admins.length > 0) {
                        for (let i = 0; i < this.state.admins.length; i++) {
                            let date = { dates: moment.utc(this.state.admins[i].created_on).format('YYYY-MM-DD HH:mm:ss') };
                            data.push(Object.assign(date, this.state.admins[i]));
                            this.setState({
                                data: data
                            })
                        }
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



        this.getData("");
    }


    tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }

        }).join('&');

        this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD'), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD'))


    }

    getDataUpdate() {

        this.getData("", moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'))
    }



    handleChangeChannel = value => {
        if (value != null) {

            // Call the `getData` function
            this.getData("", value.value, this.state.channel
            );

            this.setState({
                ussd: value.value
            })
        } else {
            this.setState({
                ussd: ''
            })
        }
    }

    handleChangeChannelDD = value => {
        if (value != null) {

            // Call the `getData` function
            this.getData("", value, this.state.ussd,
            );

            this.setState({
                channel: value
            })
        } else {
            this.setState({
                channel: ''
            })
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
            <div >
                < >
                    <h4>No of Customers Per Day</h4>
                    < Card >
                        <CardBody >
                            <div className="row">
                                <div className="col-6 float-right">
                                    <a href="https://besnaapi.goldmanlogistics.com/download_csv" download>
                                        <button className="float-right btn btn-primary btn-bg" onClick={e => {
                                            // this.getDataUpdate();
                                        }} >DOWNLOAD ALL
                                        </button>
                                    </a>
                                </div>

                                {/* <div className="col-md-8"> */}
                                {/* <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-6">
                                                <DateTimeRangeContainer
                                                    ranges={ranges}
                                                    start={this.state.start}
                                                    end={this.state.end}
                                                    local={local}
                                                    applyCallback={this.applyCallback}>
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
                                {/* </div>
                                        </div> */}
                                {/* {/* </div> */}
                                {/* </div>  
                                <div className="col-md-4">
                                </div> */}
                            </div><br />
                            <div className="panel-body" >
                                <div >
                                    Newly Recruited Customers: <b>{this.state.mdata}</b>

                                </div>
                                <br />

                                <div className="col-md-4">

                                    <label className="form-label">Enter Channel</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="channel"
                                        value={this.state.channel}
                                        onChange={(e) => this.handleChangeChannelDD(e.target.value)}
                                    />

                                </div>
                                <br></br>
                                <br />
                                {/* <div className="col-md-4">

                                    <Select
                                        isClearable
                                        options={this.state.terms_channel}
                                        placeholder="Select USSD"
                                        autosize={true}
                                        onChange={this.handleChangeChannel}
                                        className="selected"
                                        menuPortalTarget={document.body}
                                        name="namffe"
                                    />
                                </div> */}


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
                        </CardBody>

                    </Card>
                </>
            </div>

        )
    }
}