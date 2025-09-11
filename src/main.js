import 'bootstrap';
import './style.css';

import * as yup from 'yup'
import { updateUI } from './view.js'

const validateURL = (url, state) => {
  if (state.feeds.includes(url)) {
    state.errors.push('RSS уже существует')
  }
  const schema = yup.string().required().url('Ссылка должна быть валидным URL')
  return schema.validate(url)
    .then(result => state.feeds.push(result))
    .catch(error => state.errors.push(error.message))
}

export default () => {
  const state = {
    feeds: [],
    errors: []
  }

  const urlInput = document.querySelector('#url-input')
  const button = document.querySelector('button')

  button.addEventListener('submit', (e) => {
    e.preventDefault()
    const currentURL = urlInput.value
    validateURL(currentURL, state)
    updateUI(state, urlInput)
  })
}

