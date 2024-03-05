import formStates from '../abstractions/formStates';

const render = (state, elements) => {
  if (state.rssForm.valid === formStates.state.valid) {
    elements.input.classList.remove('is-invalid');
    elements.input.value = '';
    elements.input.focus();
  }
  if (state.rssForm.valid === formStates.state.invalid) {
    elements.input.classList.add('is-invalid');
  }
};

const renderMessage = (state, elements, i18n) => {
  console.log(state.rssForm.valid);
  if (state.rssForm.valid === formStates.state.invalid) {
    elements.feedBack.classList.remove('text-success');
    elements.feedBack.classList.add('text-danger');
  }
  if (state.rssForm.valid === formStates.state.valid) {
    elements.feedBack.classList.remove('text-danger');
    elements.feedBack.classList.add('text-success');
  }
  elements.feedBack.textContent = i18n.t(state.rssForm.message);
  console.log(state.rssForm.message);
};
export { render, renderMessage };
