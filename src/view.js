import 'bootstrap';
import './style.css';

export const updateUI = (state, input) => {
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
    feedback.textContent = state.errors.join(", ")
  }
}
