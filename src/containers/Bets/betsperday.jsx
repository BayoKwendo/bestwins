import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { baseURL } from '../../configs/exports';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'

export class BetsPerDay extends React.Component {
    constructor(props) {
        super(props);
        this.applyCallback = this.applyCallback.bind(this);


        this.columns = [
            {
                key: `dates`,
                TrOnlyClassName: 'tsc',
                text: "Date",
                className: "tsc",
                align: "left"
            },
            {
                key: `mcount`,
                TrOnlyClassName: 'tsc',
                text: "Count",
                className: "tsc",
                align: "left"
            }
        ];
        this.config = {
            key_column: "tsc",
            length_menu: [10, 20, 50],
            show_filter: false,
            show_pagination: false,
            pagination: 'advance',
            page_size: 100,
            show_length_menu: false,
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
                excel: false,
                print: false,
                csv: false
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
        }
    }
    componentDidMount() {
        this.setState({
            startDate: moment(new Date()).format('DD MMM, YYYY'),
            endDate: moment(new Date()).format('DD MMM, YYYY'),
            isPageLoad: true,
            valuedate: "Today"
        })

        this.getData(moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'))
    }

    getData = (startDate, endDate) => {

        let url = baseURL + `betcountsss?startDate="${startDate}"&endDate="${endDate}"`;
        console.log("query", url);
        this.setState({
            isLoading: true,
        })
        axios.all([
            axios.get(url),
        ]).then(axios.spread((mtnAnalysisResponse,) => {
            this.setState({
                mtnAnalysis: mtnAnalysisResponse.data,
                // mdata: entityResponse.data.customer,
                isLoading: false,
            },
                function () {
                    var data = [];
                    console.log("BUG", this.state.mtnAnalysis)
                    if (this.state.mtnAnalysis.length > 0) {
                        for (let i = 0; i < this.state.mtnAnalysis.length; i++) {

                            let mcount = { mcount: this.state.mtnAnalysis[i].COUNT.toString() }


                            let date = { dates: moment.utc(this.state.mtnAnalysis[i].DATE).format("DD-MMM-yyyy") };
                            data.push(Object.assign(
                                date,
                                mcount,
                                this.state.mtnAnalysis[i]));
                            this.setState({
                                data: data,
                                isLoading: false
                            })
                            console.log("bugs", data);
                        }
                    } else {
                        this.setState({
                            data: data,
                            isLoading: false
                        })
                        console.log("bugs", data);
                    }
                }
            );
        }))

    }


    applyCallback(startDate, endDate) {

        let Sdate1 = moment(startDate).format('DD MMM, YYYY');
        let Edate2 = moment(endDate).format('DD MMM, YYYY');
        this.setState({
            valuedate: Sdate1 + " " + Edate2,
            startDate: Sdate1,
            isPageLoad: true,
            endDate: Edate2
        })

        this.getData(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
    }


    tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }

        }).join('&');

        this.getData(queryString);
    }

    getDataUpdate() {
        // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

        this.getData(moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'))
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
                    <h4>Bets Per Day</h4>
                    < Card >
                        <CardBody >
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
                            <div className="panel-body" >
                                {this.state.isShowError ?
                                    <div className="alert alert-success" > {this.state.statusMessage}
                                    </div> : null
                                }
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