/* eslint-disable max-len */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { Form } from 'react-bootstrap'
import { Button } from 'reactstrap'
import { MDBCloseIcon } from 'mdbreact'
import { baseURL } from '../../../configs/exports'
import axios from 'axios'
// import img from '../../../_assets/img/ngombe.png'
// import Select from 'react-select';
import CardIcon from 'mdi-react/CardIcon'
import Alert from '../../../shared/components/Alert'
import './style2.css'

const LogIn = () => {
  // initialing hooks
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [statusMessage, setStatusMessage] = React.useState('')
  const [openPassword, isOpenPassword] = React.useState(false)
  const [loading, isLoading] = React.useState('')
  const [loggedin, isLoggedIn] = React.useState(
    localStorage.getItem('isLoggedIn') ? true : false
  )
  // toggle password visibility

  useEffect(() => {
    // check if user was logged in
    if (loggedin) {
      // window.location.href = "dashboard";
    }
  }, [loggedin])



  const handleChangeUsername = event => {
    setUsername(event.target.value)
  }

  const handleChangePassword = event => {
    setPassword(event.target.value)
  }

  const showPasswordToggle = () => {
    // eslint-disable-next-line
    if (showPassword == true) {
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }

  //submit function
  const onSubmit = e => {
    e.preventDefault()
    isLoading(true)
    if (username === '' || password === '') {
      setStatusMessage('')
      setError(true)
      setErrorMessage('Username and password is required')
      setSuccess(false)
      isLoading(false)
    } else {
      let formData = {
        username: username,
        password: password
      }
      axios
        .post(baseURL + 'login', formData, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(response => {
          if (response.data.success) {
            setStatusMessage('Login Success! Redirecting....')
            setError(false)
            setSuccess(true)
            setErrorMessage('')
            localStorage.setItem('name', response.data.message.name)
            localStorage.setItem('user_role', response.data.message.role)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('role_name', response.data.message.role_name)
            localStorage.setItem('hours_from', response.data.message.hours_from)
            localStorage.setItem('hours_to', response.data.message.hours_to)
            localStorage.setItem(
              'mobipesa_name',
              response.data.message.mobipesa_name
            )
            localStorage.setItem('channel', response.data.message.shortcode)
            isLoggedIn(true)
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('name', response.data.message.name)
            // // eslint-disable-next-line
            window.setTimeout(() => {
              // if (response.data.message.role_id === 3 || response.data.message.role_id === 4 || response.data.message.role_id === 2 || response.data.message.role_id === 1) {

              if (response.data.message.role === 1) {
                window.location.href = 'dashboard'
              } else {
                window.location.href = 'stats_presenter'
              }
              isLoading(false)

              // }
            }, 10)
          } else {
            setStatusMessage('')
            setError(true)
            setErrorMessage(response.data.message)
            setSuccess(false)
            window.setTimeout(() => {
              isLoading(false)
              setError(false)
            }, 5000)
          }
        })
        .catch(error => {
          setStatusMessage('')
          setError(true)
          setErrorMessage('Check your inputs')
          setSuccess(false)
          window.setTimeout(() => {
            isLoading(false)
            setError(false)
          }, 5000)
        })
    }
  }

  const closeModalReset = e => {
    isOpenPassword(false)
  }

  // const resetpasswordchange = e => {
  //   isOpenPassword(true);
  // };

  // reset password functions
  const onSubmitPasswordReset = e => {
    e.preventDefault()
    isLoading(true)
    let formData = {
      username: this.state.username,
      password: require('randomstring').generate({
        length: 5,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
      })
    }
    axios
      .post(baseURL + 'password', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then(response => {
        if (response.data.status) {
          setStatusMessage('Success! Check your phone')
          setError(false)
          setSuccess(true)
          setErrorMessage('')
          // eslint-disable-next-line
          window.setTimeout(() => {
            // alert(response.data.user.role)
            isOpenPassword(false)
            setSuccess(false)
            isLoading(false)
          }, 3000)
        } else {
          setStatusMessage('')
          setError(true)
          setErrorMessage(response.data.message)
          setSuccess(false)
          window.setTimeout(() => {
            // alert(response.data.user.role)
            isLoading(false)
            setError(false)
          }, 5000)
        }
      })
      .catch(error => {
        setStatusMessage('')
        setError(true)
        setErrorMessage(error.data.message)
        setSuccess(false)
        window.setTimeout(() => {
          // alert(response.data.user.role)
          isLoading(false)
          setError(false)
        }, 5000)
      })
  }

  // return the UI
  return (
    <div className='elite-login'>
      <Modal
        isOpen={openPassword}
        onRequestClose={e => {
          closeModalReset(e)
        }}
        contentLabel='My dialog'
        className='mymodal'
        onAfterOpen={() => {
          document.body.style.overflow = 'hidden'
        }}
        onAfterClose={() => {
          document.body.removeAttribute('style')
        }}
        overlayClassName='myoverlay'
        closeTimeoutMS={500}
      >
        <MDBCloseIcon onClick={closeModalReset} />
        <h4>
          <b>Reset Password</b>
        </h4>
        <>
          <Form className='form login-form' onSubmit={onSubmitPasswordReset}>
            {/*n  <h5><b>Get Agent Number</b></h5> */}
            <div className='form__form-group'>
              <br></br>
              {success ? (
                <Alert color='success' className='alert--colored'>
                  <span>{statusMessage}</span>
                </Alert>
              ) : null}
              {error && (
                <div>
                  <div color='red' style={{ fontSize: '13px', color: 'red' }}>
                    {errorMessage}
                  </div>
                </div>
              )}
              <span className='form__form-group-label'>Username</span>
              <div className='form__form-group-field'>
                <div className='form__form-group-icon'>
                  <CardIcon />
                </div>
                <Form.Control
                  autoFocus
                  type='text'
                  name='username'
                  style={{ color: 'black', borderColor: 'hsl(0,0%,80%)' }}
                  placeholder='Enter your Username'
                  className='input-without-border-radius'
                  value={username}
                  onChange={handleChangeUsername}
                />
              </div>
              <br />
            </div>
            <div className='account__btns col-8 offset-2'>
              <Button className='account__btn' type='submit' color='success'>
                {' '}
                {loading ? 'Please wait...' : 'Proceed'}
              </Button>
            </div>
          </Form>
        </>
      </Modal>
      <div className='elite-login-sec'>
        <div className='row'>
          <div className='col-md-6 elite-login-left'>
            <div className='carousel-wrap'>
              <div className='item'>
                <div className='item-sec'>
                  <div className='login_slider_image'>
                    {/* <img src={img} alt="logo" /> */}
                  </div>
                  <p className='item-text' style={{ color: 'white' }}></p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6 elite-login-right'>
            <h1 className='elite-login-head'>Besna</h1>
            <form className='elite-login-form' onSubmit={onSubmit}>
              {success ? (
                <Alert color='success' className='alert--colored'>
                  <span>{statusMessage}</span>
                </Alert>
              ) : null}
              {error && (
                <div>
                  <div color='red' style={{ fontSize: '13px', color: 'red' }}>
                    {errorMessage}
                  </div>
                </div>
              )}
              <div className='elite-form-field'>
                <label htmlFor='user_email'>Your username</label>
                <input
                  className='form-control'
                  placeholder='Enter Username'
                  id='elite-username'
                  required='required'
                  type='text'
                  onChange={handleChangeUsername}
                  style={{ borderColor: 'grey' }}
                  value={username}
                  name='username'
                />
              </div>
              <div className='elite-form-field'>
                <label htmlFor='user_email'>Password</label>
                <input
                  placeholder='Enter your password'
                  id='elite-email'
                  className='form-control'
                  required='required'
                  style={{ borderColor: 'grey' }}
                  value={password}
                  onChange={handleChangePassword}
                  type={showPassword === true ? 'text' : 'password'}
                />
                <input type='hidden' name='user_timezone' id='user_timezone' />
                <span
                  toggle='#password-field'
                  onClick={showPasswordToggle}
                  className='fa fa-fw fa-eye field-icon toggle-password'
                />

                {
                  // eslint-disable-next-line
                }
                {/* <p className="elite-agent-pwd" ><a href="#" onClick={resetpasswordchange}
                  data-toggle="modal" data-target="#specialist-forgotModal">
                  Forgot Password?

                </a></p> */}
                <br />
                <br />

                <br />
                <br />
                <br />
                <br />
              </div>

              <button type='submit' className='elite-form-btn'>
                {' '}
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
            </form>
          </div>
          {/* <p onClick={this.resetpasswordchange}>Forgot Password?</p><br></br> */}
        </div>
      </div>
    </div>
  )
}

export default connect(state => ({ theme: state.theme }))(LogIn)
