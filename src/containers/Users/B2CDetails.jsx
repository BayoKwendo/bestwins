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


export class B2CDetails extends React.Component {
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
      partyB: '',
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
      initiatorName: this.state.initiatorName,
      initiatorPassword: this.state.initiatorPassword,

      shortcode: this.state.shortcode,
      security_credential: this.state.security_credential,

      queue_timeout_URL: this.state.queue_timeout_URL,
      result_URL: this.state.result_URL,

      b2c_consumer_api: this.state.b2c_consumer_api,
      b2c_secret: this.state.b2c_secret
    };

    try {
      const response = await axios.post(
        `${baseURL}/create_b2c_audit_trail`,
        payload,
        CONFIG
      );

      alert("B2C Request submitted successfully");

      // FIXED redirect (correct page)
      window.location.href = '/b2c_details';

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
          <div style={{ marginTop: '-20px' }}>
            <Card>
              <CardBody>

                <div className='row'>
                  <div className='col-md-8'>
                    <h3>Add B2C Details</h3>
                  </div>
                </div>

                <br />

                <Card className="shadow-sm border-0">
                  <CardBody>

                    <h3 className="mb-4">B2C Configuration</h3>

                    <form onSubmit={this.handleSubmit}>

                      {/* INITIATOR DETAILS */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Initiator Details</h5>

                        <div className="row">

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Initiator Name</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={this.state.initiatorName}
                              onChange={(e) =>
                                this.setState({ initiatorName: e.target.value })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Initiator Password</label>
                            <input
                              type="password"
                              className="form-control"
                              required
                              value={this.state.initiatorPassword}
                              onChange={(e) =>
                                this.setState({ initiatorPassword: e.target.value })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* CORE DETAILS */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Core Configuration</h5>

                        <div className="row">

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Shortcode</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={this.state.shortcode}
                              onChange={(e) =>
                                this.setState({ shortcode: e.target.value })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Security Credential</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={this.state.security_credential}
                              onChange={(e) =>
                                this.setState({ security_credential: e.target.value })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* CALLBACK CONFIG */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">Callback Configuration</h5>

                        <div className="row">

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Queue Timeout URL</label>
                            <input
                              type="url"
                              className="form-control"
                              required
                              value={this.state.queue_timeout_URL}
                              onChange={(e) =>
                                this.setState({ queue_timeout_URL: e.target.value })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Result URL</label>
                            <input
                              type="url"
                              className="form-control"
                              required
                              value={this.state.result_URL}
                              onChange={(e) =>
                                this.setState({ result_URL: e.target.value })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* API CREDENTIALS */}
                      <div className="border rounded p-3 mb-4">
                        <h5 className="mb-3 text-primary">API Credentials</h5>

                        <div className="row">

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Consumer API Key</label>
                            <input
                              type="text"
                              className="form-control"
                              required
                              value={this.state.b2c_consumer_api}
                              onChange={(e) =>
                                this.setState({ b2c_consumer_api: e.target.value })
                              }
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="fw-bold">Consumer Secret</label>
                            <input
                              type="password"
                              className="form-control"
                              required
                              value={this.state.b2c_secret}
                              onChange={(e) =>
                                this.setState({ b2c_secret: e.target.value })
                              }
                            />
                          </div>

                        </div>
                      </div>

                      {/* SUBMIT */}
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                      >
                        Save B2C Configuration
                      </button>

                    </form>

                  </CardBody>
                </Card>

              </CardBody>
            </Card>
          </div>
        </>
      </div>
    )
  }
}
