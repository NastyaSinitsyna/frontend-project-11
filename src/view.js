import 'bootstrap'
// import i18n from 'i18next'
import './style.css'

export const renderErrors = (state, i18n) => {
  const input = document.querySelector('#url-input')
  const feedback = document.querySelector('.feedback')
  if (feedback) {
    feedback.textContent = ''
  }
  if (state.errors.length === 0) {
    input.classList.remove('is-invalid')
    input.value = ''
    input.focus()
  }
  else {
    input.focus()
    input.classList.add('is-invalid')
    feedback.textContent = state.errors
      .map(errKey => i18n.t(errKey))
      .join(', ')
  }
}

export const renderFeedsAndPosts = (state, i18n) => {
  const feedsContainer = document.querySelector('.feeds')
  feedsContainer.innerHTML = ''
  const feedsHeader = document.createElement('h2')
  feedsHeader.textContent = i18n.t('view.feedsHeader')
  feedsContainer.append(feedsHeader)
  state.feeds.forEach((feed) => {
    const feedTitle = document.createElement('h3')
    feedTitle.textContent = feed.title
    feedsContainer.appendChild(feedTitle)
  })

  const postsContainer = document.querySelector('.posts')
  postsContainer.innerHTML = ''
  const postsHeader = document.createElement('h2')
  postsHeader.textContent = i18n.t('view.postsHeader')
  postsContainer.append(postsHeader)
  state.posts.forEach((post) => {
    const postTitle = document.createElement('h3')
    postTitle.textContent = post.title
    postsContainer.appendChild(postTitle)
  })
}
