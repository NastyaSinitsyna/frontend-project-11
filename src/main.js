import 'bootstrap'
import './style.css'

import * as yup from 'yup'
// import axios from 'axios'
import onChange from 'on-change'
import i18n from 'i18next'
import { renderErrors, renderFeedsAndPosts } from './view.js'
import ru from './locales/ru.js'
import validateURL from './validateURL.js'
import getPosts from './getPosts.js'
import updatePosts from './updatePosts.js'

export default () => {
  const i18nInstance = i18n.createInstance()
  i18nInstance.init({
    lng: 'ru',
    resources: {
      ru: ru,
    },
  })
    .then(() => {
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
        posts: [],
        errors: [],
        uiState:
          { watchedPosts: new Set() },
      }

      const urlInput = document.querySelector('#url-input')
      const form = document.querySelector('#rss-form')

      const watchedState = onChange(state, () => {
        renderErrors(watchedState, i18nInstance)
        renderFeedsAndPosts(watchedState, i18nInstance)
      })

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        const currentURL = urlInput.value
        validateURL(currentURL, watchedState)
          .then((validatedUrl) => {
            watchedState.errors = []
            return getPosts(validatedUrl, watchedState)
          })
          .catch((error) => {
            if (error.name === 'ValidationError') {
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
            }
            else if (error.isAxiosError) {
              watchedState.errors = ['errors.networkError']
            }
            else {
              watchedState.errors = ['errors.unknown']
            }
          })
      })

      updatePosts(state.feeds, watchedState)
    })
}
