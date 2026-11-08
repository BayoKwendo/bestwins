import React, { useState, Fragment, useEffect } from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import "../../_assets/css/file.css"
import { Card, CardBody, Button, Table } from 'reactstrap';

import { baseURL, TOKEN, USER_ID, logout } from '../../configs/exports';
import Alert from '../../shared/components/Alert';
import Modal from 'react-modal';
import { Form } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact";
import * as moment from 'moment';
import 'react-phone-number-input/style.css'
import DatePicker from 'react-datepicker'; // Import react-datepicker
import { enZA } from 'date-fns/locale'; // Import African locale


const AutoWin = () => {
  const [payments, setPaymentCategories] = useState([])
  const [isLoading, setLoad] = useState(true)
  const [showerror, isShowError] = useState(false)
  const [success, isSuccess] = useState(false)


  const today = new Date();

  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);


  const [startTime, setStartTime] = useState(moment(new Date(today)).format('HH:mm:ss'));

  const [endTime, setEndTime] = useState(moment(new Date(today)).format('HH:mm:ss'));

  const [statusMessage, setStatusMessage] = useState()
  const [open, isOpen] = useState(false)
  const [queryString, setQueryString] = useState("")
  const [recruitment_id, setRecruitmentID] = useState("")
  const [total, setTotal] = useState(false)

  const [openAdd, isOpenAdd] = useState(false)


  const [first_name, setFirstName] = useState("")
  const [msisdn, setMsisdn] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [station, setStation] = useState("")
  const [hours_to, setHoursTo] = useState(0)
  const [hours_from, setHoursFrom] = useState(0)

  const [role_id, setRoleID] = useState(0)

  // eslint-disable-next-line
  const [branch_name, setBranchName] = useState("")
  const [branch_id, setBranchID] = useState(0)


  //role
  const [shortcode, setShortCode] = useState()
  const [branch, setBranch] = useState([])


  const handleChangeTmeDate = (date) => {
    setStartDate(date)
  };
  useEffect(() => {
    setLoad(true)


    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': TOKEN
      },
    };
    let url = baseURL + "auto_win";

    // alert(url)
    axios.all([
      axios.get(url, config),
    ]).then(axios.spread((paymentResponse) => {
      let data = [];

      if (paymentResponse.data.length > 0) {
        for (let i = 0; i < paymentResponse.data.length; i++) {
          let date = {
            datess: moment
              .utc(paymentResponse.data[i].created_on)
              .format('YYYY-MM-DD HH:mm:ss')
          }
          let startdate = {
            startdatess: moment
              .utc(paymentResponse.data[i].start_date)
              .format('YYYY-MM-DD HH:mm:ss')
          }
          let enddate = {
            enddatess: moment
              .utc(paymentResponse.data[i].end_date)
              .format('YYYY-MM-DD HH:mm:ss')
          }

          data.push(Object.assign(date, startdate, enddate, paymentResponse.data[i]))
        }

        setPaymentCategories(data)
      }
      setLoad(false)
    }))

  }, [queryString]);


  const config = {
    key_column: "tsc",
    length_menu: [10, 20, 50, 100, 200, 500],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    page_size: 100,
    show_length_menu: true,
    show_info: true,
    language: {
      loading_text: "Please be patient while data loads...",
      filter: "Search here ...",
      no_data_text: "No data was found",
      pagination: {
        next: <span>&#9658;</span>,
        previous: <span>&#9668;</span>
      }
    }
  }
  const columns = [

    {
      key: 'amount',
      TrOnlyClassName: 'tsc',
      text: 'Amount',
      className: 'tsc',
      align: 'left'
    },


    {
      key: 'startdatess',
      TrOnlyClassName: 'tsc',
      text: 'Start Date',
      className: 'tsc',
      align: 'left'
    },
    {
      key: 'enddatess',
      TrOnlyClassName: 'tsc',
      text: 'End Date',
      className: 'tsc',
      align: 'left'
    },
    {
      key: 'datess',
      TrOnlyClassName: 'tsc',
      text: 'Date Created',
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
              onClick={() => { onModify(record) }} >

              Edit
            </button>

            <button className="btn btn-danger btn-sm"
              title="Delete Category"
              style={
                { marginRight: '10px' }}

              onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) onSubmitDelete(record) }} >

              Delete
            </button>


          </Fragment>
        );
      }
    }

  ];

  // // pass inputs
  // const handleChangeLastName = (e) => {
  //     setLastName(e.target.value)
  // }

  const handleChangeFirstNanme = (e) => {
    setFirstName(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  // const handleChangeMsisdn = (e) => {
  //     setMsisdn(e.target.value)
  // }

  // const handleChangeJobTitle = (e) => {
  //     setJobTitle(e.target.value)
  // }

  const handleChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const closeModal = (e) => {
    isOpen(false)
  }

  const onModify = (data) => {

    // alert(data.ui_name)
    setRecruitmentID(data.id)
    setAmount(data.amount)
    setStartDate(new Date(data.start_date))
    setEndDate(new Date(data.end_date))
    setStartTime(moment.utc(new Date(data.start_date)).format('HH:mm:ss'))
    setEndTime(moment.utc(new Date(data.end_date)).format('HH:mm:ss'))
    isOpen(true)

  };

  const closeModalAdd = (e) => {
    isOpenAdd(false)
  }


  const onSubmitDelete = (record) => {
    // alert(record.id)
    setLoad(true)

    let formData = {

      "id": record.id,

    }

    axios.post(baseURL + `delete_timeslot`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': TOKEN
      },
    }).then((response) => {
      setStatusMessage(response.data.message)
      isShowError(false)
      isSuccess(true)
      setLoad(false)
      alert("success")
      window.scrollTo(0, 0)
      window.setTimeout(() => {
        isSuccess(false)
        setQueryString(require("randomstring").generate({
          length: 1,
          charset: 'alphanumeric',
          capitalization: 'lowercase'
        }))
      }, 2000);

    })
      .catch((error) => {
        if (error.response.data.status_code === 401) {
          logout()
        }
        setStatusMessage(error.response.data.message)
        isShowError(true)
        isSuccess(false)
        window.setTimeout(() => {
          isShowError(false)
        }, 2000);
      })
  }


  const onSubmitUpdate = (record) => {
    record.preventDefault();
    // alert(record.id)


    const start = `${moment(startDate).format('YYYY-MM-DD')} ${startTime}`;
    const end = `${moment(endDate).format('YYYY-MM-DD')} ${endTime}`;


    // Format the date-time strings using Moment.js
    const formattedStart = moment(new Date(start)).format('YYYY-MM-DD HH:mm:ss');
    const formattedEnd = moment(new Date(end)).format('YYYY-MM-DD HH:mm:ss');


    let formData = {
      "id": recruitment_id,
      "amount": amount,
      "start_date": formattedStart,
      "end_date": formattedEnd,
    }
    setLoad(true)
    axios.post(baseURL + 'update_timeslot', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': TOKEN
      },
    }).then((response) => {
      if (response.data.success) {
        setStatusMessage(response.data.message)
        isShowError(false)
        setLoad(false)
        isSuccess(true)
        window.scrollTo(0, 0)
        window.setTimeout(() => {
          isSuccess(false)
          isOpen(false)
          setQueryString(require("randomstring").generate({
            length: 1,
            charset: 'alphanumeric',
            capitalization: 'lowercase'
          }))
        }, 2000);
      } else {
        setStatusMessage(response.data.message)
        isShowError(true)
        isSuccess(false)
        window.setTimeout(() => {
          isShowError(false)

        }, 2000);
      }
    })
      .catch((error) => {
        if (error.response.data.status_code === 401) {
          logout()
        } setStatusMessage(error.response.data.message)
        isShowError(true)
        isSuccess(false)
        setLoad(false)
        window.setTimeout(() => {
          isShowError(false)
        }, 2000);
      })
  }


  const onSubmit = (record) => {
    record.preventDefault();
    // alert(record.id)

    if (amount > 0) {

      // const formattedStart = moment(startDate).format('YYYY-MM-DD');

      const start = `${moment(startDate).format('YYYY-MM-DD')} ${startTime}`;
      const end = `${moment(endDate).format('YYYY-MM-DD')} ${endTime}`;




      // Format the date-time strings using Moment.js
      const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const formattedEnd = moment(new Date(end)).format('YYYY-MM-DD HH:mm:ss');


      let formData = {
        "amount": amount,
        "start_date": formattedStart,
        "end_date": formattedEnd,
      }
      setLoad(true)

      axios.post(baseURL + 'timeslot', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': TOKEN
        },
      }).then((response) => {
        if (response.data.success) {
          setStatusMessage(response.data.message)
          isShowError(false)
          setLoad(false)
          isSuccess(true)
          window.scrollTo(0, 0)
          window.setTimeout(() => {
            isSuccess(false)
            isOpenAdd(false)

            setQueryString(require("randomstring").generate({
              length: 1,
              charset: 'alphanumeric',
              capitalization: 'lowercase'
            }))
          }, 2000);
        } else {
          setStatusMessage(response.data.message)
          isShowError(true)
          isSuccess(false)
          window.setTimeout(() => {
            isShowError(false)

          }, 2000);
        }
      })
        .catch((error) => {
          if (error.response.data.status_code === 401) {
            logout()
          } setStatusMessage(error.response.data.message)
          isShowError(true)
          isSuccess(false)
          setLoad(false)
          window.setTimeout(() => {
            isShowError(false)
          }, 2000);
        })
    } else {
      alert("Amount should be greater than zero")
    }
  }

  const tableChangeHandler = data => {
    let queryString = Object.keys(data).map((key) => {
      if (key === "sort_order" && data[key]) {
        return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
      } else {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      }
    }).join('&');
    setQueryString(queryString)
  }

  return (
    <div style={{ marginTop: "-20px" }} >
      < >

        <Modal
          isOpen={open}
          onRequestClose={e => {
            closeModal(e);
          }}

          contentLabel="My dialog"
          className="mymodal"
          onAfterOpen={() => {
            document.body.style.overflow = 'hidden';
          }}
          onAfterClose={() => {
            document.body.removeAttribute('style');
          }}
          overlayClassName="myoverlay"
          closeTimeoutMS={500}
        >
          <MDBCloseIcon onClick={closeModal} />
          <h4><b>Modify  details</b></h4>
          <br></br>
          <>
            <Form className="form simple-form">
              <div className="form__form-group">
                {showerror && (
                  <Alert color="danger" className="alert--colored" icon>
                    <p><span className="bold-text">{statusMessage}</span></p>
                  </Alert>
                )}

                {success && (
                  <Alert color="success" className="alert--colored" icon>
                    <p><span className="bold-text">{statusMessage}</span></p>
                  </Alert>
                )}

                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-md-8 col-sm-3">
                      <label className="form-label">Start Date</label>
                      <br />
                      <DatePicker
                        selected={startDate}
                        onChange={date => handleChangeTmeDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                      />
                    </div>

                    <div className="col-md-4 col-sm-3">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-8 col-sm-3">

                      <label className="form-label">End Date</label>
                      <br />
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                      />
                    </div>

                    <div className="col-md-4 col-sm-3">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>


                <br /><br />
                <div className="account__btns col-8 offset-2" >
                  <br />
                  <Button className="account__btn" type='submit' onClick={onSubmitUpdate} color="success"> {
                    isLoading ? "Please wait..." : "Submit"
                  }</Button>
                </div>
                <br /><br />
                <br /><br />
                <br /><br />
                <br /><br />
              </div>
            </Form>

          </>
        </Modal>



        <Modal
          isOpen={openAdd}
          onRequestClose={e => {
            closeModalAdd(e);
          }}
          contentLabel="My dialog"
          className="mymodal"
          onAfterOpen={() => {
            document.body.style.overflow = 'hidden';
          }}
          onAfterClose={() => {
            document.body.removeAttribute('style');
          }}
          overlayClassName="myoverlay"
          closeTimeoutMS={500}
        >
          <MDBCloseIcon onClick={closeModalAdd} />
          <h4><b>Add New Entry</b></h4>
          <br></br>
          <>
            <Form className="form simple-form">
              <div className="form__form-group">
                {showerror && (
                  <Alert color="danger" className="alert--colored" icon>
                    <p><span className="bold-text">{statusMessage}</span></p>
                  </Alert>
                )}

                {success && (
                  <Alert color="success" className="alert--colored" icon>
                    <p><span className="bold-text">{statusMessage}</span></p>
                  </Alert>
                )}

                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="row">
                    <div className="col-md-8 col-sm-3">
                      <label className="form-label">Start Date</label>
                      <br />
                      <DatePicker
                        selected={startDate}
                        onChange={date => handleChangeTmeDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                      />
                    </div>

                    <div className="col-md-4 col-sm-3">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>

                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-8 col-sm-3">

                      <label className="form-label">End Date</label>
                      <br />
                      <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                      />
                    </div>

                    <div className="col-md-4 col-sm-3">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>


                <br /><br />
                <div className="account__btns col-8 offset-2">
                  <Button
                    className="account__btn"
                    type="submit"
                    onClick={onSubmit}
                    color="success"
                  >
                    {isLoading ? "Please wait..." : "Submit"}
                  </Button>
                </div>
                <br /><br />
                <br /><br />
                <br /><br />
                <br /><br />
              </div>
            </Form>
          </>
        </Modal>


        < Card >

          <CardBody >
            <Table responsive hover>
              <div className="panel-body" >

                <div className="row">
                  <div className="col-md-6">
                    <h4> <b> AutoWin</b></h4><br />
                  </div>
                  <div className="col-6 pull-right">
                    <button className="btn btn-primary btn-sm float-right"
                      title="Add Agent"
                      style={
                        { marginRight: '10px' }}
                      onClick={() => { isOpenAdd(true) }} >
                      Add New Entry <i className="fa fa-add"></i>
                    </button>
                  </div>
                </div>
                <ReactDatatable
                  config={config}
                  records={payments}
                  columns={columns}
                  dynamic={true}
                  id="tsc"
                  loading={isLoading}
                  total_record={total}
                  onChange={tableChangeHandler} />
              </div>
            </Table>
          </CardBody>


        </Card>
      </>
    </div >
  )

}
export default AutoWin;
