import 'bootstrap'
// import i18n from 'i18next'
import './style.css'
// import onChange from 'on-change'

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
    postTitle.classList.add('fw-bold')
    const prewatchButton = document.createElement('button')
    prewatchButton.classList.add('btn', 'btn-outline-primary')
    prewatchButton.dataset.bsToggle = 'modal'
    prewatchButton.dataset.bsTarget = '#modal'
    prewatchButton.textContent = i18n.t('view.prewatchButton')
    prewatchButton.addEventListener('click', () => {
      openModal(i18n)
    })
    postTitle.append(prewatchButton)
    postsContainer.append(postTitle)
  })
}

export const openModal = (i18n) => {
  const modal = document.createElement('div')
  modal.classList.add('modal', 'fade')
  modal.setAttribute('id', 'modal')
  modal.tabindex = -1
  modal.setAttribute('aria-labelledby', 'modalLabel')
  modal.setAttribute('aria-hidden', 'true')
  modal.setAttribute('role', 'dialog')

  const modalDialog = document.createElement('div')
  modalDialog.classList.add('modal-dialog')
  modal.append(modalDialog)

  const modalContent = document.createElement('div')
  modalDialog.classList.add('modal-content')
  modalDialog.append(modalContent)

  const modalHeader = document.createElement('div')
  modalDialog.classList.add('modal-header')
  modalContent.append(modalHeader)
  const modalTitle = document.createElement('h5')
  modalTitle.classList.add('modal-title')
  modalTitle.setAttribute('id', 'modaLabel')
  modalTitle.textContent = 'Modal Title Check'
  const closeButton = document.createElement('button')
  closeButton.setAttribute('type', 'button')
  closeButton.classList.add('btn-close')
  closeButton.dataset.bsDismiss = 'modal'
  closeButton.setAttribute('aria-label', 'Close')
  modalHeader.append(modalTitle, closeButton)

  const modalBody = document.createElement('div')
  modalBody.classList.add('modal-body', 'text-break')
  modalBody.textContent = 'modalBody Text Check'
  modalContent.append(modalBody)

  const modalFooter = document.createElement('div')
  modalDialog.classList.add('modal-footer')
  modalContent.append(modalFooter)

  const readButton = document.createElement('button')
  readButton.setAttribute('type', 'button')
  readButton.classList.add('btn-primary')
  readButton.textContent = i18n.t('view.readButton')

  const closeFooterButton = document.createElement('button')
  closeFooterButton.setAttribute('type', 'button')
  closeFooterButton.classList.add('btn-secondary')
  closeFooterButton.dataset.bsDismiss = 'modal'
  closeFooterButton.textContent = i18n.t('view.closeButton')
  modalFooter.append(readButton, closeFooterButton)

  document.body.append(modal)
}
