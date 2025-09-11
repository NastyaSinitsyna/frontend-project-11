import 'bootstrap';
import './style.css';

export const updateUI = (state, input) => {
  const oldError = input.parentElement.querySelector('.error-message')
  if (oldError) {
    oldError.remove()
  }
  if (state.errors.length === 0) {
    input.classList.remove('is-invalid')
  }
  else {
    input.classList.add('is-invalid')
    input.value = ''
    input.focus()
    const errorMessage = document.createElement('p')
    errorMessage.classList.add('error-message')
    errorMessage.innerHTML = state.errors.join(", ")
    input.parentElement.appendChild(errorMessage)
  }
}