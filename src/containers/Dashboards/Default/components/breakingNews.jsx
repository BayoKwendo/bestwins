/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import {
  BarChart, Bar, Cell, ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import axios from 'axios';
import { baseURL, TOKEN } from '../../../../configs/exports';



const NO1 = localStorage.getItem('entity');
const NO7 = localStorage.getItem('branch');
const NO2 = localStorage.getItem('staffs');
const NO3 = localStorage.getItem('students');
const NO4 = localStorage.getItem('parents');
const NO5 = localStorage.getItem('nfc-tags');
const NO6 = localStorage.getItem('devices');


const data = [
  { name: 'NFC-Tags', pv: NO5 },
  { name: 'Students', pv: NO3 },
  { name: 'Parents', pv: NO4 },
  { name: 'Branches', pv: NO7 },
  { name: 'Entities', pv: NO1 },
  { name: 'Staffs', pv: NO2 },
  { name: 'NFC-Devices', pv: NO6 },
];


class BreakingAdminnews extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sgtartDate: props.startDate,
      endDate: props.endDate,
    };

  }

  handleClick = (item) => {
    const index = data.indexOf(item.payload);
    this.setState({
      activeIndex: index,
    });
  };
  componentDidUpdate(prevProps) {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        "Authorization": TOKEN
      }
    };
    if (prevProps.refresh !== this.props.refresh && this.props.refresh) {
      // If the `refresh` prop changes (and is true), fetch data
      let url = baseURL +
        `/daily_report?channel=""&startDate="${this.props.startdate}"&endDate="${this.props.enddate}"`


      axios.all([
        axios.get(url, axiosConfig)
      ]).then(axios.spread((branchResponse) => {

        this.setState({
          total: branchResponse.data
        })
      })).catch(error => {

        console.log('jwtcheck', error.response)

        // window.location.href = "/log_in";
      })
    }



  }
  render() {
    const { activeIndex } = this.state;

    return (
      <>
        <Col lg={3} xs={12}>
          <Card>

            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <h5 className="bold-text">Total Tickers</h5>
              </div>
              <div className="dashboard__total pull-right" >
                <TrendingUpIcon className="dashboard__trend-icon" />
                <p className="dashboard__total-stat" style={{ fontSize: "30px" }}>

                  {this.state.total ? this.state.total.ticket[0].total_session : 0}

                </p>
                <div className="dashboard__chart-container">
                  <ResponsiveContainer height={50}>
                    <BarChart data={data}>
                      <Bar dataKey="pv" onClick={this.handleClick}>
                        {
                          data.map((entry, index) => (
                            <Cell
                              cursor="pointer"
                              fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                              key={`cell-${index}`}
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={3} xs={12}>
          <Card>
            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <h5 className="bold-text">Withdrawals</h5>
              </div>
              <div className="dashboard__total pull-right" >
                <TrendingUpIcon className="dashboard__trend-icon" />
                <p className="dashboard__total-stat" style={{ fontSize: "30px" }}>

                  {this.state.total ? this.state.total.winners[0].winnercount : 0}

                </p>
                <div className="dashboard__chart-container">
                  <ResponsiveContainer height={50}>
                    <BarChart data={data}>
                      <Bar dataKey="pv" onClick={this.handleClick}>
                        {
                          data.map((entry, index) => (
                            <Cell
                              cursor="pointer"
                              fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                              key={`cell-${index}`}
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} xs={12}>
          <Card>
            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <h5 className="bold-text">Total Withdrawal Amount</h5>
              </div>
              <div className="dashboard__total pull-right" >
                <TrendingUpIcon className="dashboard__trend-icon" />
                <p className="dashboard__total-stat" style={{ fontSize: "30px" }}>

                  {this.state.total ? this.state.total.winners[0].amount : 0}

                </p>
                <div className="dashboard__chart-container">
                  <ResponsiveContainer height={50}>
                    <BarChart data={data}>
                      <Bar dataKey="pv" onClick={this.handleClick}>
                        {
                          data.map((entry, index) => (
                            <Cell
                              cursor="pointer"
                              fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                              key={`cell-${index}`}
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} xs={12}>
          <Card>
            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <h5 className="bold-text">Deposits</h5>
              </div>
              <div className="dashboard__total pull-right" >
                <TrendingUpIcon className="dashboard__trend-icon" />
                <p className="dashboard__total-stat" style={{ fontSize: "30px" }}>

                  {this.state.total ? this.state.total.deposit[0].mcount : 0}

                </p>
                <div className="dashboard__chart-container">
                  <ResponsiveContainer height={50}>
                    <BarChart data={data}>
                      <Bar dataKey="pv" onClick={this.handleClick}>
                        {
                          data.map((entry, index) => (
                            <Cell
                              cursor="pointer"
                              fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                              key={`cell-${index}`}
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={3} xs={12}>
          <Card>
            <CardBody className="dashboard__card-widget">
              <div className="card__title">
                <h5 className="bold-text">Total Deposit Amount</h5>
              </div>
              <div className="dashboard__total pull-right" >
                <TrendingUpIcon className="dashboard__trend-icon" />
                <p className="dashboard__total-stat" style={{ fontSize: "30px" }}>

                  {this.state.total ? this.state.total.deposit[0].amount : 0}

                </p>
                <div className="dashboard__chart-container">
                  <ResponsiveContainer height={50}>
                    <BarChart data={data}>
                      <Bar dataKey="pv" onClick={this.handleClick}>
                        {
                          data.map((entry, index) => (
                            <Cell
                              cursor="pointer"
                              fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                              key={`cell-${index}`}
                            />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default withTranslation('common')(BreakingAdminnews);
