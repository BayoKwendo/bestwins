import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col, Button } from 'reactstrap';
import { baseURL, CONFIG } from '../../configs/exports';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

export class Statement extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "id",
                TrOnlyClassName: 'tsc',
                text: "id",
                className: "tsc",
                align: "left"
            },
            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "Time",
                className: "tsc",
                align: "left"
            },

            {
                key: "narrative",
                TrOnlyClassName: 'tsc',
                text: "Narrative",
                className: "tsc",
                align: "left"
            },

            {
                key: "mamount",
                TrOnlyClassName: 'tsc',
                text: "Amount",
                className: "tsc",
                align: "left"
            },

            {
                key: "mbalance",
                text: "Balance",
                TrOnlyClassName: 'tsc',
                className: "tsc",
                align: "left",
            }

        ];
        this.config = {
            key_column: "tsc",
            length_menu: [10, 20, 50],
            show_filter: false,
            show_pagination: true,
            pagination: 'advance',
            page_size: 10,
            show_length_menu: true,
            language: {
                loading_text: "Please be patient while data loads...",
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
    }


    componentDidMount() {
        this.getData();
    }

    getData = (queryString = "") => {
        this.setState({
            isLoading: true,
        })
        let axiosConfig = CONFIG;
        let url = baseURL + "getcustomerlog?mobile=" + localStorage.getItem("phone") + '&' + queryString
        console.log("query", url);

        axios.all([
            axios.get(url, axiosConfig),
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data.data,
                total: branchResponse.data.total,
                isLoading: false,
            }, function () {

                var data = [];

                for (let i = 0; i < this.state.admins.length || 0; i++) {
                    let mail;
                    let mbalance;


                    mail = { mamount: this.state.admins[i].amount.toString() };

                    if (this.state.admins[i].balance === null) {
                        mbalance = { mbalance: "____" };
                    } else {
                        mbalance = { mbalance: this.state.admins[i].balance.toString() };
                    }


                    let date = { dates: moment.utc(this.state.admins[i].date_created).format("DD-MMM-yyyy HH:mm:ss") };

                    data.push(Object.assign(mail, date, mbalance,  this.state.admins[i]));
                    this.setState({
                        data: data
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
    render() {
        return (
            <div>
                <>
                    <Col md={12}>
                        <h4>Customer Transactions</h4><br />
                    </Col>
                    <Col md={12} lg={12} >
                        <Card>
                            <CardBody >
                                <div className="panel-body" >
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Link to="/userdetail">
                                                <Button className="pull-right"
                                                    color="primary" outline>Go Back</Button><br /> <br /><br />
                                            </Link>
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