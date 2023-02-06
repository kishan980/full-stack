import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import ROUTES from "./constants/routes";

import Home from "./components/pages/Home/Home";
import Header from "./components/screens/Header/Header";
import Footer from "./components/screens/Footer/Footer";
import Wizard from "./components/pages/CreateArt/Wizard/Wizard";
import HelpGuide from "./components/pages/HelpGuide/HelpGuide";
import MyCollection from "./components/pages/MyCollection/MyCollection";
import MyCart from "./components/pages/MyCart/MyCart";
import Policy from "./components/pages/Policy/Policy";
import Terms from "./components/pages/Terms/Terms";
import Verify from "./components/pages/Verify/Verify";
import Orders from "./components/pages/Orders/Orders";
import Transactions from "./components/pages/Transactions/Transactions";
import Thankyou from "./components/pages/Thankyou/Thankyou";
import CardShare from "./components/pages/MyCollection/CartSharePage"

import WhiteHeader from "./components/screens/WhiteHeader/WhiteHeader";
import {selectWhiteHeader} from "./store/slices/whiteHeader";
import {useSelector} from "react-redux";
import Contact from "./components/screens/contact/Contact";

const Routes = () => {

    const headerValue = useSelector(selectWhiteHeader);

    return (
        <Router>
            {headerValue ? <WhiteHeader/> : <Header/>}
            <Switch>
                <Route exact path={ROUTES.index} component={Home} />
                <Route exact path={ROUTES.createArt} component={Wizard} />
                <Route exact path={ROUTES.helpGuide} component={HelpGuide} />
                <Route exact path={ROUTES.myCollection} component={MyCollection}/>
                <Route exact path={ROUTES.myCart} component={MyCart}/>
                <Route exact path={ROUTES.orders} component={Orders}/>
                <Route exact path={ROUTES.policy} component={Policy}/>
                <Route exact path={ROUTES.terms} component={Terms}/>
                <Route exact path={ROUTES.verify} component={Verify}/>
                <Route exact path={ROUTES.thankyou} component={Thankyou}/>
                <Route exact path={ROUTES.transaction} component={Transactions}/>
                <Route exact path={ROUTES.resetPassword} component={Home}/>
                <Route exact path={ROUTES.share} component={CardShare} />
                <Route exact path={ROUTES.contact} component={Contact} />
            </Switch>
            <Footer />
        </Router>
    )
}

export default Routes
