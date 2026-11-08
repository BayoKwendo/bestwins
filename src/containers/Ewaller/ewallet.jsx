import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { baseURL } from '../../configs/exports';
import * as moment from 'moment';
import { CONFIG } from '../../configs/exports';

export class EWallet extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            key: "idx",
            text: "#",
            TrOnlyClassName: 'tsc',
            className: "tsc",
            align: "left",
        },
        {
            key: "dates2",
            TrOnlyClassName: 'tsc',
            text: "Date",
            className: "tsc",
            align: "left"
        },
        {
            key: "_ewalletBalance",
            TrOnlyClassName: 'tsc',
            text: "Wallet Balance",
            className: "tsc",
            align: "left"
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
                loading_text: "Please be patient while data loads..."
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
        axios.all([
            axios.get(baseURL + "wallet", CONFIG),
        ]).then(axios.spread((branchResponse) => {
            this.setState({
                admins: branchResponse.data,
                isLoading: false
            },
                function () {
                    var data = [];
                    for (let i = 0; i < this.state.admins.length; i++) {
                        let index = { idx: i + 1 };
                        let dates = { dates2: moment(this.state.admins[i]._date).format('DD MMM, YYYY') };

                        data.push(Object.assign(index, dates, this.state.admins[i]));
                        this.setState({
                            data: data
                        })
                    }
                }
            );
        }))
    }
    render() {
        // console.log("Load", isLoading);
        return (
            <div style={{ marginTop: '-20px' }} >
                < >
                        < Card >
                            <CardBody >
                                <div className="panel-body" >

                                    <div>
                                        <h3>EWallet</h3><br /><br />
                                    </div>

                                    {this.state.isShowError ?
                                        <div className="alert alert-success" > {this.state.statusMessage}
                                        </div> : null
                                    }
                                    < ReactDatatable config={this.config}
                                        records={this.state.data}
                                        id="tsc"
                                        columns={this.columns}
                                        loading={this.state.isLoading}
                                        extraButtons={this.extraButtons}
                                    /> </div>
                            </CardBody>

                        </Card>
                </>
            </div>

        )
    }
}