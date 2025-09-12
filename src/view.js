import 'bootstrap';
import './style.css';

export const updateUI = (state, input) => {
  const oldError = input.parentElement.querySelector('.error-message')
  if (oldError) {
    oldError.remove()
  }
  if (state.errors.length === 0) {
    input.classList.remove('is-invalid')
    input.value = ''
    input.focus()
  }
  else {
    input.focus()
    input.classList.add('is-invalid')
    const errorMessage = document.createElement('p')
    errorMessage.classList.add('error-message')
    errorMessage.textContent = state.errors.join(", ")
    input.parentElement.appendChild(errorMessage)
  }
}
