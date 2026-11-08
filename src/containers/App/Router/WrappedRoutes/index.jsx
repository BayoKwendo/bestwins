import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// import Applicants from '../../../Applicants/Applicant';
// import ApplicantDetails from '../../../Applicants/ApplicantDetails';
// import ApplicantPay from '../../../Applicants/ApplicantPay';
// import ApplicantSwitch from '../../../Applicants/ApplicantSwitch';
import Layout from '../../../Layout/index'
import { UserSearch } from '../../../Users/usersearch'
import { UserDetails } from '../../../Users/userdetails'
import { Games } from '../../../Users/games'
import { Statement } from '../../../Users/statement'
import { DailyDeposit } from '../../../Transactions/dailydeposits'

import DepositPerHour from '../../../Transactions/depositPerHour'

import { DepositRequests } from '../../../Transactions/depositrequests'
import { WithdrawRequest } from '../../../Transactions/withdrawalrequests'
import { DailyWithdrawal } from '../../../Transactions/dailywithdraw'
import { DepositRequestOne } from '../../../Transactions/depositrequestOne'
import { WithdrawRequestOne } from '../../../Transactions/withdrawalrequestOne'
import { BlackList } from '../../../blackList/blacklist'
import { Ledger } from '../../../Ledger/Legder'
import { EWallet } from '../../../Ewaller/ewallet'
import { GamingIncome } from '../../../Ewaller/gameincome'
import { Winners } from '../../../Users/Winners'
import { BetPerHour } from '../../../Bets/bets'
import { BetsPerDay } from '../../../Bets/betsperday'
import { AverageBet } from '../../../Bets/AvarageBet'
import { TimePlayed } from '../../../Bets/timeplayed'
import { createBlackList } from '../../../blackList/createBlackList'
import LoginAudit from '../../../Users/LoginAudit'
import { USSDLogs } from '../../../Users/uusdlogs'

import { SendBlast } from '../../../Blast/sendBlast'
import { SendBlastIanctive } from '../../../Blast/sendBlastInactive.jsx'

import FileUploadDefault from '../../../CSV/components/FileUploadDefault'
import { SendBlastlUCKY4 } from '../../../Blast/sendBlastLucky4'
import { Customers } from '../../../Users/Customers'

import { Players } from '../../../Users/Players'

import { BoundMessages } from '../../../Users/bounds'
import { CustomersPresenter } from '../../../Users/CustomersPresenters'
import { NewlyCustomersCount } from '../../../Users/perday'
import UsersStaffs from '../../../Users/UsersStaffs'
import { PlayersHour } from '../../../Users/PlayersP'
import { CustomerHour } from '../../../Users/CustomersPerHour.jsx'
import { Winner } from '../../../Users/Winner.jsx'
import { PlayerPresenter } from '../../../Users/PlayersPresenter.jsx'
import { WinnerPresenter } from '../../../Users/WinnerPresenter.jsx'
import Default from '../../../Dashboards/Default/index.jsx'
import { CustomerHourP } from '../../../Users/CustomersPerHouP.jsx'
import { WinnerRetry } from '../../../Users/WinnerRty.jsx'
import { ROLE } from '../../../../configs/exports.js'
import AutoWin from '../../../Users/AutoWin.jsx'
import UserBasket from '../../../Users/UserBasket.jsx'



const validPathPresender = [
  '/stats_presenter',
];

const validPaths = [
  '/find_user',
  '/userdetail',
  '/game',
  '/bound',
  '/customer_presenter',
  '/per_day_customers',
  '/users',
  '/stats',
  '/stats_presenter',
  '/winner_presenter',
  '/statement',
  '/statistics',
  '/players',
  '/player_hours',
  '/sendblast',
  '/sendInactiveBlast',
  '/daily_deposits',
  '/deposit_per_hour',
  '/deposit_requests',
  '/withdrawal_request',
  '/daily_withdrawal',
  '/deposit_request_one',
  '/withdraw_request_one',
  '/reconciliation',
  '/lucky4',
  '/dashboard',
  '/blacklist',
  '/ledger',
  '/ewallet',
  '/game_income',
  '/winners',
  '/winner',
  '/basket',
  '/player_presenter',
  '/bet_per_hour',
  '/bet_per_day',
  '/avarage_bet',
  '/auto_win',
  '/time_played',
  '/addblacklist',
  '/login_audit',
  '/ussdlogs',
  '/winner_retry'
];

