import React, { Fragment } from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col } from 'reactstrap';
import { baseURL } from '../../configs/exports';
import * as moment from 'moment';
import { CONFIG, formatCurrency } from '../../configs/exports';
import { LedgerLogs } from './LedgerLogs';

export class Ledger extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                key: "dates2",
                TrOnlyClassName: 'tsc',
                text: "Date",
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
                key: "mbalance",
                TrOnlyClassName: 'tsc',
                text: "Balance",
                className: "tsc",
                align: "left"
            },
            {
                key: "action",
                text: "Details",
                TrOnlyClassName: 'cell',
                className: "cell",
                width: 250,
                sortable: false,
                cell: record => {
                    return (
                        <Fragment className="center" >
                            <button className="btn btn-primary"
                                title="More"
                                style={
                                    { marginRight: '10px' }}
                                onClick={
                                    () => { this.toggleModalCreate(record) }} >
                                <span className="" > More <i className="fa fa-plus"></i> </span>
                            </button>

                        </Fragment>
                    );
                }
            },


        ];
        this.config = {
            key_column: "tsc",
            length_menu: [10, 20, 50],
            show_filter: false,
            show_pagination: false,
            pagination: 'basic',
            page_size: 10,
            show_length_menu: false,
            language: {
                loading_text: "Please be patient while data loads...",
                filter: "Enter date (YYYY-MM-DD)",
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

    toggleModalCreate(record) {
        this.setState({
            reocrd_id: record,
            showModal: true
        });
    };

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({
            isLoading: true,
        })

        let url = baseURL + "legder"
        axios.all([
            axios.get(url, CONFIG),
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data,
                isLoading: false,
            },
                function () {
                    var data = [];
                    if (this.state.admins.length > 0) {
                        for (let i = 0; i < this.state.admins.length; i++) {
                            let dates = { dates2: moment(this.state.admins[i].date_modified).format('YYYY-MM-DD') };
                            let mbalance = { mbalance: formatCurrency(this.state.admins[i].balance) };

                            data.push(Object.assign(dates, mbalance, this.state.admins[i]));
                            this.setState({
                                data: data
                            })
                            console.log("bugs", i);
                        }
                    } else {
                        this.setState({
                            data: data,
                            isLoading: false
                        })
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
        // console.log("Load", isLoading);
        return (
            <div style={{ marginTop: '-20px' }} >
                {this.state.showModal === true ?
                    <LedgerLogs record_id={this.state.reocrd_id} />
                    :
                    < >
                        <Col md={12}>
                            <h3>Ledgers</h3>
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
                                            total_record={this.state.data.length}
                                            onChange={this.tableChangeHandler} />
                                    </div>
                                </CardBody>

                            </Card>
                        </Col>
                    </>
                }

            </div>

        )
    }
}
