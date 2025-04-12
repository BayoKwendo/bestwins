
import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col, Button } from 'reactstrap';
import { baseURL, CONFIG } from '../../configs/exports';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import { FormControl } from 'react-bootstrap'

export class BoundMessages extends React.Component {
    constructor(props) {
        super(props);
        this.applyCallback = this.applyCallback.bind(this);

        this.columns = [

            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "TimePlayed",
                className: "tsc",
                align: "left"
            },
            {
                key: "message",
                TrOnlyClassName: 'tsc',
                text: "SMSIN",
                className: "tsc",
                align: "left"
            },


            {
                key: "response",
                TrOnlyClassName: 'tsc',
                text: "SMSOUT",
                className: "tssc",
                align: "left"
            },
            {

                key: "mail",
                TrOnlyClassName: 'tsc',
                text: "Response sent",
                className: "tsc",
                align: "left"
            },
            // {
            //     key: "action",
            //     text: "Options",
            //     TrOnlyClassName: 'cell',
            //     className: "cell",
            //     width: 250,
            //     sortable: false,
            //     cell: record => {
            //         return (
            //             <Fragment className="center" >
            //                 <button className=" btn-primary"
            //                     title="resend details"
            //                     style={
            //                         { marginRight: '10px' }}
            //                     onClick={
            //                         () => { if (window.confirm('Confirm if you want resend?')) this.onSubmitSubmit(record) }} >
            //                     <span className="" > Resend </span>
            //                 </button>

            //             </Fragment>
            //         );
            //     }
            // }
        ];
        this.config = {
            key_column: "tsc",
            length_menu: [100, 150, 200, 300, 500],
            show_filter: false,
            show_pagination: true,
            pagination: 'advance',
            page_size: 100,
            button: {
                excel: true,
                print: true,
                csv: true
            },
            show_length_menu: true,
            language: {
                loading_text: "Please be patient while data loads...",
                filter: "Enter ID...",
                no_data_text: "No message for this customer today",
                pagination: {
                    next: <span>&#9658;</span>,
                    previous: <span>&#9668;</span>
                    // next
                    // previous
                }
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
        localStorage.setItem("STARTDATE", moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)))
        localStorage.setItem("ENDDATE", moment(start).add(1, "days").subtract(1, "seconds"))

        this.state = {
            start: start,
            end: end,
            isPageLoad: true,
        }
    }

    componentDidMount() {
        // this.getData();
        this.setState({
            valuedate: "Today"
        })
        let queryString = "";
        // eslint-disable-next-line
        this.getData(queryString, moment(new Date()).format('YYYY-MM-DD') + " 00:00:00", moment(new Date()).format('YYYY-MM-DD' + " 23:59:59"))

    }


    onSubmitSubmit(record) {
        // record.preventDefault();

        let formData = {
            "msisdn": record.MobileNo,
            "message": record.response
        }

        this.setState({ isLoading3: true });
        axios.post(baseURL + 'smsresponse', formData, CONFIG).then((response) => {

            if (response.data.status) {
                this.setState({ statusMessage: response.data.message, showError: false, isShowError: true });
                window.scrollTo(0, 0)
                window.setTimeout(() => {
                    this.setState({ isShowError: false, isOpenModel: false, isLoading3: false });
                    // alert(response.data.message)
                }, 2000);
            } else {
                this.setState({ statusMessage: response.data.message, showError: true, isShowError: false, });
                window.setTimeout(() => {
                    this.setState({
                        isLoading3: false,
                        isShowError: false,
                        statusMessage: "",
                        isOpenModel: false,
                        showError: false
                    });
                    alert(response.data.message)
                }, 2000);
            }
        }).catch((error) => {
            console.log('bayoo', error)
            this.setState({
                statusMessage: error.response === undefined ? "Check your Internet" : error.response.data.message, showError: true, isShowError: false
            });
            window.setTimeout(() => {
                this.setState({
                    isLoading3: false,
                    isShowError: false,
                    showError: false,
                    errorShow: false
                });

                alert(this.state.statusMessage)
            }, 2000);
        })
    }

    getData = (queryString, startDate, endDate) => {
        this.setState({
            isLoading: true,
        })
        let axiosConfig = CONFIG;

        let url = baseURL + "outbound?mobile=" + localStorage.getItem("phone") + `&startDate="${startDate}"&endDate="${endDate}"&` + queryString
        // alert(url)
        axios.get(url, axiosConfig, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then((branchResponse) => {
                this.setState({
                    admins: branchResponse.data,
                    total: branchResponse.data.length,
                    isLoading: false,
                }, function () {
                    var data = [];
                    if (branchResponse.data && this.state.admins.length > 0) {
                        for (let i = 0; i < this.state.admins.length; i++) {
                            let mail;
                            let mbalance;
                            if (this.state.admins[i].sent == null) {
                                mail = { mail: "_" };
                            } else {

                                if (this.state.admins[i].sent.toString() === "1") {
                                    mail = { mail: "Yes" }
                                } else {

                                    mail = { mail: "No" }
                                }
                            }
                            if (this.state.admins[i].balance === 0) {
                                mbalance = { mbalance: "0.0" };
                            } else {
                                mbalance = { mbalance: this.state.admins[i].balance };
                            }
                            let date = { dates: moment(this.state.admins[i].in_time).utc().format("DD-MMM-yyyy HH:mm:ss") };
                            let date1 = { dates1: moment(this.state.admins[i].out_time).utc().format("DD-MMM-yyyy HH:mm:ss") };

                            data.push(Object.assign(mail, mbalance, date, date1, this.state.admins[i]));
                            this.setState({
                                data: data
                            })

                            console.log("bugs", data);
                        }
                    } else {
                        this.setState({
                            data: data
                        })
                    }


                }
                );
            })
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
        });

        let queryString = "";
        this.getData(queryString, moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'));
    }



    tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }

        }).join('&');
        // eslint-disable-next-line
        this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD' + " 00:00:00"), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD' + " 23:59:59"))
    }


    getDataUpdate() {
        let queryString = ("filter_value=&page_number=1&page_size=20&sort_order=false")
        // eslint-disable-next-line
        this.getData(queryString, moment(new Date()).format('YYYY-MM-DD') + " 00:00:00", moment(new Date()).format('YYYY-MM-DD' + " 23:59:59"))
    }

    render() {
        // console.log("Load", isLoading);

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
            <div>
                <>
                    < Col md={12} lg={12} >
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
                                    <div className="row">
                                        <div className="col-6">
                                            <h4>All Customer Messages ({localStorage.getItem("phone")})</h4><br />

                                        </div>
                                        <div className="col-md-6">
                                            <Link to="/userdetail">
                                                <Button className="float-right"
                                                    color="primary" outline><i className="fa  fa-arrow-left"></i> Back</Button><br /> <br /><br />
                                            </Link>
                                            <br />
                                        </div>

                                    </div>

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
                                        total_record={this.state.total}
                                        onChange={this.tableChangeHandler} />
                                </div>
                            </CardBody>

                        </Card>
                    </Col>
                </>
            </div>

        )
    }
}