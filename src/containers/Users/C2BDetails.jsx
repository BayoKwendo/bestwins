import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable'
import axios from 'axios'
import { Card, CardBody } from 'reactstrap'
import { baseURL, CONFIG, formatCurrency } from '../../configs/exports.js'
import * as moment from 'moment'
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Select from 'react-select'
import { HOURS_FROM, HOURS_TO } from "../../configs/exports.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale


export class C2BDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      shortcode: '',
      passkey: '',
      timestamp: moment().format('YYYYMMDDHHmmss'),
      amount: '',
      phone: '',
      callback: '',
      reference: '',
      msisdn: '',
      transaction_desc: '',
      partyA: '',
      party_b: '',
      TransactionType: 'CustomerPayBillOnline',
      b2c_consumer_api: '',
      b2c_secret: '',
      confirmation_url: '',
      validation_url: '',
      response_type: 'Completed'
    }
  }
  componentDidMount() {

  }


  handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      party_b: this.state.party_b,
      shortcode: this.state.shortcode,
      passkey: this.state.passkey,
      callback: this.state.callback,
      transaction_desc: this.state.transaction_desc,
      TransactionType: this.state.TransactionType,
      b2c_consumer_api: this.state.b2c_consumer_api,
      b2c_secret: this.state.b2c_secret,
      confirmation_url: this.state.confirmation_url,
      validation_url: this.state.validation_url,
      response_type: this.state.response_type
    };

    try {
      const response = await axios.post(
        `${baseURL}/create_c2b_audit_trail`,
        payload,
        CONFIG
      );

      alert("Request submitted successfully");
      window.location.href = '/c2b_details'; // Redirect to the same page to refresh data
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert("Failed to submit request");
    }
  };

  render() {


    return (
      <div style={{ marginTop: '-20px' }}>
        <>
          <Card>
            <CardBody>
              <>
                <div className='row'>
                  <div className='col-md-8'>
                    <h3>Add B2C Details</h3>
                  </div>
                </div>
                <br />
                <br />
                <Card className="shadow-sm border-0">
                  <CardBody>
                    <h3 className="mb-4">Configuration</h3>

                    <form onSubmit={this.handleSubmit}>

                      {/* Credentials */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Credentials</h5>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Party B</label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              placeholder="Enter party B"
                              value={this.state.party_b}
                              onChange={(e) => this.setState({ party_b: e.target.value })}
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Shortcode</label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              placeholder="Enter shortcode"
                              value={this.state.shortcode}
                              onChange={(e) => this.setState({ shortcode: e.target.value })}
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Passkey</label>
                            <input
                              type="password"
                              required
                              className="form-control"
                              placeholder="Enter passkey"
                              value={this.state.passkey}
                              onChange={(e) => this.setState({ passkey: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Transaction Details</h5>

                        <div className="row">


                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Transaction Type</label>
                            <select
                              className="form-control"
                              value={this.state.TransactionType}
                              onChange={(e) =>
                                this.setState({ TransactionType: e.target.value })
                              }
                            >
                              <option value="CustomerPayBillOnline">
                                CustomerPayBillOnline
                              </option>
                              <option value="CustomerBuyGoodsOnline">
                                CustomerBuyGoodsOnline
                              </option>
                              <option value="BusinessPayment">
                                BusinessPayment
                              </option>
                              <option value="SalaryPayment">
                                SalaryPayment
                              </option>
                              <option value="PromotionPayment">
                                PromotionPayment
                              </option>
                            </select>
                          </div>

                          <div className="col-md-12 mb-3">
                            <label className="fw-bold">Transaction Description</label>
                            <textarea
                              rows="3"
                              required
                              className="form-control"
                              placeholder="Description of transaction"
                              value={this.state.transaction_desc}
                              onChange={(e) =>
                                this.setState({
                                  transaction_desc: e.target.value
                                })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* API Configuration */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">API Configuration</h5>

                        <div className="row">

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">B2C Consumer API</label>
                            <input
                              type="text"
                              required
                              className="form-control"
                              placeholder="Consumer Key"
                              value={this.state.b2c_consumer_api}
                              onChange={(e) =>
                                this.setState({
                                  b2c_consumer_api: e.target.value
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">B2C Secret</label>
                            <input
                              type="password"
                              required
                              className="form-control"
                              placeholder="Consumer Secret"
                              value={this.state.b2c_secret}
                              onChange={(e) =>
                                this.setState({
                                  b2c_secret: e.target.value
                                })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* URLs */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Callback URLs</h5>

                        <div className="row">

                          <div className="col-md-12 mb-3">
                            <label className="fw-bold">Callback URL</label>
                            <input
                              type="url"
                              required
                              className="form-control"
                              placeholder="https://domain.com/callback"
                              value={this.state.callback}
                              onChange={(e) =>
                                this.setState({
                                  callback: e.target.value
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Confirmation URL</label>
                            <input
                              type="url"
                              required
                              className="form-control"
                              placeholder="https://domain.com/confirmation"
                              value={this.state.confirmation_url}
                              onChange={(e) =>
                                this.setState({
                                  confirmation_url: e.target.value
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Validation URL</label>
                            <input
                              type="url"
                              required
                              className="form-control"
                              placeholder="https://domain.com/validation"
                              value={this.state.validation_url}
                              onChange={(e) =>
                                this.setState({
                                  validation_url: e.target.value
                                })
                              }
                            />
                          </div>

                        </div>
                      </div>


                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                      >
                        Save Configuration
                      </button>

                    </form>
                  </CardBody>
                </Card>
                <br />
                <br />

                <br />
              </>
            </CardBody>
          </Card>
        </>
      </div>
    )
  }
}
