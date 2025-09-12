import 'bootstrap';
import './style.css';

import * as yup from 'yup'
import { updateUI } from './view.js'

const validateURL = (url, state) => {
  if (state.feeds.includes(url)) {
    return Promise.reject(new Error('RSS уже существует'))
  }
  const schema = yup.string().required().url('Ссылка должна быть валидным URL')
  return schema.validate(url)
    .then(result => state.feeds.push(result))
}

export default () => {
  const state = {
    feeds: [],
    errors: []
  }

  const urlInput = document.querySelector('#url-input')
  const form = document.querySelector('#rss-form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const currentURL = urlInput.value
    validateURL(currentURL, state)
      .then(() => {
        state.errors = []
        updateUI(state, urlInput)
      })
      .catch((error) => {
        state.errors = [error.message]
        updateUI(state, urlInput)
      })
  })
}

