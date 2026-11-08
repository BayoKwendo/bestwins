import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody, Col } from 'reactstrap';
import { baseURL, CONFIG } from '../../configs/exports';

export class AverageBet extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
           
            {
                key: "DATE",
                TrOnlyClassName: 'tsc',
                text: "Date",
                className: "tsc",
                align: "left"
            },
            {
                key: "Total_Bets",
                TrOnlyClassName: 'tsc',
                text: "Total Bets",
                className: "tsc",
                align: "left"
            },
            {
                key: "Customers",
                TrOnlyClassName: 'tsc',
                text: "Customers",
                className: "tsc",
                align: "left"
            },
            {
                key: "Average_Bets",
                TrOnlyClassName: 'tsc',
                text: "Average Bets",
                className: "tsc",
                align: "left"
            },

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

    componentDidMount() {
        this.getData();
    }
    getData = (queryString = "") => {
        this.setState({
            isLoading: true,
        })
        let url = baseURL + "getAverage?" + queryString
        console.log("query", url);

        axios.all([
            axios.get(url, CONFIG),
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data,
                isLoading: false,
            },
                function () {
                 
                    var data = [];
                        for (let i = 0; i < this.state.admins.length; i++) {
                            console.log("BUG", this.state.admins[i])

                            this.setState({
                                total: this.state.admins[0].total_page
                            })

                            // if (this.state.admins[i].BET_TYPE == null) {
                            //     bet_type = { BET_TYPE: "_" };
                            // } else {
                            //     bet_type = { BET_TYPE: this.state.admins[i].BET_TYPE };
                            // }
                            data.push(Object.assign(this.state.admins[i]));
                            this.setState({
                                data: data,
                                isLoading: false
                            })
                            console.log("bugs", i);
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
            <div >
                < >
                <Col md={12}>
                        <h3>Average Bets</h3><br />

                    </Col>
                    < Col md={12} lg={12} >
                        < Card >
                            <CardBody >
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
                                        total_record={this.state.total}
                                        onChange={this.tableChangeHandler} />  </div>
                            </CardBody>

                        </Card>
                    </Col>
                </>
            </div>

        )
    }
}