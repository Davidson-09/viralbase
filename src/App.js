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
 
import PromoHeader from './components/promoter/PromoHeader'
import ListOfAds from './components/promoter/ListOfAds'

import Landing from './Landing.js'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AdPage from './components/promoter/AdPage';
import PromoAccount from './components/promoter/PromoAccount';
import Promotions from './components/promoter/Promotions';
import Search from './components/promoter/Search';
import PromotionDetails from './components/promoter/PromotionDetails';
import Widthdraw from './components/promoter/Widthdraw';
import Promotion from './components/general/Promotion';
import PageNotFound from './components/general/PageNotFound';


// NOTE FOR THE FUTURE: the advertiser part of this website has its pages in a pages folder
// the promoter pages do not
// because I was experimenting with a newly learned folder structure which, it turned out, 
// I did not quite like but I had gone too far to make risky changes

function App() {
  return (
	  <Router>
		<div className="App" style={{}}>
			<Route path='/' exact component={Landing}/>
			<Switch>
				<Route path='/login' component={Login}/>
				<Route path='/signup/:role' component={SignUp}/>
				<Route path='/changepassword' component={ChangePassword}/>
				<Route path='/select' component={Select}/>
				<Route path='/promotion/:promo' component={Promotion}/>
				<Route path='/pagenotfound' component={PageNotFound}/>
				
			</Switch>

			{/* advertiser links */}
			<Switch>
				<Route path='/advertiser/createad' exact component={AdCreation}/>
				<Route path='/advertiser/purchaseimpressions' component={Proceed}/>
				<Route path='/advertiser/addetails/:adid' component={AdDetails}/>
			</Switch>
			<div className='ad_container' >
				<Route path='/advertiser/dashboard' component={Header}/>
				<Switch>
					<Route path='/advertiser/dashboard/Home' component={Home}/>
					<Route path='/advertiser/dashboard/account' component={AdAccount}/>
				</Switch>
			</div>

			{/* promoter links */}

			<Route path='/promoter/front' component={PromoHeader}/>
			<Switch>
				<Route path='/promoter/front/home' component={ListOfAds}/>
				<Route path='/promoter/front/account' component={PromoAccount}/>
				<Route path='/promoter/front/promotions' component={Promotions}/>
				<Route path='/promoter/front/search/:searchterm' component={Search} />
			</Switch>
			<Route path='/promoter/addetails/:ad' component={AdPage}/>
			<Route path='/promoter/promotionDetails/:promotion' component={PromotionDetails}/>
			<Route path='/promoter/withdraw/:user' component={Widthdraw}/>
			
		</div>
	  </Router>
  );
}

export default App;
