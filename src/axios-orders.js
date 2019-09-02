import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://react-burger-3f53f.firebaseio.com/'
})

export default instance
