import 'bootstrap'
import './style.css'

import * as yup from 'yup'
import i18n from 'i18next'
import { watchStateChanges } from './view.js'
import ru from './locales/ru.js'
import getLocale from './locales/getLocale.js'
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
      yup.setLocale(getLocale())

      const state = {
        requestStatus: 'idle',
        isFormValid: false,
        feeds: [],
        posts: [],
        error: null,
        uiState: {
          watchedPosts: new Set(),
          currentPost: null,
        },
      }

      const elements = {
        urlInput: document.querySelector('#url-input'),
        feedback: document.querySelector('.feedback'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
        modal: document.querySelector('.modal'),
        submitButton: document.querySelector('button[type="submit"]'),
      }

      const form = document.querySelector('#rss-form')

      const watchedState = watchStateChanges(state, elements, i18nInstance)

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        watchedState.requestStatus = 'processing'
        const currentURL = elements.urlInput.value
        validateURL(currentURL, watchedState)
          .then((validatedUrl) => {
            watchedState.error = null
            watchedState.isFormValid = true
            return getPosts(validatedUrl, watchedState)
          })
          .catch((error) => {
            watchedState.requestStatus = 'failed'
            switch (error.name) {
              case 'RssError':
                watchedState.error = 'errors.invalidRss'
                break
              case 'AxiosError':
                watchedState.error = 'errors.networkError'
                break
              case 'ValidationError':
                watchedState.error = `errors.${error.type}`
                break
              default:
                watchedState.error = 'errors.unknown'
            }
          })
      })

      elements.postsContainer.addEventListener('click', (e) => {
        const prewatchButton = e.target.closest('.prewatch-btn')
        if (!prewatchButton) {
          return
        }
        const targetPostId = prewatchButton.id
        watchedState.uiState.watchedPosts.add(targetPostId)
        watchedState.uiState.currentPost = targetPostId
      })

      updatePosts(state.feeds, watchedState)
    })
}
