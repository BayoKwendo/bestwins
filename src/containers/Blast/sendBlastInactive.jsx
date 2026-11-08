import * as React from 'react';
import '../../_assets/css/file.css';
import axios from 'axios';
import { Card, CardBody, Col, Button } from 'reactstrap';
import $ from 'jquery'
import * as moment from 'moment';
import { baseURL } from '../../configs/exports';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'

window.$ = window.jQuery = require('jquery')
// require("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js")
require('../../_assets/jss/sms_counter.js')

export class SendBlastIanctive extends React.Component {

    constructor(props) {
        super(props)
        this.applyCallback = this.applyCallback.bind(this);
        this.state = {
            showComponent: false,
            hideComponent: true,
            selected: [],
        };
        this._onButtonClick = this._onButtonClick.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
        this.onSMSGetCount = this.onSMSGetCount.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        let now = new Date();
        let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
        let end = moment(start).add(1, "days").subtract(1, "seconds");

        this.state = {
            alert_color: '',
            isLoading: false,
            isShowError: false,
            name: '',
            succesStatus: false,
            statusMessage: '',
            start: start,
            end: end,

            multiValue: [],
            startDate: moment(new Date()).format('YYYY-MM-DD') + " 00:00:00",
            endDate: moment(new Date()).format('YYYY-MM-DD') + " 23:59:59",
            valuedate: "Today",
            showError: false,
            terms3: [
                {
                    label: 'Almost Out',
                    value: 'Almost Out',
                },
                {
                    label: 'First Grade',
                    value: 'First Grade',
                },
                {
                    label: 'Loyal',
                    value: 'Loyal',
                },
                {
                    label: 'Likely to be Loyal',
                    value: 'Likely to be Loyal',
                },
                {
                    label: 'Require Assistance',
                    value: 'Require Assistance',
                },
                {
                    label: 'Getting Less Frequent',
                    value: 'Getting Less Frequent',
                },
                {
                    label: "Don't Show Up at All",
                    value: "Don't Show Up at All",
                }
            ],
            terms_channel: [
                {
                    label: 'LUCKYBOX 1000',
                    value: '23401220000030403',
                },
                {
                    label: 'LUCKYBOX 500',
                    value: "23401220000030397"
                },
                {
                    label: 'LUCKYBOX `100',
                    value: '23401220000030393',
                },
                {
                    label: 'LUCKYBOX 50',
                    value: "23401220000030392"
                }
            ]
        }
    }
    componentDidMount() {
        $('#message').countSms('#sms-counter');
    }

