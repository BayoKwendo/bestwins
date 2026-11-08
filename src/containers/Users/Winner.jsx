import React from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Card, CardBody } from 'reactstrap';
import { baseURL, CHANNEL, CONFIG, formatCurrency } from '../../configs/exports';
import * as moment from 'moment';
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import { FormControl } from 'react-bootstrap'
import { HOURS_FROM, HOURS_TO } from "../../configs/exports.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale



export class Winner extends React.Component {
  constructor(props) {
    super(props);
    this.applyCallback = this.applyCallback.bind(this);



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
      }
    ]

    this.config = {
      key_column: "tsc",
      length_menu: [500, 1000, 1500],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      page_size: 2000,
      show_length_menu: true,
      language: {
        loading_text: "Please be patient while data loads...",
        no_data_text: "No data was found",
        filter: "Enter Phone Number",
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

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    this.state = {
      admins: [],
      isLoading: true,
      showModal: false,
      showError: false,
      isShowError: false,
      showComponent: false,
      hideComponent: false,
      bet: 0,
      won: 0,
      data: [],
    };
    let now = new Date();
    let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    let end = moment(start).add(1, "days").subtract(1, "seconds");
    this.state = {
      start: start,
      end: end,
      total: 0,
      count: 0,
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '23:59',
      isPageLoad: true,
    }
  }
  componentDidMount() {
    this.setState({
      startDate: moment(new Date()).format('DD MMM, YYYY'),
      endDate: moment(new Date()).format('DD MMM, YYYY'),
      isPageLoad: true,
      valuedate: "Today"
    })


    // alert(JSON.stringify(this.props.record_id.id))

    localStorage.setItem("STARTDATE", moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_FROM}:00:00`)
    localStorage.setItem("ENDDATE", moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_TO}:59:59`)
    const startDate = moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_FROM}:00:00`;
    const endDate = moment(new Date()).format('YYYY-MM-DD') + ` ${HOURS_TO}:59:59`;

    // Call the `getData` function
    this.getData("", startDate, endDate);
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

    localStorage.setItem("STARTDATE", formattedStart)
    localStorage.setItem("ENDDATE", formattedEnd)
    // Call the getData function with formatted start and end
    this.getData("", formattedStart, formattedEnd);
  }
  getData = (queryString = '', startDate, endDate, channel) => {
    let url =
      baseURL +
      `/daily_withdraw?channel=${channel}&startDate="${startDate}"&endDate="${endDate}"&${queryString}`
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

            if (this.state.admins.length > 0) {
              for (let i = 0; i < this.state.admins.length; i++) {
                let date = {
                  datess: moment
                    .utc(this.state.admins[i].date_created)
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
                won_amount: branchResponse.data.mtotal[0].amount
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

    localStorage.setItem("STARTDATE", startDate)
    localStorage.setItem("ENDDATE", endDate)
    let Sdate1 = moment(startDate).format('DD MMM, YYYY');
    let Edate2 = moment(endDate).format('DD MMM, YYYY');
    this.setState({
      valuedate: Sdate1 + " " + Edate2,
      startDate: Sdate1,
      isPageLoad: true,
      endDate: Edate2
    })


    this.getData("", moment(new Date(startDate)).format('YYYY-MM-DD HH:mm:ss'), moment(new Date(endDate)).format('YYYY-MM-DD HH:mm:ss'))
  }



  tableChangeHandler = data => {
    let queryString = Object.keys(data).map((key) => {
      if (key === "sort_order" && data[key]) {
        return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
      } else {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      }

    }).join('&');

    this.getData(queryString, moment(localStorage.getItem("STARTDATE")).format('YYYY-MM-DD HH:mm:ss'), moment(localStorage.getItem("ENDDATE")).format('YYYY-MM-DD HH:mm:ss'))


  }




  getDataUpdate() {
    // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")

    this.getData("", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
  }

  render() {
    let ranges = {
      "Today Only": [moment(this.state.start), moment(this.state.end)],
      "Yesterday Only": [
        moment(this.state.start).subtract(1, "days"),
        moment(this.state.end).subtract(1, "days")
      ],
      "3 Days": [moment(this.state.start).subtract(3, "days"), moment(this.state.end)],
      "5 Days": [moment(this.state.start).subtract(5, "days"), moment(this.state.end)],
      "1 Week": [moment(this.state.start).subtract(7, "days"), moment(this.state.end)],
      "2 Weeks": [moment(this.state.start).subtract(14, "days"), moment(this.state.end)],
      "1 Month": [moment(this.state.start).subtract(1, "months"), moment(this.state.end)],
      "1 Year": [moment(this.state.start).subtract(1, "years"), moment(this.state.end)]
    };
    let local = {
      "format": "DD-MM-YYYY",
      "sundayFirst": false
    }


    const { startDate, startTime, endDate, endTime } = this.state;


    return (
      <div style={{ marginTop: '-20px' }} >
        < >
          < Card >
            <CardBody >
              < >

                <div className="row">
                  <div className="col-md-8">

                    <h3><b>Withdrawal</b></h3>
                  </div>
                </div>
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
                {/* Summary */}
                <div className="row mb-3">

                  <div className="col-md-4">
                    <h5>Total Win: <b>{this.state.won_amount}</b></h5>
                  </div>
                </div>
                <br />
                {/* <h3>Total Counts  <b>{this.state.count}</b></h3>

                                <h3>Total Stake  <b>{this.state.total}</b></h3> */}
                <br />
                <div className="panel-body" >
                  <ReactDatatable
                    config={this.config}
                    records={this.state.data}
                    columns={this.columns}
                    id="tsc"
                    loading={this.state.isLoading}
                    total_record={this.state.mdata}
                    onChange={this.tableChangeHandler} />
                </div>
              </>

            </CardBody>

          </Card>
        </>
      </div>

    )
  }
}