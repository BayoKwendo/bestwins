import React, { Fragment } from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col, Button } from 'reactstrap';
import { baseURL, CONFIG } from '../../configs/exports';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

export class BlackList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "msisdn",
                TrOnlyClassName: 'tsc',
                text: "Phone Numnber",
                className: "tsc",
                align: "left"
            },
            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "Date modified",
                className: "tsc",
            },
            {
                key: "action",
                text: "Options",
                TrOnlyClassName: 'cell',
                className: "cell",
                width: 250,
                sortable: false,
                cell: record => {
                    return (
                        <Fragment className="center" >
                            <button className=" btn-danger"
                                title="Delete details"
                                style={
                                    { marginRight: '10px' }}
                                onClick={
                                    () => { if (window.confirm('Are you sure you want to remove this number from the blacklist record?')) this.onDelete(record) }} >
                                <span className="fa fa-trash dt-icon-btn" > Remove </span>
                            </button>

                        </Fragment>
                    );
                }
            }
        ];
        this.config = {
            key_column: "tsc",
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advances',
            page_size: 10,
            show_length_menu: true,
            language: {
                loading_text: "Please be patient while data loads...",
                filter: "Search Blacklist Number",
                no_data_text: "No data was found"
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
    }

    componentDidMount() {
        this.getData();
    }

    getData = (queryString = "") => {
        this.setState({
            isLoading: true,
        })
        let url = baseURL + "blacklisted?" + queryString
        console.log("query", url);

        axios.all([
            axios.get(url, CONFIG),
            axios.get(baseURL + "blacklistCount", CONFIG),
        ]).then(axios.spread((branchResponse, entityResponse,) => {
            this.setState({
                admins: branchResponse.data,
                mdata: entityResponse.data.customer,
                isLoading: false,
            },
                function () {
                    var data = [];
                    console.log("BUG", this.state.admins)
                    if (this.state.admins.length > 0) {
                        for (let i = 0; i < this.state.admins.length; i++) {
                            let date = { dates: moment(this.state.admins[i].date_modified).format('DD MMM, YYYY') };
                            data.push(Object.assign(date, this.state.admins[i]));
                            this.setState({
                                data: data,
                                isLoading: false,
                            })
                            console.log("bugs", i);
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


    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onDelete(record) {
        axios.delete(baseURL + "deleteBlackListed/" + record.msisdn, CONFIG).then(response => {
            // console.log("true", response.data)
            if (response.data.status) {
                // console.log("records", formData)
                this.setState({ statusMessage: response.data.message, isShowError: true, isLoading: false }, function () {
                    window.setTimeout(() => {
                        this.getData();
                    }, 2000);
                });
            } else {
                this.setState({ statusMessage: response.data.message, isShowError: true, isLoading: false });
            }
        }, error => {
            this.setState({ statusMessage: JSON.stringify(error), isShowError: true, isLoading: false });
        });
    }

    render() {
        // console.log("Load", isLoading);
        return (
            <div>
                < >
                    <Col md={12}>
                        <h3>Blacklisted  Customers</h3><br />

                    </Col>
                    < Col md={12} lg={12} >
                        < Card >
                            <CardBody >
                                <div className="panel-body" >

                                    {/* <Link to="/addblacklist">
                                        <Button className="pull-right"
                                            color="primary" outline> Add Person </Button><br /> <br />
                                    </Link> */}
                                    
                                    <div>
                                        Total Number of Blacklisted: <b>{this.state.mdata}</b>
                                        <br />
                                    </div>
                                    {this.state.showError ? <div style={{ color: 'red' }}>
                                        {this.state.statusMessage}

                                    </div> : null}<br></br>

                                    {this.state.isShowError ? (
                                        <div
                                            color="success"
                                            style={{ fontSize: "13px", color: "green" }}>
                                            {this.state.statusMessage}
                                        </div>

                                    ) : null}<br></br>
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
                    </Col>
                </>
            </div>

        )
    }
}