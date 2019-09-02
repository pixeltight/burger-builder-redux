import React from 'react'

import css from './Order.css'

const order = (props) => {
  const ingredients = []
  for (let ingredientName in props.ingredients) {
    ingredients.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    })
  }

  const ingredientOutput = ingredients.map(ig => {
    return (
      <span
        key={ig.name}
        style={{textTransform: 'capitalize',
          padding: '5px',
          margin: '0 8px',
          border: '1px solid #CCC',
          display: 'inline-block'}}>
        {ig.name} ({ig.amount})
      </span>
    )
  })
  return (
    <div className={css.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>Price: <strong>{Number.parseFloat(props.price).toFixed(2)}</strong></p>
    </div>
  )
}

export default order
