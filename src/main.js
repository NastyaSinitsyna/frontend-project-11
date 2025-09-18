import 'bootstrap';
import './style.css';

import * as yup from 'yup'
import onChange from 'on-change'
import i18n from 'i18next'
import { updateUI } from './view.js'
import ru from './locales/ru.js'

const validateURL = (url, state) => {
  const schema = yup.string().required().url().notOneOf(state.feeds)
  return schema.validate(url)
    .then(result => state.feeds.push(result))
}

const app = () => {
  const i18nInstance = i18n.createInstance()
  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru: ru,
    },
  })
  .then((t) => {
    yup.setLocale({
      mixed: {
        notOneOf: () => i18nInstance.t('errors.duplicate'),
      },
      string: {
        url: () => i18nInstance.t('errors.invalidUrl'),
      },
    })
  
    const state = {
      feeds: [],
      errors: [],
    }

    const urlInput = document.querySelector('#url-input')
    const form = document.querySelector('#rss-form')

    const watchedState = onChange(state, () => {
      updateUI(watchedState, urlInput, i18nInstance);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const currentURL = urlInput.value
      validateURL(currentURL, watchedState)
        .then(() => {
          watchedState.errors = []
        })
        .catch((error) => {
          switch (error.type) {
            case 'notOneOf':
              watchedState.errors = ['errors.duplicate']
              break
            case 'url':
              watchedState.errors = ['errors.invalidUrl']
              break
            default:
              watchedState.errors = ['errors.unknown']
          }
        })
    })
  })
}

export default app
