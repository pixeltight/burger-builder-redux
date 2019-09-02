import * as actionTypes from '../actions/actionsTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  isBuilding: false
}

const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 0.9,
  bacon: 1.2,
  meat: 2
}

const addIngredient = (state, action) => {
  const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient)
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    isBuilding: true
  }
  return updateObject(state, updatedState)
}

const deleteIngredient = (state, action) => {
  const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient)
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
    isBuilding: true
  }
  return updateObject(state, updatedState)
}

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.ingredients,
    error: false,
    totalPrice: 4,
    isBuilding: false
  })
}

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, { error: true })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action)
    case actionTypes.DELETE_INGREDIENT: return deleteIngredient(state, action)
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action)
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action)
    default: return state
  }
}

export default reducer
