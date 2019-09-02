import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import asyncComponent from './hoc/asyncComponent'
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions/'

const AsyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
})

const AsyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout')
})

const AsyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders')
})

class App extends Component {
  componentDidMount () {
    this.props.onTryAutoSignup()
  }

  render () {
    let routes = (
      <Switch>
        <Route path='/auth' component={AsyncAuth} />
        <Route path='/' exact component={BurgerBuilder} />
        <Redirect to='/' />
      </Switch>
    )

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/checkout' component={AsyncCheckout} />
          <Route path='/orders' component={AsyncOrders} />
          <Route path='/auth' component={AsyncAuth} />
          <Route path='/logout' component={Logout} />
          <Route path='/' exact component={BurgerBuilder} />
          <Redirect to='/' />
        </Switch>
      )
    }

    return (
      <div>
        <Layout>
          <Switch>
            {routes}
          </Switch>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.checkAuthState())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