export default () => (
  <div>
    <Layout />
    <div className='container__wrap'>
      <Route exact path='/find_user' component={UserSearch} />
      <Route exact path='/userdetail' component={UserDetails} />
      <Route exact path='/game' component={Games} />

      <Route exact path='/auto_win' component={AutoWin} />


      <Route exact path='/bound' component={BoundMessages} />

      <Route exact path='/customer_presenter' component={CustomersPresenter} />

      <Route exact path='/per_day_customers' component={NewlyCustomersCount} />

      <Route exact path='/users' component={UsersStaffs} />

      <Route exact path='/stats' component={CustomerHour} />

      <Route exact path='/stats_presenter' component={CustomerHourP} />



      <Route exact path='/winner_presenter' component={WinnerPresenter} />

      <Route exact path='/statement' component={Statement} />

      <Route exact path='/statistics' component={Customers} />

      <Route exact path='/players' component={Players} />
      <Route exact path='/player_hours' component={PlayersHour} />

      <Route exact path='/sendblast' component={SendBlast} />
      <Route exact path='/sendInactiveBlast' component={SendBlastIanctive} />

      <Route exact path='/daily_deposits' component={DailyDeposit} />

      <Route exact path='/deposit_per_hour' component={DepositPerHour} />

      <Route exact path='/deposit_requests' component={DepositRequests} />

      <Route exact path='/withdrawal_request' component={WithdrawRequest} />
      <Route exact path='/daily_withdrawal' component={DailyWithdrawal} />
      <Route exact path='/deposit_request_one' component={DepositRequestOne} />


      <Route exact path='/basket' component={UserBasket} />


      <Route exact path='/withdraw_request_one' component={WithdrawRequestOne} />

      <Route exact path='/reconciliation' component={FileUploadDefault} />

      <Route exact path='/lucky4' component={SendBlastlUCKY4} />
      <Route exact path='/dashboard' component={Default} />


      <Route exact path='/blacklist' component={BlackList} />

      <Route exact path='/ledger' component={Ledger} />

      <Route exact path='/ewallet' component={EWallet} />

      <Route exact path='/game_income' component={GamingIncome} />

      <Route exact path='/winners' component={Winners} />

      <Route exact path='/winner' component={Winner} />

      <Route exact path='/player_presenter' component={PlayerPresenter} />


      <Route exact path='/bet_per_hour' component={BetPerHour} />

      <Route exact path='/bet_per_day' component={BetsPerDay} />

      <Route exact path='/avarage_bet' component={AverageBet} />

      <Route exact path='/time_played' component={TimePlayed} />

      <Route exact path='/addblacklist' component={createBlackList} />

      <Route exact path='/login_audit' component={LoginAudit} />
      <Route exact path='/ussdlogs' component={USSDLogs} />

      <Route exact path='/winner_retry' component={WinnerRetry} />


      <Route path="/" render={({ location }) => {
        // Check if the current path is not in validPaths
        if (!validPaths.includes(location.pathname)) {
          return <Redirect to="/login" />;
        }
        else if (ROLE !== '1' && !validPathPresender.includes(location.pathname)) {
          return <Redirect to="/login" />;
        }

        return null; // This line is a fallback
      }} />


      {/* <Route path="/applicant_details" component={ApplicantDetails} />

     
      <Route path="/applicant" component={Applicants} />

      
      <Route path="/applicant_records" component={ApplicantPay} />

      <Route path="/applicant_switch" component={ApplicantSwitch} />

      <Route path="/add_applicant" component={AddApplicant} />

     
      <Route path="/edit_profile" component={EditApplicant} />
    
 */}
    </div>
  </div>
)
