import * as actionTypes from './actionsTypes'
import axios from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
}

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  }
}

export const purchaseBurgerInit = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_INIT
  }
}

export const purchaseBurger = (orderData, token) => {
  return dispatch => {
    dispatch(purchaseBurgerInit())
    axios.post('/orders.json?auth=' + token, orderData)
      .then(response => {
        dispatch(purchaseBurgerSuccess(response.data.name, orderData))
      })
      .catch(err => {
        dispatch(purchaseBurgerFail(err))
      })
  }
}

export const purchaseStart = () => ({
  type: actionTypes.PURCHASE_START
})

export const fetchOrdersSuccess = (orders) => ({
  type: actionTypes.FETCH_ORDERS_SUCCESS,
  orders: orders
})

export const fetchOrdersFail = (error) => ({
  type: actionTypes.FETCH_ORDERS_FAIL,
  error: error
})

export const fetchOrdersStart = () => ({
  type: actionTypes.FETCH_ORDERS_START
})

export const fetchOrders = (token, userId) => {
  return dispatch => {
    dispatch(fetchOrdersStart())
    const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'
    axios.get('/orders.json' + queryParams)
      .then(res => {
        const fetchedOrders = []
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          })
        }
        dispatch(fetchOrdersSuccess(fetchedOrders))
      })
      .catch(err => {
        dispatch(fetchOrdersFail(err))
      })
  }
}
