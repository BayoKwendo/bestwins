import React, { useState, Fragment, useEffect } from 'react';
import ReactDatatable from '@ashvin27/react-datatable'
import axios from 'axios'
import { Card, CardBody } from 'reactstrap'
import { baseURL, CONFIG, formatCurrency, TOKEN } from '../../configs/exports'
import * as moment from 'moment'
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale

export class WinnerRetry extends React.Component {
  constructor(props) {
    super(props)
    this.applyCallback = this.applyCallback.bind(this)

    this.columns = [

      {
        key: 'msisdn',
        TrOnlyClassName: 'tsc',
        text: 'Msisdn',
        className: 'tsc',
        align: 'left'
      },


      {
        key: 'name',
        TrOnlyClassName: 'tsc',
        text: 'Name',
        className: 'tsc',
        align: 'left'
      },
      {
        key: 'amount',
        TrOnlyClassName: 'tsc',
        text: 'Amount',
        className: 'tsc',
        align: 'left'
      },
      {
        key: 'datess',
        TrOnlyClassName: 'tsc',
        text: 'Date',
        className: 'tsc',
        align: 'left'
      },
      {
        key: 'transactionId',
        TrOnlyClassName: 'tsc',
        text: 'Transaction ID',
        className: 'tsc',
        align: 'left'
      },

      {
        key: 'resultDesc',
        TrOnlyClassName: 'tsc',
        text: 'Result Description',
        className: 'tsc',
        align: 'left'
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
              <button className="btn btn-primary btn-sm"
                title="EditCategory"
                style={
                  { marginRight: '10px' }}
                onClick={() => {
                  this.onModify(record)
                }} >
                Retry
              </button>
            </Fragment>
          );
        }
      }
    ]

    this.config = {
      key_column: 'tsc',
      length_menu: [500, 1000, 2000],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      page_size: 1000,
      show_length_menu: true,
      language: {
        loading_text: 'Please be patient while data loads...',
        no_data_text: 'No data was found',
        filter: 'Enter phone',
        pagination: {
          next: <span>&#9658;</span>,
          previous: <span>&#9668;</span>
          // next
          // previous
        }
      },
      button: {
        excel: true,
        print: false,
        csv: true
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
      isPageLoad: true,
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '23:59',
      channel: 395959,
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
  componentDidMount() {
    this.setState({
      startDate: moment(new Date()).format('DD MMM, YYYY'),
      endDate: moment(new Date()).format('DD MMM, YYYY'),
      isPageLoad: true,
      valuedate: 'Today'
    })

    // alert(JSON.stringify(this.props.record_id.id))

    localStorage.setItem(
      'STARTDATE',
      moment(new Date()).format('YYYY-MM-DD 00:00:00')
    )
    localStorage.setItem(
      'ENDDATE',
      moment(new Date()).format('YYYY-MM-DD 23:59:59')
    )

    this.getData(
      '',
      moment(new Date()).format('2000-01-01 00:00:00'),
      moment(new Date()).format('YYYY-MM-DD 23:59:59'),
      this.state.channel
    )
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };



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

    // Call the getData function with formatted start and end
    this.getData("", formattedStart, formattedEnd);
  }

  getData = (queryString = '', startDate, endDate, channel) => {
    let url =
      baseURL +
      `/daily_withdraw_retry?channel=${channel}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`

    this.setState({
      isLoading: true
    })

    axios.all([axios.get(url, CONFIG)]).then(
      axios.spread(branchResponse => {
        this.setState(
          {
            admins: branchResponse.data.mdata,
            isLoading: false
          },
          function () {
            var data = []
            let mtotal = 0

            let mcount = 0

            if (this.state.admins.length > 0) {
              for (let i = 0; i < this.state.admins.length; i++) {
                let date = {
                  datess: moment
                    .utc(this.state.admins[i].datetime)
                    .format('YYYY-MM-DD HH:mm:ss')
                }
                data.push(Object.assign(date, this.state.admins[i]))
              }
              const b = data.sort(function (a, b) {
                return new Date(a.dates) - new Date(b.dates)
              })

              this.setState({
                data: b.reverse(),
                // total: branchResponse.data.mtotal[0].deposits,
                count: mcount,
                // won_amount: branchResponse.data.mtotal[0].amount
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


  onModify = (data) => {
    // alert(record.id)
    // setLoad(true)
    let formData = data

    axios.post(baseURL + `retry_withd`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'applicatio/json',
        'Authorization': TOKEN
      },
    }).then((response) => {
      alert("success")
      window.setTimeout(() => {
        window.location.reload()
      }, 1000);

    }).catch((error) => {
      alert(`Error ${error}`)
    })
  }


  applyCallback(startDate, endDate) {
    localStorage.setItem('STARTDATE', startDate)
    localStorage.setItem('ENDDATE', endDate)
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

    this.getData(
      queryString,
      moment(localStorage.getItem('STARTDATE')).format('YYYY-MM-DD HH:mm:ss'),
      moment(localStorage.getItem('ENDDATE')).format('YYYY-MM-DD HH:mm:ss'),
      this.state.channel
    )
  }

  getDataUpdate() {
    // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

    this.getData(
      '',
      moment(new Date()).format('2000-01-01 00:00:00'),
      moment(new Date()).format('YYYY-MM-DD 23:59:59'),
      this.state.channel
    )
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
        channel: ''
      })
    }
  }

  render() {
    let ranges = {
      'Today Only': [moment(this.state.start), moment(this.state.end)],
      'Yesterday Only': [
        moment(this.state.start).subtract(1, 'days'),
        moment(this.state.end).subtract(1, 'days')
      ],
      '3 Days': [
        moment(this.state.start).subtract(3, 'days'),
        moment(this.state.end)
      ],
      '5 Days': [
        moment(this.state.start).subtract(5, 'days'),
        moment(this.state.end)
      ],
      '1 Week': [
        moment(this.state.start).subtract(7, 'days'),
        moment(this.state.end)
      ],
      '2 Weeks': [
        moment(this.state.start).subtract(14, 'days'),
        moment(this.state.end)
      ],
      '1 Month': [
        moment(this.state.start).subtract(1, 'months'),
        moment(this.state.end)
      ],
      '1 Year': [
        moment(this.state.start).subtract(1, 'years'),
        moment(this.state.end)
      ]
    }
    let local = {
      format: 'DD-MM-YYYY',
      sundayFirst: false
    }

    const { startDate, startTime, endDate, endTime } = this.state;


    return (
      <div style={{ marginTop: '-20px' }}>
        <>
          <Card>
            <CardBody>
              <>
                <div className='row'>
                  <div className='col-md-8'>
                    <h3>Withdrawals to Retry</h3>
                  </div>
                </div>
                <br />

                <br />
                <br />

                <br />
                <form onSubmit={this.handleSearch}>
                  <div className="row align-items-end mb-4">
                    {/* Start Date Picker */}
                    <div className="col-md-2 col-sm-3">
                      <label className="form-label">Start Date</label>
                      <DatePicker
                        selected={startDate ? new Date(startDate) : null}
                        onChange={(date) => this.handleChangeDate(date, 'startDate')}
                        dateFormat="yyyy-MM-dd" // Set format to YYYY-MM-DD
                        locale={enZA} // Set the African locale for the picker
                        className="form-control"
                      />
                    </div>

                    {/* Start Time Picker */}
                    <div className="col-md-2 col-sm-3">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => this.setState({ startTime: e.target.value })}
                      />
                    </div>

                    {/* End Date Picker */}
                    <div className="col-md-2 col-sm-3">
                      <label className="form-label">End Date</label>
                      <DatePicker
                        selected={endDate ? new Date(endDate) : null}
                        onChange={(date) => this.handleChangeTmeDate(date, 'endDate')}
                        dateFormat="yyyy-MM-dd" // Set format to YYYY-MM-DD
                        locale={enZA} // Set the African locale for the picker
                        className="form-control"
                      />
                    </div>


                    {/* End Time Picker */}
                    <div className="col-md-2 col-sm-3">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => this.setState({ endTime: e.target.value })}
                      />
                    </div>

                    {/* Search Button */}
                    <div className="col-md-2 col-sm-3">
                      <button type="submit" className="btn btn-primary w-100">
                        Search
                      </button>
                    </div>
                  </div>
                </form>

                <br />
                <div className='panel-body'>
                  <ReactDatatable
                    config={this.config}
                    records={this.state.data}
                    columns={this.columns}
                    dynamic={true}
                    id='tsc'
                    loading={this.state.isLoading}
                    total_record={this.state.mdata}
                    onChange={this.tableChangeHandler}
                  />
                </div>
              </>
            </CardBody>
          </Card>
        </>
      </div>
    )
  }
}
