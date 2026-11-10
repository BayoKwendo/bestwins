import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable'
import axios from 'axios'
import { Card, CardBody } from 'reactstrap'
import { baseURL, CHANNEL, CHANNELTWO, CONFIG, formatCurrency } from '../../configs/exports.js'
import * as moment from 'moment'
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Select from 'react-select'
import Modal from 'react-modal'
import { MDBCloseIcon } from 'mdbreact'
import { HOURS_FROM, HOURS_TO } from "../../configs/exports.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale
import './apitable.css'

// long values would stretch the row - clip them, keep the whole thing on hover
const clip = value =>
  value
    ? <span className='api-cell-clip' title={value}>{value}</span>
    : <span className='api-empty'>&mdash;</span>

// styles are passed inline so the modal does not depend on css loaded by another page
const MODAL_STYLE = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1050,
    overflowY: 'auto'
  },
  content: {
    position: 'relative',
    inset: 'auto',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '88vh',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff'
  }
}

const EMPTY_FORM = {
  api_name: '',
  partyB: '',
  shortcode: '',
  passkey: '',
  stk_callback_url: '',
  transaction_desc: '',
  TransactionType: 'CustomerPayBillOnline',
  c2b_consumer: '',
  c2b_secret: '',
  confirmation_url: '',
  validation_url: '',
  response_type: 'Completed'
}

export class C2BDetailTable extends React.Component {
  constructor(props) {
    super(props)
    this.applyCallback = this.applyCallback.bind(this)
    this.columns = [
      {
        key: 'id',
        text: 'ID',
        className: 'tsc api-cell-id',
        align: 'left'
      },
      {
        key: 'api_name',
        text: 'API Name',
        className: 'tsc',
        align: 'left',
        cell: record =>
          record.api_name
            ? <span className='api-name-pill'>{record.api_name}</span>
            : <span className='api-empty'>&mdash;</span>
      },
      {
        key: 'partyB',
        text: 'Party B',
        className: 'tsc api-cell-mono',
        align: 'left'
      },
      {
        key: 'shortcode',
        text: 'Shortcode',
        className: 'tsc api-cell-mono',
        align: 'left'
      },
      {
        key: 'c2b_consumer',
        text: 'Consumer Key',
        className: 'tsc api-cell-mono',
        align: 'left',
        cell: record => clip(record.c2b_consumer)
      },
      {
        key: 'passkey',
        text: 'Pass Key',
        className: 'tsc api-cell-mono',
        align: 'left',
        cell: record => clip(record.passkey)
      },
      {
        key: 'c2b_secret',
        text: 'Secret Key',
        className: 'tsc api-cell-mono',
        align: 'left',
        cell: record => clip(record.c2b_secret)
      },
      {
        key: 'transaction_type',
        text: 'Transaction Type',
        className: 'tsc',
        align: 'left'
      },
      {
        key: 'transaction_desc',
        text: 'Description',
        className: 'tsc',
        align: 'left',
        cell: record => clip(record.transaction_desc)
      },
      {
        key: 'response_type',
        text: 'Response Type',
        className: 'tsc',
        align: 'left'
      },
      {
        key: 'datess',
        text: 'Date',
        className: 'tsc api-cell-date',
        align: 'left'
      },
      {
        key: "action",
        text: "Options",
        TrOnlyClassName: "cell",
        className: "cell",
        width: 170,
        sortable: false,
        cell: (record) => {
          return (
            <div className="d-flex justify-content-center">
              <button
                className="api-btn api-btn-edit"
                title="Edit Record"
                onClick={() => { this.onModify(record) }}
              >
                Edit
              </button>

              <button
                className="api-btn api-btn-delete"
                title="Delete Record"
                style={{ marginLeft: "8px" }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this C2B record?")) {
                    this.onSubmitDelete(record);
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        }
      }

    ];
    this.config = {
      key_column: 'tsc',
      length_menu: [500, 1000, 5000],
      show_filter: false,
      show_pagination: true,
      pagination: 'advance',
      page_size: 500,
      show_length_menu: true,
      language: {
        loading_text: 'Please be patient while data loads...',
        no_data_text: 'No data was found',
        filter: 'Enter date (YYYY-MM-DD)',
        pagination: {
          next: <span>&#9658;</span>,
          previous: <span>&#9668;</span>
          // next
          // previous
        }
      },
      button: {
        excel: false,
        print: false,
        csv: false
      }
    }
    let now = new Date()
    let start = moment(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    )
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let end = moment(start).add(1, 'days').subtract(1, 'seconds')
    this.state = {
      start: start,
      end: end,
      admins: [],
      isLoading: true,
      showModal: false,
      showError: false,
      isShowError: false,
      showComponent: false,
      hideComponent: false,
      data: [],
      total: 0,
      count: 0,
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '23:59',
      isPageLoad: true,
      channel: 395959,
      openForm: false,
      isEdit: false,
      isSaving: false,
      record_id: '',
      ...EMPTY_FORM,
      terms_channel: [
        {
          label: '232929',
          value: '232929'
        },
        {
          label: '395959',
          value: '395959'
        }
      ]
    }
  }

  openAdd = () => {
    this.setState({
      openForm: true,
      isEdit: false,
      record_id: '',
      ...EMPTY_FORM
    })
  }

  // the api returns column names, the form posts the names the api expects
  onModify = record => {
    this.setState({
      openForm: true,
      isEdit: true,
      record_id: record.id,
      api_name: record.api_name || '',
      partyB: record.partyB || '',
      shortcode: record.shortcode || '',
      passkey: record.passkey || '',
      stk_callback_url: record.stk_callback_url || '',
      transaction_desc: record.transaction_desc || '',
      TransactionType: record.transaction_type || 'CustomerPayBillOnline',
      c2b_consumer: record.c2b_consumer || '',
      c2b_secret: record.c2b_secret || '',
      confirmation_url: record.confirmation_url || '',
      validation_url: record.validation_url || '',
      response_type: record.response_type || 'Completed'
    })
  }

  closeForm = () => {
    this.setState({ openForm: false })
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      api_name: this.state.api_name,
      partyB: this.state.partyB,
      shortcode: this.state.shortcode,
      passkey: this.state.passkey,
      stk_callback_url: this.state.stk_callback_url || null,
      transaction_desc: this.state.transaction_desc || null,
      TransactionType: this.state.TransactionType,
      c2b_consumer: this.state.c2b_consumer,
      c2b_secret: this.state.c2b_secret,
      confirmation_url: this.state.confirmation_url || null,
      validation_url: this.state.validation_url || null,
      response_type: this.state.response_type
    };

    if (this.state.isEdit) {
      payload.id = this.state.record_id
    }

    this.setState({ isSaving: true })

    try {
      const response = await axios.post(
        baseURL + (this.state.isEdit ? 'update_c2b_audit_trail' : 'create_c2b_audit_trail'),
        payload,
        CONFIG
      );

      alert(this.state.isEdit ? "Record updated successfully" : "Request submitted successfully");
      window.location.reload();
      console.log(response.data);

    } catch (error) {
      console.error(error);
      this.setState({ isSaving: false })
      alert((error.response && error.response.data && error.response.data.message) || "Failed to submit request");
    }
  };

  onSubmitDelete = async (e) => {

    const payload = {
      id: e.id,
    };

    try {
      const response = await axios.post(
        baseURL + 'delete_c2b_audit_trail',
        payload,
        CONFIG
      );

      alert("Record deleted successfully");
      window.location.reload();
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert((error.response && error.response.data && error.response.data.message) || "Failed to submit request");
    }
  };

  componentDidMount() {
    this.setState({
      startDate: moment(new Date()).format('DD MMM, YYYY'),
      endDate: moment(new Date()).format('DD MMM, YYYY'),
      isPageLoad: true,
      valuedate: 'Today'
    })

    // alert(JSON.stringify(this.props.record_id.id))
    localStorage.setItem("STARTDATE", moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_FROM}:00:00`)
    localStorage.setItem("ENDDATE", moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_TO}:59:59`)
    const startDate = moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_FROM}:00:00`;
    const endDate = moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_TO}:59:59`;


