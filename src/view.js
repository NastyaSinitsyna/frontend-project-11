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
  feedsContainer.classList.add('vstack', 'gap-3', 'mx-auto', 'col-md-10', 'col-lg-8')

  const feedsHeader = document.createElement('h2')
  feedsHeader.textContent = i18n.t('view.feedsHeader')
  feedsContainer.append(feedsHeader)
  const feedsList = document.createElement('ul')
  feedsList.classList.add('list-group')
  feedsContainer.append(feedsList)
  state.feeds.forEach((feed) => {
    const feedItem = document.createElement('li')
    feedItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0')
    const feedTitle = document.createElement('h3')
    feedTitle.textContent = feed.title
    feedTitle.classList.add('h6')

    const feedDescription = document.createElement('p')
    feedDescription.textContent = feed.description
    feedDescription.classList.add('small')

    feedItem.append(feedTitle, feedDescription)
    feedsList.append(feedItem)
  })

  const postsContainer = document.querySelector('.posts')
  postsContainer.innerHTML = ''
  postsContainer.classList.add('vstack', 'gap-3', 'mx-auto', 'col-md-10', 'col-lg-8')
  const postsHeader = document.createElement('h2')
  postsHeader.textContent = i18n.t('view.postsHeader')
  postsContainer.append(postsHeader)
  const postsList = document.createElement('ul')
  postsList.classList.add('list-group')
  postsContainer.append(postsList)
  state.posts.forEach((post) => {
    const postItem = document.createElement('li')
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0')
    const postTitle = document.createElement('a')
    postTitle.setAttribute('href', post.link)
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

    postItem.append(postTitle, prewatchButton)
    postsList.append(postItem)
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
