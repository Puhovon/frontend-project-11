import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import { render, renderMessage, renderRssData } from './render';
import formStates from '../abstractions/formStates';
import elements from '../abstractions/elements';
import rss from './rss';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        already_downloaded: 'RSS уже существует',
        invalid_url: 'Ссылка должна быть валидным URL',
        success: 'RSS успешно загружен',
        invalidRss: 'URL не содержит RSS',
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

const addProxy = (url) => {
  const hexletAllorigins = new URL('/get', 'https://allorigins.hexlet.app/');
  hexletAllorigins.searchParams.append('disableCache', 'true');
  hexletAllorigins.searchParams.append('url', url);
  return hexletAllorigins;
};

const getData = (watchedState) => {
  axios.get(addProxy(watchedState.rssForm.currentUrl)).then((r) => {
    if (r.status === 200) {
      const { feed, posts } = rss(r.data.contents);
      feed.id = uniqueId();
      watchedState.feeds.push(feed);
      posts.map((el) => {
        el.feedId = feed.id;
        el.id = uniqueId();
      });
      watchedState.posts.push(...posts);
      renderRssData(watchedState, elements);
    }
  }).catch((error) => {
    if (error.name === 'parseError') {
      watchedState.rssForm.state = formStates.state.invalid;
      watchedState.rssForm.message = formStates.message.RssNotValid;
    }
  });
};

export default () => {
  const state = {
    rssForm: {
      state: 'filling',
      urls: [],
      currentUrl: '',
      message: '',
    },
    posts: [],
    feeds: [],
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'rssForm.state') {
      render(state, elements);
      getData(watchedState);
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
      watchedState.rssForm.currentUrl = url;
      watchedState.rssForm.state = formStates.state.valid;
      watchedState.rssForm.message = formStates.message.success;
    })
      .catch((err) => {
        watchedState.rssForm.state = formStates.state.invalid;
        watchedState.rssForm.message = err.message;
      });
  };
  elements.form.addEventListener('submit', getUrl);
};
