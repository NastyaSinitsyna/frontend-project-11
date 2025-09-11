import 'bootstrap';
import './style.css';

export const updateUI = (state, input) => {
  if (state.errors.length === 0) {
    input.classList.remove('is-invalid')
  }
  else {
    input.classList.add('is-invalid')
    input.value = ''
    input.focus()
  }
}