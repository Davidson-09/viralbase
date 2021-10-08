import './App.css';
import AdCreation from './pages/advertiser/AdCreation';
import AdDetails from './pages/advertiser/AdDetails';
import AdItem from './pages/advertiser/AdItem';
import AdsPage from './pages/advertiser/AdsPage';
import Home from './pages/advertiser/Home';
import Proceed from './pages/advertiser/Proceed';

import Header from './components/advertiser/Header';
import SignUp from './components/general/SignUp';

import Landing from './Landing.js'

import PromoHeader from './components/promoter/PromoHeader';
import ListOfAds from './components/promoter/ListOfAds';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

// NOTE FOR THE FUTURE: the advertiser part of this website has its pages in a pages folder
// the promoter pages do not
// because I was experimenting with a newly learned folder structure which, it turned out, 
// I did not quite like but I had gone too far to make risky changes

function App() {
  return (
	  <Router>
		<div className="App" style={{paddingLeft:'1em', paddingRight:'1em', height:'100%'}}>

			<Route path='/' exact component={SignUp}/>

			{/* advertiser links */}
			<Switch>
				<Route path='/advertiser/createad' exact component={AdCreation}/>
				<Route path='/advertiser/createad/proceed' component={Proceed}/>
			</Switch>
			<div className='ad_container' >
				<Route path='/advertiser/dashboard' component={Header}/>
				<Switch>
					<Route path='/advertiser/dashboard/Home' component={Home}/>
					<Route path='/advertiser/dashboard/ads' component={AdsPage}/>
					<Route path='/advertiser/dashboard/addetails' component={AdDetails}/>
					<Route path='/advertiser/dashboard/aditem' component={AdItem}/>
				</Switch>
			</div>

			{/* promoter links */}

		</div>
	  </Router>
    
  );
}

export default App;
