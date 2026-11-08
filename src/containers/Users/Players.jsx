import React from 'react'
import ReactDatatable from '@ashvin27/react-datatable'
import axios from 'axios'
import { Card, CardBody } from 'reactstrap'
import { baseURL, CONFIG, formatCurrency } from '../../configs/exports'
import * as moment from 'moment'
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import Select from 'react-select'
import { HOURS_FROM, HOURS_TO } from "../../configs/exports.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale


export class Players extends React.Component {
  constructor(props) {
    super(props)
    this.applyCallback = this.applyCallback.bind(this)

    this.columns = [
      {
        key: 'msisdn',
        TrOnlyClassName: 'tsc',
        text: 'Missdn',
        className: 'tsc',
        align: 'left'
      },

      {
        key: 'stake_amount',
        TrOnlyClassName: 'tsc',
        text: 'Amount',
        className: 'tsc',
        align: 'left'
      },


      // {
      //   key: 'ggr',
      //   TrOnlyClassName: 'tsc',
      //   text: 'GGR',
      //   className: 'tsc',
      //   align: 'left'
      // },
      // {
      //   key: 'rtp',
      //   TrOnlyClassName: 'tsc',
      //   text: 'RTP',
      //   className: 'tsc',
      //   align: 'left'
      // },

      {
        key: 'datess',
        TrOnlyClassName: 'tsc',
        text: 'Date',
        className: 'tsc',
        align: 'left'
      }
    ]

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
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '23:59',
      isPageLoad: true,
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
    let url =
      baseURL +
      `dailydeposit_hour?channel=${channel}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`
    this.setState({
      isLoading: true
    })

    // alert(url)
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
            let mtotalW = 0
            let mcountW = 0
            if (this.state.admins.length > 0) {
              for (let i = 0; i < this.state.admins.length; i++) {

                mtotal = mtotal + Number(this.state.admins[i].stake_amount)
                mtotalW = mtotalW + Number(this.state.admins[i].won_amount)
                mcountW = mcount + Number(this.state.admins[i].winnings)
                let date = {
                  datess: moment
                    .utc(this.state.admins[i].dates)
                    .format('YYYY-MM-DD HH:mm:ss')
                }
                data.push(Object.assign(date, this.state.admins[i]))
              }

              const b = data.sort(function (a, b) {
                return new Date(a.dates) - new Date(b.dates)
              })

              this.setState({
                data: b.reverse(),
                total: branchResponse.data.mtotal[0].deposits,
                count: mcount,

                deposits: branchResponse.data.mtotal[0].deposits,
                stake_amount: branchResponse.data.mtotal[0].amount,
                winnings: mtotalW,
                won_amount: mtotalW,
                mdata: branchResponse.data.mtotal[0].msisdn
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
                    <h3>Deposits</h3>
                  </div>
                </div>
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
                <br />

                <br />


                <h4>
                  Total Amount <b>{this.state.stake_amount}</b>
                </h4>
                {/* <h3>
                  Total Won Amount <b>{this.state.won_amount}</b>
                </h3> */}
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
