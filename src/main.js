import 'bootstrap'
import './style.css'

import * as yup from 'yup'
import i18n from 'i18next'
import { watchStateChanges } from './view.js'
import ru from './locales/ru.js'
import getLocale from './locales/getLocale.js'
import validateURL from './validateURL.js'
import { getPosts, refreshTimeOut, updatePosts } from './getPosts.js'

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
        request: {
          status: 'idle',
          error: null,
        },
        form: {
          isValid: false,
          error: null,
        },
        feeds: [],
        posts: [],
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
        const currentURL = elements.urlInput.value
        validateURL(currentURL, watchedState)
          .then((validatedUrl) => {
            watchedState.form = {
              isValid: true,
              error: null,
            }
            watchedState.request = {
              status: 'processing',
              error: null,
            }
            return getPosts(validatedUrl, watchedState)
          })
          .catch((error) => {
            switch (error.name) {
              case 'ValidationError':
                watchedState.form = {
                  isValid: false,
                  error: `errors.${error.type}`,
                }
                break
              case 'RssError':
                watchedState.request = {
                  status: 'failed',
                  error: 'errors.invalidRss',
                }
                break
              case 'AxiosError':
                watchedState.request = {
                  status: 'failed',
                  error: 'errors.networkError',
                }
                break
              default:
                watchedState.request = {
                  status: 'failed',
                  error: 'errors.unknown',
                }
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

      setTimeout(() => updatePosts(watchedState), refreshTimeOut)
    })
}
