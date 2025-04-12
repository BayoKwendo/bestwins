import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Visits from './components/Visits';
import { ROLE } from '../../../configs/exports';
import BreakingAdminnews from './components/breakingNews';
// import ApplicantDocuSummary from './components/ApplicantDocuSummary';
// import PassportDoc from './components/Passport_Doc';
// import Medical1 from './components/Medical1';
import * as moment from 'moment'
import { FormControl } from 'react-bootstrap'
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker'
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import styles
import { enZA } from 'date-fns/locale'; // Import African locale

function DefaultDash({ t, rtl }) {
  let now = new Date()
  let mstart = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  )
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  let mend = moment(mstart).add(1, 'days').subtract(1, 'seconds')
  const [start, setStart] = useState(mstart);
  const [end, setEnd] = useState(mend);
  const [valuedate, setValues] = useState('Today');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const handleRefreshChild = (refresh) => {
  };



  useEffect(() => {
    triggerChildRefresh(end)

  }, [start, end])

  const triggerChildRefresh = (prevState) => {

    setRefreshTrigger(prevState);

  };

  const getDataUpdate = () => {
    // let queryString = ("filter_value=&page_number=0&page_size=10&sort_order=false")
    setStart(mstart)
    setEnd(mend)
    setValues("Today")
  }

  const applyCallback = (startDate, endDate) => {
    localStorage.setItem('STARTDATE', startDate)
    localStorage.setItem('ENDDATE', endDate)
    let Sdate1 = moment(startDate).format('DD MMM, YYYY')
    let Edate2 = moment(endDate).format('DD MMM, YYYY')

    setStart(startDate)
    setEnd(endDate)
    setValues(Sdate1 + ' ' + Edate2)

    // this.setState({
    //   valuedate: Sdate1 + ' ' + Edate2,
    //   startDate: Sdate1,
    //   isPageLoad: true,
    //   endDate: Edate2
    // })

    // this.getData(
    //   '',
    //   moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
    //   moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
    //   channel
    // )
  }

  let ranges = {
    'Today Only': [moment(start), moment(end)],
    'Yesterday Only': [
      moment(start).subtract(1, 'days'),
      moment(end).subtract(1, 'days')
    ],
    '3 Days': [
      moment(start).subtract(3, 'days'),
      moment(end)
    ],
    '5 Days': [
      moment(start).subtract(5, 'days'),
      moment(end)
    ],
    '1 Week': [
      moment(start).subtract(7, 'days'),
      moment(end)
    ],
    '2 Weeks': [
      moment(start).subtract(14, 'days'),
      moment(end)
    ],
    '1 Month': [
      moment(start).subtract(1, 'months'),
      moment(end)
    ],
    '1 Year': [
      moment(start).subtract(1, 'years'),
      moment(end)
    ]
  }
  let local = {
    format: 'DD-MM-YYYY',
    sundayFirst: false
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };



  const handleChangeDate = (date) => {

    setStartDate(moment(date).format('YYYY-MM-DD'))

  };


  const handleChangeTmeDate = (date) => {

    setEndDate(moment(date).format('YYYY-MM-DD'))
    // this.setState({
    //   endDate: 
    // });
  };
  const handleSearch = (e) => {
    e.preventDefault();


    // Combine date and time into ISO format (YYYY-MM-DDTHH:mm:ss)
    const start = `${startDate} ${startTime}`;
    const end = `${endDate} ${endTime}`;


    // Format the date-time strings using Moment.js
    const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
    const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');

    setStart(formattedStart)
    setEnd(formattedEnd)
    // setValues(Sdate1 + ' ' + Edate2)

    // Call the getData function with formatted start and end
    // this.getData("", formattedStart, formattedEnd);
  }

  return (
    <Col className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Dashboard</h3>
          <form >
            <div className="row align-items-end mb-4">
              {/* Start Date Picker */}
              <div className="col-md-2 col-sm-3">
                <label className="form-label">Start Date</label>
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => handleChangeDate(date, 'startDate')}
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
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              {/* End Date Picker */}
              <div className="col-md-2 col-sm-3">
                <label className="form-label">End Date</label>
                <DatePicker
                  selected={endDate ? new Date(endDate) : null}
                  onChange={(date) => handleChangeDate(date, 'endDate')}
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
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              {/* Search Button */}
              <div className="col-md-2 col-sm-3">
                <button type="submit" onClick={handleSearch} className="btn btn-primary w-100">
                  Search
                </button>
              </div>
            </div>
          </form>
          <br />

          <br />

          <br />
          <br />
        </Col>


      </Row>
      <Row >
        <>
          {start ?
            <BreakingAdminnews refresh={refreshTrigger} startdate={moment(start).format('YYYY-MM-DD HH:mm:ss')} enddate={moment(end).format('YYYY-MM-DD HH:mm:ss')} />
            : null}
        </>


      </Row>
      <br />
    </Col >
  )
}

DefaultDash.propTypes = {
  t: PropTypes.func.isRequired,
};

export default compose(withTranslation('common'), connect(state => ({
  rtl: state.rtl,
})))(DefaultDash);
