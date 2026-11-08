import * as React from 'react';
import '../../_assets/css/file.css';
import axios from 'axios';
import { baseURL, CONFIG } from '../../configs/exports';
import { Card, CardBody, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export class createBlackList extends React.Component {

    constructor(props) {
        super(props)


        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            phone_number: '',
            showError: false
        }
    }




    onSubmit(e) {
        e.preventDefault();


        let formData = {
            "mobile": this.state.phone_number
        }
        this.setState({ isLoading: true });

        axios.post(baseURL + 'createBlackList', formData, CONFIG)
            .then((response) => {
                console.log("bayo", response)
                // eslint-disable-next-line
                if (response.data.success == true) {
                    console.log("records", formData)

                    this.setState({ statusMessage: response.data.message, isShowError: true, isLoading: false });
                    
                    window.setTimeout(function () {
                        window.location.href = "/blacklist";
                    }, 2000);

                } else {

                    this.setState({ statusMessage: response.data.message, isShowError: true, isLoading: false });

                    // window.setTimeout(function () {
                    //     window.location.href = "/session";
                    // }, 2000);
                }

            })
            .catch(error => {
                console.log('bayoo', error.response)
                this.setState({
                    showError: true,
                    isShowError: false,
                    statusMessage: error.response.data.message,
                    submitted: true,
                    isLoading: false
                }
                    , function () {
                        // console.log('data', error.response.status_message)
                    });
            });

    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { showComponent } = this.state;
        const { hideComponent } = this.state;

        return (
            <div className="pcoded-main-container">

                {showComponent && (
                    <div>

                        {this.state.showComponent ?
                            <peopleView /> : null
                        }

                    </div>
                )}

                {!hideComponent && (
                    <>

                        <Col md={12}>
                            <h3>Add Blacklist</h3><br />

                        </Col>
                        <Col md={12} lg={12}>
                            <Card>
                                <CardBody><br />
                                    <Link to="/blacklist">
                                        <Button className="pull-right"
                                            color="primary" outline>List of BlackListed Customers </Button><br /> <br /><br />
                                    </Link>
                                    <div className="card__title">
                                        <h5 className="bold-text">Fill the Below Field to blacklist </h5>
                                    </div>

                                    {this.state.showError ? <div style={{ color: 'red' }}>
                                        {this.state.statusMessage}

                                    </div> : null}<br></br>

                                    {this.state.isShowError ? (
                                        <div
                                            color="success"
                                            style={{ fontSize: "13px", color: "green" }}>
                                            {this.state.statusMessage}
                                        </div>

                                    ) : null}<br></br>
                                    <form className="col-md-8 offset-md-2" onSubmit={this.onSubmit}>

                                        <div className="form-group">
                                            <label className="form-label">Customer Phone Number</label>
                                            <input id="input" type="text" className="form-control input-md"
                                                name="phone_number" required placeholder="Enter Phone Number"
                                                value={this.state.phone_number} onChange={this.handleChange} />
                                        </div>
                                        <br />
                                        <div className="col-md-12">
                                            <Button type="submit" color="primary" outline className="btn-paypal btn-lg pull-right
                                                                 " >
                                                {this.state.isLoading ? "Please Wait..." : "Submit"}  <i className="fa fa-refresh"></i></Button> &nbsp;&nbsp;&nbsp;
                                       </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </>

                )
                }

            </div>
        )

    }

}
