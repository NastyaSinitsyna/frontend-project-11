import 'bootstrap'
import './style.css'
import onChange from 'on-change'

const resetForm = (elements) => {
  const { urlInput, feedback } = elements
  urlInput.classList.remove('is-invalid')
  feedback.classList.remove('text-success', 'text-danger')
  feedback.textContent = ''
  urlInput.focus()
}

const renderFormErrors = (state, elements, i18n) => {
  if (!state.formError) {
    return
  }
  resetForm(elements)
  const { urlInput, feedback } = elements
  feedback.textContent = i18n.t(state.formError)
  feedback.classList.add('text-danger')
  urlInput.classList.add('is-invalid')
}

const renderRequestErrors = (state, elements, i18n) => {
  if (!state.requestError) {
    return
  }
  resetForm(elements)
  const { feedback } = elements
  feedback.textContent = i18n.t(state.requestError)
  feedback.classList.add('text-danger')
}

const renderSuccessRequest = (elements, i18n) => {
  resetForm(elements)
  const { urlInput, feedback } = elements
  feedback.textContent = i18n.t('success')
  feedback.classList.add('text-success')
  urlInput.value = ''
  urlInput.classList.remove('is-invalid')
}

const renderFeeds = (state, elements, i18n) => {
  const feedsContainer = elements.feedsContainer
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
}

const renderPosts = (state, elements, i18n) => {
  const postsContainer = elements.postsContainer
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
    prewatchButton.classList.add('btn', 'btn-outline-primary', 'prewatch-btn')
    prewatchButton.dataset.bsToggle = 'modal'
    prewatchButton.dataset.bsTarget = '#modal'
    prewatchButton.textContent = i18n.t('view.prewatchButton')
    prewatchButton.setAttribute('id', `${post.postId}`)

    postItem.append(postTitle, prewatchButton)
    postsList.append(postItem)
  })
}

const toggleModal = (state, elements) => {
  const modal = elements.modal
  const targetPostId = state.uiState.currentPost
  const targetPost = state.posts.find(post => post.postId === targetPostId)
  const targetPostTitle = targetPost.title
  const targetPostDescription = targetPost.description

  const modalTitle = modal.querySelector('.modal-title')
  modalTitle.textContent = targetPostTitle

  const modalTextBreak = modal.querySelector('.text-break')
  modalTextBreak.textContent = targetPostDescription
}

const updateFormState = (state, elements) => {
  const isProcessing = state.requestStatus === 'processing'
  elements.urlInput.disabled = isProcessing
  elements.submitButton = isProcessing
}

export const watchStateChanges = (state, elements, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'feeds':
        renderFeeds(watchedState, elements, i18n)
        break
      case 'posts':
        renderPosts(watchedState, elements, i18n)
        break
      case 'uiState.currentPost':
        toggleModal(watchedState, elements)
        renderPosts(watchedState, elements, i18n)
        break
      case 'requestStatus':
        updateFormState(watchedState, elements)
        if (watchedState.requestStatus === 'idle'
          && watchedState.formError === null
          && watchedState.requestError === null) {
          renderSuccessRequest(elements, i18n)
        }
        break
      case 'formError':
        renderFormErrors(watchedState, elements, i18n)
        updateFormState(watchedState, elements)
        break
      case 'requestError':
        renderRequestErrors(watchedState, elements, i18n)
        break
      default:
        return
    }
  })
  return watchedState
}
