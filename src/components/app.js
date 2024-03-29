/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import ru from '../locales/ru';
import {
  render, renderMessage, renderModal, renderRssData, viewedPosts,
} from './render';
import formStates from '../abstractions/formStates';
import elements from '../abstractions/elements';
import rss from './rss';

yup.setLocale({
  mixed: {
    notOneOf: 'already_downloaded',
    required: 'required',
  },
  string: {
    url: 'invalid_url',
  },
});

const addProxy = (url) => {
  const hexletAllorigins = new URL('/get', 'https://allorigins.hexlet.app/');
  hexletAllorigins.searchParams.append('disableCache', 'true');
  hexletAllorigins.searchParams.append('url', url);
  return hexletAllorigins;
};

const validate = (state, inputVal) => {
  const shema = yup.string().required().url().notOneOf(state.rssForm.urls);
  return shema.validate(inputVal);
};

const getData = (url) => axios.get(addProxy(url));

const setIds = (feed, posts) => {
  posts.map((el) => {
    el.feedId = feed.id;
    el.id = uniqueId();
    return el;
  });
};

const handleData = (data, watchedState) => {
  const { feed, posts } = data;
  feed.id = uniqueId();
  watchedState.feeds.push(feed);
  setIds(feed, posts);
  watchedState.posts.push(...posts);
};

const updatePosts = (watchedState) => {
  // eslint-disable-next-line array-callback-return
  const promise = watchedState.feeds.map((feed) => {
    getData(feed.link).then((r) => {
      if (r.status === 200) {
        const { posts } = rss(r.data.contents, watchedState.rssForm.currentUrl);
        const curentIdPosts = watchedState.posts.filter((post) => feed.id === post.feedId);
        const postFromStateLinks = curentIdPosts.map(({ link }) => link);
        const newPosts = posts.filter((post) => !postFromStateLinks.includes(post.link));
        setIds(feed, newPosts);
        watchedState.posts.unshift(...newPosts);
      }
    })
      .catch((error) => {
        if (error.name === 'parseError') {
          watchedState.rssForm.message = formStates.message.RssNotValid;
        }
        if (axios.isAxiosError) {
          watchedState.rssForm.message = formStates.message.axiosError;
        }
        watchedState.rssForm.state = formStates.state.invalid;
      });
  });
  return Promise.all(promise).finally(() => setTimeout(updatePosts, 5000, watchedState));
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
    viewedPosts: [],
    activePostId: null,
  };
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    const watchedState = onChange(state, (path) => {
      if (path === 'posts') {
        renderRssData(state, elements, i18next);
      }
      if (path === 'rssForm.state') {
        render(state, elements);
      }
      if (path === 'rssForm.message') {
        renderMessage(state, elements, i18next);
      }
      if (path === 'activePostId') {
        renderModal(state, elements);
      }
    });

    render(state, elements, i18next);

    const getUrl = (e) => {
      e.preventDefault();
      const url = elements.input.value;
      validate(state, url).then(() => {
        watchedState.rssForm.urls.push(url);
        watchedState.rssForm.currentUrl = url;
        watchedState.rssForm.state = formStates.state.download;
        watchedState.rssForm.message = formStates.message.dowload;
        getData(watchedState.rssForm.currentUrl).then((r) => {
          const { feed, posts } = rss(r.data.contents, url);
          handleData({ feed, posts }, watchedState);
          watchedState.rssForm.state = formStates.state.valid;
          watchedState.rssForm.message = formStates.message.success;
          render(state, elements);
        }).catch((error) => {
          if (error.name === 'parseError') {
            watchedState.rssForm.message = formStates.message.RssNotValid;
          }
          if (error instanceof axios.AxiosError) {
            watchedState.rssForm.message = formStates.message.axiosError;
          }
          watchedState.rssForm.state = formStates.state.invalid;
        });
      }).catch((err) => {
        watchedState.rssForm.state = formStates.state.invalid;
        watchedState.rssForm.message = err.message;
      });
    };
    const buttonsHandler = (e) => {
      const { id } = e.target.dataset;
      if (e.target.type === 'a') {
        watchedState.viewedPosts.push(id);
        viewedPosts(id, elements);
        return;
      }
      if (e.target.type === 'button') {
        watchedState.viewedPosts.push(id);
        watchedState.activePostId = id;
        renderModal(state, elements);
      }
      if (id === undefined) {
        watchedState.activePostId = null;
      }
    };
    elements.posts.addEventListener('click', buttonsHandler);
    elements.form.addEventListener('submit', getUrl);
    updatePosts(watchedState);
  });
};
