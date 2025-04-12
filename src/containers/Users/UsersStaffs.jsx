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


const UsersStaffs = () => {
    const [payments, setPaymentCategories] = useState([])
    const [isLoading, setLoad] = useState(true)
    const [showerror, isShowError] = useState(false)
    const [success, isSuccess] = useState(false)

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
        let url = baseURL + "user?" + queryString;

        // alert(url)
        axios.all([
            axios.get(url, config),
        ]).then(axios.spread((paymentResponse) => {
            let data = [];

            if (paymentResponse.data.data.length > 0) {
                for (let i = 0; i < paymentResponse.data.data.length; i++) {




                    let mbonus = { mhours_to: (paymentResponse.data.data[i].hours_to).toString() };
                    let mbalance = { mhours_from: (paymentResponse.data.data[i].hours_from).toString() };


                    let date = { dates: moment.utc(paymentResponse.data.data[i].dateModified).format('DD, MMM YYYY') };
                    data.push(Object.assign(paymentResponse.data.data[i], mbonus, mbalance, date));
                    setPaymentCategories(paymentResponse.data.data)

                }

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
            key: "name",
            TrOnlyClassName: 'tsc',
            text: "Name",
            className: "tsc",
            align: "left"
        },
        {
            key: "username",
            TrOnlyClassName: 'tsc',
            text: "Username",
            className: "tsc",
            align: "left"
        },
        {
            key: "station",
            TrOnlyClassName: 'tsc',
            text: "Stations",
            className: "tsc",
            align: "left"
        },
        {
            key: "shortcode",
            TrOnlyClassName: 'tsc',
            text: "Shortcode",
            className: "tsc",
            align: "left"
        },
        {
            key: "mhours_from",
            TrOnlyClassName: 'tsc',
            text: "Hours From",
            className: "tsc",
            align: "left"
        },
        {
            key: "mhours_to",
            TrOnlyClassName: 'tsc',
            text: "Hours To",
            className: "tsc",
            align: "left"
        },
        {
            key: "dates",
            TrOnlyClassName: 'tsc',
            text: "Created On",
            className: "tsc",
            align: "left"
        }
        ,
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

                            onClick={() => { if (window.confirm('Are you sure you want to delete this user?')) onSubmitDelete(record) }} >

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
        setFirstName(data.name)
        setStation(data.station)
        setHoursFrom(data.hours_from)
        setHoursTo(data.hours_to)
        setUsername(data.username)
        setShortCode(data.shortcode)
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

        axios.post(baseURL + `delete_user`, formData, {
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


        let formData = {

            "name": first_name,
            "username": username,
            "hours_from": hours_from,
            "hours_to": hours_to,
            "station": station,
            "shortcode": shortcode,
            "password": password

        }
        setLoad(true)
        axios.post(baseURL + 'updateUser', formData, {
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
        let formData = {
            "name": first_name,
            "username": username,
            "hours_from": hours_from,
            "hours_to": hours_to,
            "shortcode": shortcode,
            "station": station,
            "password": password


        }
        setLoad(true)

        axios.post(baseURL + 'user', formData, {
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
                        <Form className="form login-form" >
                            <div className="form__form-group">
                                <br></br>
                                {showerror ? <div >
                                    <Alert color="danger" className="alert--colored" icon>
                                        <p><span className="bold-text">{statusMessage}</span>
                                        </p>
                                    </Alert>
                                </div> : null}
                                {success ? (
                                    <div>
                                        <Alert color="success" className="alert--colored" icon>
                                            <p><span className="bold-text">{statusMessage}</span>
                                            </p>
                                        </Alert>
                                    </div>
                                ) : null}
                                <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text" className="form-control"
                                                name="first_name" placeholder='Name'
                                                value={first_name} onChange={handleChangeFirstNanme} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Username</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text" className="form-control"
                                                name="username" placeholder='Username'
                                                value={username} onChange={handleChangeUsername} />
                                        </div>
                                    </div>

                                </div>


                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Shortcode</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="shortcode" placeholder='Shortcode'
                                                value={shortcode} onChange={e => setShortCode(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Station</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="station" placeholder='Station'
                                                value={station} onChange={e => setStation(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Hours From</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text" className="form-control"
                                                name="hours_from" placeholder='Hours From'
                                                value={hours_from} onChange={e => setHoursFrom(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Hours To</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="number
                                            " className="form-control"
                                                name="hours_to" placeholder='Hours To'
                                                value={hours_to} onChange={e => setHoursTo(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Password</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="password
                                            " className="form-control"
                                                name="password" placeholder='Password'
                                                value={password} onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="account__btns col-8 offset-2" >
                                <br />
                                <Button className="account__btn" type='submit' onClick={onSubmitUpdate} color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                }</Button>
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
                    <h4><b>Add User</b></h4>
                    <br></br>
                    <>
                        <Form className="form login-form" >
                            {/* <h5><b>Get Agent Number</b></h5> */}
                            <div className="form__form-group">
                                <br></br>
                                {showerror ? <div >
                                    <Alert color="danger" className="alert--colored" icon>
                                        <p><span className="bold-text">{statusMessage}</span>
                                        </p>
                                    </Alert>
                                </div> : null}
                                {success ? (
                                    <div>
                                        <Alert color="success" className="alert--colored" icon>
                                            <p><span className="bold-text">{statusMessage}</span>
                                            </p>
                                        </Alert>
                                    </div>

                                ) : null}
                                <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="first_name" placeholder='Name'
                                                value={first_name} onChange={handleChangeFirstNanme} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Username</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="username" placeholder='Username'
                                                value={username} onChange={handleChangeUsername} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Shortcode</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="shortcode" placeholder='Shortcodd'
                                                value={shortcode} onChange={e => setShortCode(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Station</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                            " className="form-control"
                                                name="station" placeholder='Station'
                                                value={station} onChange={e => setStation(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Hours From</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text" className="form-control"
                                                name="hours_from" placeholder='Hours From'
                                                value={hours_from} onChange={e => setHoursFrom(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Hours To</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="number
                                            " className="form-control"
                                                name="hours_to" placeholder='Hours To'
                                                value={hours_to} onChange={e => setHoursTo(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Password</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="password
                                            " className="form-control"
                                                name="password" placeholder='Password'
                                                value={password} onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="account__btns col-8 offset-2" >
                                <Button className="account__btn" type='submit' onClick={onSubmit} color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                }</Button>
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
                                        <h4> <b> Presenters</b></h4><br />
                                    </div>
                                    <div className="col-6 pull-right">
                                        <button className="btn btn-primary btn-sm float-right"
                                            title="Add Agent"
                                            style={
                                                { marginRight: '10px' }}
                                            onClick={() => { isOpenAdd(true) }} >
                                            Add Presenter <i className="fa fa-add"></i>
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
export default UsersStaffs;
