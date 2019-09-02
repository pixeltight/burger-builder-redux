import axios from 'axios'

import * as actionTypes from './actionsTypes'

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('expirationDate')
  window.localStorage.removeItem('userId')
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, expirationTime * 1000)
  }
}

// const parseJwt = (token) => {
//   var base64Url = token.split('.')[1]
//   var base64 = base64Url.replace('-', '+').replace('_', '/')
//   return JSON.parse(window.atob(base64))
// }

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart())
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBPuAZu4z9J9_bwe_S87TcMThEi2FbpVtU'
    if (!isSignUp) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBPuAZu4z9J9_bwe_S87TcMThEi2FbpVtU'
    }
    axios.post(url, authData)
      // idToken, localId
      .then(response => {
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
        window.localStorage.setItem('token', response.data.idToken)
        window.localStorage.setItem('expirationDate', expirationDate)
        window.localStorage.setItem('userId', response.data.localId)
        dispatch(authSuccess(response.data.idToken, response.data.localId))
        dispatch(checkAuthTimeout(response.data.expiresIn))
      })
      .catch(err => {
        console.error('[auth fetch error]', err)
        dispatch(authFail(err.response.data.error))
      })
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}

export const checkAuthState = () => {
  return dispatch => {
    const token = window.localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
    } else {
      const expirationDate = new Date(window.localStorage.getItem('expirationDate'))
      if (expirationDate <= new Date()) {
        dispatch(logout())
      } else {
        const userId = window.localStorage.getItem('userId')
        dispatch(authSuccess(token, userId))
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
      }
    }
  }
}