    handleChangeChannel = value => {
        if (value != null) {
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
    onSubmit() {
        let formData = {
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
            "message": this.state.message.replaceAll("’", "'"),
        }


        // alert(JSON.stringify(formData))

        this.setState({ isLoading: true, succesStatus: true });
        axios.post(baseURL + 'sms_inactive', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then((response) => {

            alert(JSON.stringify(response.data.totalsms))
            console.log('bayoo', JSON.stringify(response.data))
            if (response.data.status) {
                this.setState({ statusMessage: "Bulk sms send Successfully", isShowError: true, succesStatus: false, alert_color: "alert alert-success", isLoading: false });
                localStorage.setItem("balstmessage", response.data.totalsms)
                localStorage.setItem("submessage", response.data.subscriptions)
                window.setTimeout(function () {
                    window.location.href = "/find_user";
                }, 2000);
            } else {

                this.setState({ statusMessage: "Bulk sms send Successfully", isShowError: true, succesStatus: false, alert_color: "alert alert-success", isLoading: false });
                window.setTimeout(function () {
                    window.location.href = "/find_user";
                }, 2000);
            }

        }, error => {

            this.setState({ statusMessage: "Bulk sms send Successfully", isShowError: true, succesStatus: false, alert_color: "alert alert-success", isLoading: false });
            window.setTimeout(function () {
                window.location.href = "/find_user";
            }, 2000);
        });
        // alert("Correct")
        // }
        // else {
        //     alert("Ensure the number of the last day is greater than the initial date")
        // }
    }


    onSMSGetCount(e) {
        e.preventDefault();

        this.setState({ isLoading: true, succesStatus: false });

        axios.get(baseURL + 'smscount_inactive?startDate='+this.state.startDate+"&endDate="+this.state.endDate, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then((response) => {
            this.setState({ isLoading: false, succesStatus: false });
            if (window.confirm('Total counts: ' + JSON.stringify(response.data.total))) {
                this.onSubmit()
            }
            // this.onSubmitblacklist(record)

        }, error => {
            this.setState({ statusMessage: "error", isShowError: true, succesStatus: false, alert_color: "alert alert-danger", isLoading: false });
        });
    }


    Constituency() {
        // eslint-disable-next-line
        return (this.state.type && (this.state.type.length == 0 || this.state.type.length > 0) &&
            this.state.type.map((countyItem, i) =>
                ({ label: countyItem.name, value: countyItem.id })))
    }
    handleMultiChange(option) {

        // alert(JSON.stringify(option))
        this.setState(state => {
            return {
                multiValue: option
            };
        });
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    _onButtonClick() { }
    changeStatus() {
        this.setState({
            isShowError: false
        });
    }

    changeList(setSelected) {
        this.setState({ setSelected });
    }

    applyCallback(startDate, endDate) {
        let Sdate1 = moment(startDate).format('YYYY-MM-DD');
        let Edate2 = moment(endDate).format('YYYY-MM-DD');
        this.setState({
            valuedate: Sdate1 + " " + Edate2,
            startDate: Sdate1 + " 00:00:00",
            isPageLoad: true,
            endDate: Edate2 + " 23:59:59"
        })

        // this.getData2(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'));
    }


    render() {
        const { hideComponent, succesStatus } = this.state;

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
            <div className="pcoded-main-container">


                {succesStatus === true ?
                    <h4>Sending...... please be patient</h4>
                    :
                    <>
                        {!hideComponent && (
                            <>

                                <Col className="col-md-10 offset-md-1">


                                    <Card>
                                        <CardBody><br />
                                            <form onSubmit={this.onSMSGetCount}>
                                                <h4 className="form-label">Send blast to Customers who have never played</h4><br />
                                                <br />
                                                <label>Date Joined</label>
                                                                   
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="col-md-8">
                                                            <div className="row">
                                                                <div className="col-8">
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
                                                                <div className="col-4 float-left">

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
                                                {/* <div className="col-md-8">

                                                    <Select
                                                        isClearable
                                                        options={this.state.terms_channel}
                                                        // onInputChange={this.loadOptions}
                                                        placeholder="Select Target"
                                                        autosize={true}
                                                        onChange={this.handleChangeChannel}
                                                        // isLoading={this.state.isLoading}
                                                        // noOptionsMessage={() => 'nothing found'}
                                                        // loadingMessage={() => 'searching...'}   //minor type-O here
                                                        className="selected"
                                                        menuPortalTarget={document.body}
                                                        name="namffe"
                                                    /><br />
                                                </div>
                                                <br />

                                                <div className="col-md-8">
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
                                                {/* <h5><b>BETWEEN</b></h5> <br />

                                                <div className="form-group">
                                                    <input id="input" type="number" className="form-control input-md"
                                                        name="days" maxLength="1000" required placeholder="Enter Days"
                                                        value={this.state.days} onChange={this.handleChange} />
                                                </div>

                                                <h4><b>AND</b></h4><br />

                                                <div className="form-group">
                                                    <input id="input" type="number" className="form-control input-md"
                                                        name="last_days" maxLength="1000" required placeholder="Enter Days"
                                                        value={this.state.last_days} onChange={this.handleChange} />
                                                </div> */}


                                                <br />
                                                <h4>Create Message</h4>
                                                {this.state.isShowError ? <div className={this.state.alert_color}
                                                    style={{ fontSize: '15px' }}>
                                                    {this.state.statusMessage}</div> : null}
                                                <br></br>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-8" >
                                                            <textarea name="message" style={{ paddingTop: '20px' }} onChange={this.handleChange}
                                                                className="col-md-12" placeholder="type your message here"
                                                                id="message" cols="col-md-1" rows="20"></textarea>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <ul id="sms-counter">
                                                                <li>Length: <span class="length"></span></li>
                                                                <li>SMS: <span class="messages"></span></li>
                                                                <li>Per Message: <span class="per_message"></span></li>
                                                                <li>Remaining: <span class="remaining"></span></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div><br />
                                                <div className="col-md-12">
                                                    <Button type="submit" color="primary" outline className="btn-paypal btn-lg pull-right
                                                        " >
                                                        {this.state.isLoading ? "Please Wait..." : "Send "}
                                                        <i className="fa fa-refresh"></i></Button> &nbsp;&nbsp;&nbsp;
                                                </div>
                                            </form>

                                        </CardBody>
                                    </Card>
                                </Col>
                            </>

                        )
                        }
                    </>
                }

            </div>
        )

    }


}
