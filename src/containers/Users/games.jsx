import React, { Fragment } from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Button } from 'reactstrap';
import { baseURL, CONFIG, formatCurrency } from '../../configs/exports';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

export class Games extends React.Component {
    constructor(props) {
        super(props);
        this.submitNewUpdate = this.submitNewUpdate.bind(this);
        this.columns = [
            {
                key: "bet_id",
                TrOnlyClassName: 'tsc',
                text: "Bet ID",
                className: "tsc",
                align: "left"
            },
            {
                key: "mstake",
                TrOnlyClassName: 'tsc',
                text: "Stake",
                className: "tsc",
                align: "left"
            },
            {
                key: "mreserved_amount",
                TrOnlyClassName: 'tsc',
                text: "Reserved Amount",
                className: "tsc",
                align: "left"
            },
            {
                key: "choices",
                TrOnlyClassName: 'tsc',
                text: "Choices",
                className: "tsc",
                align: "left"
            },
            {
                key: "status",
                TrOnlyClassName: 'tsc',
                text: "Status",
                className: "tsc",
                align: "left",
                cell: record => {
                    return (
                        <Fragment className="center" style={{ fontSize: "1em", color: "white" }}>
                            {record.status === 'won' ?
                                < span class="badge-success" style={{ fontSize: "14px", borderRadius: "5px", padding: "2px", color: "white" }} >
                                    Won
                                </ span>
                                : null}

                            {record.status === 'lost' ?
                                < span class="badge-danger" style={{ fontSize: "14px", borderRadius: "5px", padding: "2px", color: "white" }}>
                                    Lost
                                </ span>
                                : null}
                        </Fragment >
                    );
                }
            },

            {
                key: "result",
                TrOnlyClassName: 'tsc',
                text: "Result",
                className: "tsc",
                align: "left"
            },

            {
                key: "category",
                TrOnlyClassName: 'tsc',
                text: "Category",
                className: "tsc",
                align: "left"
            },
            {
                key: "dates",
                text: "Date",
                TrOnlyClassName: 'tsc',
                className: "tsc",
                align: "left"
            },

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
        // alert(TOKEN)
        let axiosConfig = CONFIG;
        let url = baseURL + "games?mobile=" + localStorage.getItem("customerID") + '&' + queryString
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
                    // eslint-disable-next-line

                    let mreserved_amount = { mreserved_amount: formatCurrency(this.state.admins[i].reserved_amount) }

                    let mstake = { mstake: formatCurrency(this.state.admins[i].stake) }

                    let mchance = { mchance: this.state.admins[i].chance.toString() }

                    let date = { dates: moment(this.state.admins[i].Date).format("DD-MMM-yyyy HH:mm:ss") };



                    data.push(Object.assign(mchance, mreserved_amount, mstake, date, this.state.admins[i]));
                    this.setState({
                        data: data
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

    editRecord(record) {
        console.log("Edit Record", record);
        this.setState({
            showModal: true,
            hideComponent: true,
        })
    }

    submitNewUpdate(e) {
        e.preventDefault();
        const userInputData = {
            "branch_name": this.state.branch_name,
            "branch_description": this.state.branch_description,
        }
        console.log("reecrd", userInputData);
        const config = CONFIG;
        console.log("DATA", this.state.admin);
        this.setState({ isLoading: true })

        axios.put(baseURL + "branches/" + this.state.admin, userInputData, config).then(response => {
            if (response.data.status) {
                this.setState({ statusMessage: response.data.status_message, isShowError: true, isLoading: false });
            } else {
                this.setState({ statusMessage: response.data.status_message, showError: true, isShowError: false, isLoading: false });
            }
        }, error => {
            this.setState({ statusMessage: JSON.stringify(error), isShowError: false, showError: true, isLoading: false });
        });
        this.setState({ school_name: '', school_code: '', postal_address: '' })

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    deleteRecord(record) {
        console.log("Delete Record", record);

        this.setState({
            school_id: record.id,
        });
        const config = CONFIG
        axios.delete(baseURL + "branches/" + record.id, config).then(response => {

            if (response.data.status) {
                this.setState({ statusMessage: response.data.status_message, isShowError: true, isLoading: false });
                window.setTimeout(function () {
                    window.location.reload();
                }, 1000);

            } else {

                this.setState({ statusMessage: response.data.status_message, isShowError: true, isLoading: false });
            }

        }, error => {
            this.setState({ statusMessage: JSON.stringify(error), isShowError: true, isLoading: false });
        });
    }

    render() {
        // console.log("Load", isLoading);
        return (
            <div style={{ marginTop: '-20px' }} >
                < >
                        < Card >
                            <CardBody >
                                <h4>Games</h4>

                                <div className="panel-body" >
                                    <div className="row">

                                        <div className="col-md-12">
                                            <Link to="/userdetail">
                                                <Button className="pull-right"
                                                    color="primary" outline>Go Back?</Button><br /> <br /><br />
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
                </>
            </div>

        )
    }
}