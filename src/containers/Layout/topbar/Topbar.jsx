import React from 'react';
import PropTypes from 'prop-types';
import { UserProps } from '../../../shared/prop-types/ReducerProps';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
// import TopbarMail from './TopbarMail';
// import TopbarNotification from './TopbarNotification';
// import TopbarSearch from './TopbarSearch';
// import TopbarLanguage from './TopbarLanguage';

const Topbar = ({
  changeMobileSidebarVisibility, changeSidebarVisibility, user,
}) => (
  <div className="topbar">
    <div className="topbar__left">
      <TopbarSidebarButton
        changeMobileSidebarVisibility={changeMobileSidebarVisibility}
        changeSidebarVisibility={changeSidebarVisibility}
      />
      <h3 style={{ marginTop: '15px' }}><b>BestWin</b></h3>
      {/* <Link className="topbar__logo" to="_marketing_dashboard" /> */}
    </div>
    <div className="topbar__right">
      {/* <TopbarNotification />
        <TopbarMail new /> */}
      <TopbarProfile user={user} />
      {/* <TopbarLanguage /> */}
    </div>
  </div>
);

Topbar.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
  changeSidebarVisibility: PropTypes.func.isRequired,
  user: UserProps,
};

Topbar.defaultProps = {
  user: {},
};

export default Topbar;
