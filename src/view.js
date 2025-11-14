import 'bootstrap'
// import i18n from 'i18next'
import './style.css'
// import onChange from 'on-change'

export const renderErrors = (state, i18n) => {
  const input = document.querySelector('#url-input')
  const feedback = document.querySelector('.feedback')
  feedback.classList.remove('text-success', 'text-danger')
  if (feedback) {
    feedback.textContent = ''
  }
  if (state.errors.length === 0) {
    feedback.textContent = i18n.t('success')
    feedback.classList.add('text-success')
    input.classList.remove('is-invalid')
    input.value = ''
    input.focus()
  }
  else {
    input.focus()
    input.classList.add('is-invalid')
    feedback.classList.add('text-danger')
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
    if (state.uiState.watchedPosts.has(post.postId)) {
      postTitle.classList.add('fw-normal')
    }
    else {
      postTitle.classList.add('fw-bold')
    }

    const prewatchButton = document.createElement('button')
    prewatchButton.classList.add('btn', 'btn-outline-primary')
    prewatchButton.dataset.bsToggle = 'modal'
    prewatchButton.dataset.bsTarget = '#modal'
    prewatchButton.textContent = i18n.t('view.prewatchButton')
    prewatchButton.setAttribute('id', `${post.postId}`)

    prewatchButton.addEventListener('click', (e) => {
      const targetPostId = prewatchButton.id
      state.uiState.watchedPosts.add(targetPostId)
      const modal = document.querySelector('.modal')
      toggleModal(e, state, modal)
    })

    postTitle.append(prewatchButton)
    postsContainer.append(postTitle)
  })
}

export const toggleModal = (e, state, modal) => {
  const targetPostId = e.target.id
  const targetPost = state.posts.find(post => post.postId === targetPostId)
  const targetPostTitle = targetPost.title
  const targetPostDescription = targetPost.description

  const modalTitle = modal.querySelector('.modal-title')
  modalTitle.textContent = targetPostTitle

  const modalTextBreak = modal.querySelector('.text-break')
  modalTextBreak.textContent = targetPostDescription
}
