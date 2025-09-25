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
