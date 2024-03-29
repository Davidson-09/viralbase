import './App.css';
import AdCreation from './pages/advertiser/AdCreation';
import AdDetails from './pages/advertiser/AdDetails';
import Home from './pages/advertiser/Home';
import Proceed from './pages/advertiser/Proceed';

import Header from './components/advertiser/Header';
import AdAccount from './components/advertiser/AdAccount';
import SignUp from './components/general/SignUp';
import Login from './components/general/Login';
import ChangePassword from './components/general/ChangePassword';
import Select from './components/general/Select';
import ConfirmAccount from './components/general/ConfirmAccount';
 
import PromoHeader from './components/promoter/PromoHeader'
import ListOfAds from './components/promoter/ListOfAds'

import Landing from './Landing.js'
import Landing2 from './Landing2.js'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AdPage from './components/promoter/AdPage';
import PromoAccount from './components/promoter/PromoAccount';
import Promotions from './components/promoter/Promotions';
import PromotionDetails from './components/promoter/PromotionDetails';
import Widthdraw from './components/promoter/Widthdraw';
import Promotion from './components/general/Promotion';
import PageNotFound from './components/general/PageNotFound';
import SearchPage from './components/promoter/SearchPage';
import ChooseAdvertisers from './components/promoter/ChooseAdvertisers';
import {UserProvider} from './contexts/UserContext';

import AdvertisersList from './components/promoter/AdvertisersList';


// NOTE FOR THE FUTURE: the advertiser part of this website has its pages in a pages folder
// the promoter pages do not
// because I was experimenting with a newly learned folder structure which, it turned out, 
// I did not quite like but I had gone too far to make risky changes
// influencers were formerly advertisers

function App() {
  return (
	  <Router>
		<div className="App" style={{}}>
			<Route path='/' exact component={Landing}/>
			<Route path='/music' exact component={Landing2}/>
			<Switch>
				<Route path='/login' component={Login}/>
				<Route path='/signup/:role' component={SignUp}/>
				<Route path='/changepassword' component={ChangePassword}/>
				<Route path='/select' component={Select}/>
				<Route path='/promotion/:promo' component={Promotion}/>
				<Route path='/pagenotfound' component={PageNotFound}/>
				<Route path='/confirmaccount' component={ConfirmAccount}/>
				
			</Switch>

			{/* influencer links */}
			<Switch>
				<Route path='/influencer/createpost' exact component={AdCreation}/>
				<Route path='/influencer/purchaseimpressions' component={Proceed}/>
				<Route path='/influencer/addetails' component={AdDetails}/>
			</Switch>
			<div className='ad_container' >
				<Route path='/influencer/dashboard' component={Header}/>
				<Switch>
					<Route path='/influencer/dashboard/Home' component={Home}/>
					<Route path='/influencer/dashboard/account' component={AdAccount}/>
				</Switch>
			</div>

			{/* promoter links */}

			<Route path='/promoter/front' component={PromoHeader}/>
			<Switch>
				<Route path='/promoter/front/home' component={AdvertisersList}/>
				<Route path='/promoter/front/account' component={PromoAccount}/>
				<Route path='/promoter/front/promotions' component={Promotions}/>
				<Route path='/promoter/front/adlist/:advertiser' component={ListOfAds}/>
			</Switch>
			<Route path='/promoter/addetails/:ad' component={AdPage}/>
			<Route path='/promoter/promotionDetails' component={PromotionDetails}/>
			<Route path='/promoter/withdraw/:user' component={Widthdraw}/>
			<Route path='/promoter/search/:searchterm' component={SearchPage} />
			
		</div>
		{/*<footer>
			contact us:
			support@myviralbase.com
		</footer>*/}
	  </Router>
  );
}

export default App;
