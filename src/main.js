import 'bootstrap'
import './style.css'

import * as yup from 'yup'
import i18n from 'i18next'
import { watchStateChanges } from './view.js'
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
      }

      const form = document.querySelector('#rss-form')

      const watchedState = watchStateChanges(state, elements, i18nInstance)

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        const currentURL = elements.urlInput.value
        validateURL(currentURL, watchedState)
          .then((validatedUrl) => {
            watchedState.errors = []
            return getPosts(validatedUrl, watchedState)
          })
          .catch((error) => {
            if (error.name === 'RssError') {
              watchedState.errors = ['errors.invalidRss']
              return
            }
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
