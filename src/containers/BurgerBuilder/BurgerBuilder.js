import React, { Component } from 'react'
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/'

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount () {
    this.props.onInitIngredients()
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((acc, el) => {
        return acc + el
      }, 0)
    return sum > 0
  }

  handlePurchase = () => {
    if (this.props.isAuthenticated) {
      this.setState({
        purchasing: true
      })
    } else {
      this.props.onSetAuthRedirectPath('/checkout')
      this.props.history.push('/auth')
    }
  }

  handleCancelPurchase = () => {
    this.setState({
      purchasing: false
    })
  }

  handleContinuePurchase = () => {
    this.props.onPurchaseStart()
    this.props.history.push('/checkout')
  }

  render () {
    const disabledInfo = {
      ...this.props.ingreds
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    let orderSummary = null

    let burger = this.props.error ? <p>Ingredients cant be loaded</p> : <Spinner />

    if (this.props.ingreds) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingreds} />
          <BuildControls
            ingredientAdded={this.props.onAddIngredient}
            ingredientRemoved={this.props.onDeleteIngredient}
            disabled={disabledInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ingreds)}
            isAuth={this.props.isAuthenticated}
            ordered={this.handlePurchase} />
        </Aux>
      )
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ingreds}
          purchaseCancelled={this.handleCancelPurchase}
          purchaseContinued={this.handleContinuePurchase}
          price={this.props.price} />
      )
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.handleCancelPurchase}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    ingreds: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddIngredient: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
    onDeleteIngredient: (ingredientName) => dispatch(actions.deleteIngredient(ingredientName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onPurchaseStart: () => dispatch(actions.purchaseStart()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))