    this.getData(
      '',
      startDate,
      endDate,
      this.state.channel
    )
  }

  getData = (queryString = '', startDate, endDate, channel) => {
    let url = baseURL + `c2b_details?channel=${CHANNELTWO}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`
    this.setState({
      isLoading: true
    })
    // alert(url)
    axios.all([axios.get(url, CONFIG)]).then(
      axios.spread(branchResponse => {
        this.setState(
          {
            admins: branchResponse.data.data,
            isLoading: false
          },
          function () {
            var data = []
            if (this.state.admins.length > 0) {
              for (let i = 0; i < this.state.admins.length; i++) {
                let date = {
                  datess: moment
                    .utc(this.state.admins[i].created_at)
                    .format('YYYY-MM-DD HH:mm:ss')
                }
                data.push(Object.assign(date, this.state.admins[i]))
              }
              this.setState({
                data: data,
              })
            } else {
              this.setState({
                data: data,
                isLoading: false
              })
              console.log('bugs', data)
            }
          }
        )
      })
    )
  }

  applyCallback(startDate, endDate) {
    localStorage.setItem('STARTDATE', moment(startDate).format('YYYY-MM-DD HH:mm:ss'),)
    localStorage.setItem('ENDDATE', moment(endDate).format('YYYY-MM-DD HH:mm:ss'))
    let Sdate1 = moment(startDate).format('DD MMM, YYYY')
    let Edate2 = moment(endDate).format('DD MMM, YYYY')
    this.setState({
      valuedate: Sdate1 + ' ' + Edate2,
      startDate: Sdate1,
      isPageLoad: true,
      endDate: Edate2
    })

    this.getData(
      '',
      moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
      moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
      this.state.channel
    )
  }

  tableChangeHandler = data => {
    let queryString = Object.keys(data)
      .map(key => {
        if (key === 'sort_order' && data[key]) {
          return (
            encodeURIComponent('sort_order') +
            '=' +
            encodeURIComponent(data[key].order) +
            '&' +
            encodeURIComponent('sort_column') +
            '=' +
            encodeURIComponent(data[key].column)
          )
        } else {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        }
      })
      .join('&')


    this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD HH:mm:ss'), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD HH:mm:ss'), this.state.channel)

  }

  getDataUpdate() {
    // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

    let queryString = ("filter_value=&page_number=0&page_size=1000&sort_order=false")

    this.getData(queryString, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), this.state.channel)
  }

  handleChangeChannel = value => {
    if (value != null) {
      this.getData(
        '',
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        value.value
      )

      this.setState({
        channel: value.value
      })
    } else {
      this.setState({
        channel: '',
      })
    }
  }

  handleChangeDate = (date) => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD')
    });
  };


  handleChangeTmeDate = (date) => {
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD')
    });
  };
  handleSearch = (e) => {
    e.preventDefault();


    const { startDate, startTime, endDate, endTime } = this.state;

    // Combine date and time into ISO format (YYYY-MM-DDTHH:mm:ss)
    const start = `${startDate} ${startTime}`;
    const end = `${endDate} ${endTime}`;


    // Format the date-time strings using Moment.js
    const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
    const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

    localStorage.setItem("STARTDATE", formattedStart)
    localStorage.setItem("ENDDATE", formattedEnd)
    // Call the getData function with formatted start and end
    this.getData("", formattedStart, formattedEnd, this.state.channel)
  }


  render() {

    const { startDate, startTime, endDate, endTime } = this.state;


    return (
      <div style={{ marginTop: '-20px' }}>
        <>
          <Modal
            isOpen={this.state.openForm}
            onRequestClose={this.closeForm}
            contentLabel="C2B details"
            style={MODAL_STYLE}
            ariaHideApp={false}
            closeTimeoutMS={500}
          >
            <MDBCloseIcon onClick={this.closeForm} />
            <h4><b>{this.state.isEdit ? 'Edit C2B Details' : 'Add C2B Details'}</b></h4>
            <br />

            <form onSubmit={this.handleSubmit}>

              {/* Credentials */}
              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3 text-primary">Credentials</h5>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="fw-bold">API Name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. c2b_register_url"
                      value={this.state.api_name}
                      onChange={(e) => this.setState({ api_name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Party B</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Enter party B"
                      value={this.state.partyB}
                      onChange={(e) => this.setState({ partyB: e.target.value })}
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
                    <label className="fw-bold">Consumer Key</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Consumer Key"
                      value={this.state.c2b_consumer}
                      onChange={(e) =>
                        this.setState({
                          c2b_consumer: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="fw-bold">Consumer Secret</label>
                    <input
                      type="password"
                      required
                      className="form-control"
                      placeholder="Consumer Secret"
                      value={this.state.c2b_secret}
                      onChange={(e) =>
                        this.setState({
                          c2b_secret: e.target.value
                        })
                      }
                    />
                  </div>

                </div>
              </div>

              {/* URLs */}
              <div className="border rounded p-3 mb-4">
                <h5 className="mb-3 text-primary">
                  Callback URLs
                  <span className="optional-tag">(optional)</span>
                </h5>

                <div className="row">

                  <div className="col-md-12 mb-3">
                    <label className="fw-bold">STK Push Callback URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://domain.com/stk_callback"
                      value={this.state.stk_callback_url}
                      onChange={(e) =>
                        this.setState({
                          stk_callback_url: e.target.value
                        })
                      }
                    />
                  </div>

                </div>
              </div>


              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={this.state.isSaving}
              >
                {this.state.isSaving ? 'Please wait...' : 'Save Configuration'}
              </button>

            </form>
          </Modal>

          <Card>
            <CardBody>
              <>
                <div className='api-page-head'>
                  <div>
                    <h3>C2B Details</h3>
                    <span className='api-page-sub'>
                      Customer to business API configurations
                    </span>
                  </div>
                  <button className='api-btn-add' onClick={this.openAdd}>
                    + Add C2B Details
                  </button>
                </div>
                <div className='panel-body'>
                  <div className='api-table'>
                    <ReactDatatable
                      config={this.config}
                      className='table'
                      records={this.state.data}
                      columns={this.columns}
                      id='tsc'
                      loading={this.state.isLoading}
                    />
                  </div>
                </div>
              </>
            </CardBody>
          </Card>
        </>
      </div>
    )
  }
}
