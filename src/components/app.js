import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import { render, renderMessage } from './render';
import formStates from '../abstractions/formStates';
import elements from '../abstractions/elements';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        already_downloaded: 'RSS уже существует',
        invalid_url: 'Ссылка должна быть валидным URL',
        success: 'RSS успешно загружен',
      },
    },
  },
});

yup.setLocale({
  mixed: {
    notOneOf: 'already_downloaded',
  },
  string: {
    url: 'invalid_url',
  },
});

const validate = (state, inputVal) => {
  const shema = yup.string().required().url().notOneOf(state.rssForm.urls);
  return shema.validate(inputVal);
};

export default () => {
  const state = {
    rssForm: {
      valid: 'filling',
      urls: [],
      message: '',
    },
    rssResults: {
      feeds: [],
    },
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'rssForm.valid') {
      render(state, elements);
    }
    if (path === 'rssForm.message') {
      renderMessage(state, elements, i18next);
    }
  });

  render(state, elements, i18next);

  const getUrl = async (e) => {
    e.preventDefault();
    const url = elements.input.value;
    validate(state, url).then(() => {
      watchedState.rssForm.urls.push(url);
      watchedState.rssForm.valid = formStates.state.valid;
      watchedState.rssForm.message = formStates.message.success;
    })
      .catch((err) => {
        watchedState.rssForm.valid = formStates.state.invalid;
        watchedState.rssForm.message = err.message;
      });
  };
  elements.form.addEventListener('submit', getUrl);
};
