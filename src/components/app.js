import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';

const formState = {
  valid: 'valid',
  invalid: 'invalid',
  download: 'download',
};

const validate = (state, inputVal) => {
  const shema = yup.string().required().url().notOneOf(state.rssForm.urls);
  return shema.validate(inputVal);
};

export default () => {
  const state = {
    rssForm: {
      valid: 'filling',
      urls: [],
      errors: [],
    },
    rssResults: {
      urls: [],
    },
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'rssForm.valid') {
      switch (value) {
        case formState.valid:
          console.log('valid');
          break;
        case formState.invalid:
          console.log('invalid');
          break;
        default:
          break;
      }
    }
  });

  const form = document.querySelector('form');
  const input = document.querySelector('#rss-url');
  const getUrl = async (e) => {
    e.preventDefault();
    const url = input.value;
    validate(state, url).then(() => {
      watchedState.rssForm.urls.push(url);
      watchedState.rssForm.valid = formState.valid;
    })
      .catch(() => {
        watchedState.rssForm.urls.valid = formState.invalid;
      });
  };
  form.addEventListener('submit', getUrl);
};
