import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col } from 'reactstrap';
import { baseURL } from '../../configs/exports';
import { TOKEN } from '../../configs/exports';
import * as moment from 'moment';

export class DepositRequests extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [

            {
                key: "tran_id",
                TrOnlyClassName: 'tsc',
                text: "Transaction ID",
                className: "tsc",
                align: "left"
            },

            {
                key: "msisdn",
                TrOnlyClassName: 'tsc',
                text: "Phone",
                className: "tsc",
                align: "left"
            },

            {
                key: "amount",
                TrOnlyClassName: 'tsc',
                text: "Amount",
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
                key: "description",
                TrOnlyClassName: 'tsc',
                text: "Description",
                className: "tsc",
                align: "left"
            },

            {
                key: "dates",
                TrOnlyClassName: 'tsc',
                text: "Date Created",
                className: "tsc",
                align: "left"
            }
        ];
        this.config = {
            key_column: "tsc",
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            page_size: 10,
            show_length_menu: true,
            language: {
                loading_text: "Please be patient while data loads...",
                filter: "Enter Phone",
                no_data_text: "No data was found",
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
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
                "Authorization": TOKEN
            }
        };
        let url = baseURL + "depositrequestes?" + queryString
        // console.log("query", url);
        // console.log("token", TOKEN)
        axios.all([
            axios.get(url, axiosConfig)
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data,
                isLoading: false,
            },
                function () {
                    var data = [];
                    console.log("BUG", this.state.admins)

                    for (let i = 0; i < (this.state.admins.length || 0); i++) {
                        this.setState({
                            total: this.state.admins[0].total_page
                        })
                        let mail;
                        let mbalance;
                        let phone;

                        if (this.state.admins[i].email == null) {
                            mail = { mail: "_" };
                        } else {
                            mail = { mail: this.state.admins[i].email };
                        }


                        if (this.state.admins[i].msisdn === null) {
                            phone = { phone: "_" };
                        } else {
                            phone = { phone: this.state.admins[i].msisdn };
                        }

                        if (this.state.admins[i].balance === 0) {
                            mbalance = { mbalance: "0.0" };
                        } else {
                            mbalance = { mbalance: this.state.admins[i].balance };
                        }

                        let date = { dates: moment.utc(this.state.admins[i].date_created).format('YYYY-MM-DD HH:mm:ss') };
                        data.push(Object.assign(date, phone, mail, mbalance, this.state.admins[i]));
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
            <div >
                < >
                    <Col md={12}>
                        <h3>Deposit Requests</h3>

                    </Col>
                    < Col md={12} lg={12} >
                        < Card >
                            <CardBody >
                                <div className="panel-body" >

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