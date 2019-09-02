import * as actionTypes from './actionsTypes'
import axios from '../../axios-orders'

export const addIngredient = (ingName) => {
  return ({
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: ingName
  })
}

export const deleteIngredient = (ingName) => ({
  type: actionTypes.DELETE_INGREDIENT,
  ingredientName: ingName
})

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
}

export const initIngredients = () => {
  return dispatch => {
    axios('https://react-burger-3f53f.firebaseio.com/ingredients.json')
      .then(resp => {
        dispatch(setIngredients(resp.data))
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed())
        console.error(error)
      })
  }
}
