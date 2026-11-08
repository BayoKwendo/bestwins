import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { baseURL, CONFIG, ROLE, TOKEN } from '../../../configs/exports';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
// import { checkTokenValidity, attemptAutoLogin } from '../../../services/auth'; // You'll need to implement these

const SidebarContent = ({
  onClick,
  changeToLight,
  changeToDark,
  sidebarCollapse
}) => {
  const [tokenValid, setTokenValid] = React.useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const isValid = TOKEN;
      if (!isValid) {
        const autoLoginSuccess = await attemptAutoLogin();
        setTokenValid(autoLoginSuccess);
      } else {
        setTokenValid(true);
      }
    };

    validateToken();
  }, []);

  const hideSidebar = () => {
    onClick();
  };

  // Redirect to login if token is invalid
  if (tokenValid === false) {
    return <Redirect to="/login" />;
  }


  const attemptAutoLogin = async () => {
    try {
      // const refreshToken = getRefreshToken();
      // if (!refreshToken) return false;
      await axios.get(baseURL, CONFIG);
      // saveNewToken(response.data.token);
      return true;
    } catch (error) {
      // clearToken();
      return false;
    }
  };
  // Show loading state while checking token
  if (tokenValid === null) {
    return <div className="sidebar__content">Loading...</div>;
  }

  return (
    <div className='sidebar__content'>
      {ROLE === '1' ? (
        <>
          <SidebarLink
            title='DashBoard'
            icon='apartment'
            route='/dashboard'
            onClick={hideSidebar}
          />

          <SidebarLink
            title='Ticket Logs'
            icon='users'
            route='/stats'
            onClick={hideSidebar}
          />
          <SidebarLink
            title='Deposits'
            icon='briefcase'
            route='/players'
            onClick={hideSidebar}
          />

          <SidebarLink
            title='AutoWin'
            icon='briefcase'
            route='/auto_win'
            onClick={hideSidebar}
          />
          <SidebarLink
            title='Withdrawals'
            icon='briefcase'
            route='/winner'
            onClick={hideSidebar}
          />

          <SidebarLink
            title='Basket'
            icon='briefcase'
            route='/basket'
            onClick={hideSidebar}
          />


          <SidebarLink
            title='Customers'
            icon='users'
            route='/per_day_customers'
            onClick={hideSidebar}
          />

          <SidebarLink
            title='Withdrawal Retry'
            icon='briefcase'
            route='/winner_retry'
            onClick={hideSidebar}
          />
          <SidebarLink
            title='Presenters'
            icon='users'
            route='/users'
            onClick={hideSidebar}
          />
        </>
      ) : (
        <>
          {/* <SidebarLink
            title='Stats'
            icon='briefcase'
            route='/player_presenter'
            onClick={hideSidebar}
          /> */}

          <SidebarLink
            title='Ticket Logs'
            icon='users'
            route='/stats_presenter'
            onClick={hideSidebar}
          />
          {/* <SidebarLink
            title='Winners'
            icon='users'
            route='/winner_presenter'
            onClick={hideSidebar}
          /> */}


        </>
      )}
      <ul className='sidebar__block'>
        <SidebarLink title='Log Out' icon='exit' route='/' />
      </ul>
    </div>
  )
}
SidebarContent.propTypes = {
  changeToDark: PropTypes.func.isRequired,
  changeToLight: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  sidebarCollapse: PropTypes.bool
}
SidebarContent.defaultProps = {
  sidebarCollapse: false
}
export default SidebarContent
