/* eslint-disable no-param-reassign */
import formStates from '../abstractions/formStates';

const render = (state, { submitButton, input }) => {
  if (state.rssForm.state === formStates.state.download) {
    submitButton.disabled = true;
  }
  if (state.rssForm.state === formStates.state.valid) {
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
    submitButton.disabled = false;
  }
  if (state.rssForm.state === formStates.state.invalid) {
    input.classList.add('is-invalid');
    submitButton.disabled = false;
  }
};

const renderMessage = (state, elements, i18n) => {
  if (state.rssForm.state === formStates.state.valid) {
    elements.feedBack.classList.remove('text-danger');
    elements.feedBack.classList.add('text-success');
    elements.submitButton.disabled = false;
  }
  if (state.rssForm.state === formStates.state.invalid) {
    elements.feedBack.classList.remove('text-success');
    elements.feedBack.classList.add('text-danger');
    elements.submitButton.disabled = false;
  }
  elements.feedBack.textContent = i18n.t(state.rssForm.message);
};

const createList = () => {
  const ul = document.createElement('ul');
  ul.classList = 'list-group border-0 rounded-0';
  return ul;
};

const createPosts = (state, i18n) => {
  const ul = createList();
  state.posts.forEach((post) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');

    li.classList = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    a.href = post.link;
    a.dataset.id = post.id;
    a.setAttribute('rel', 'noopener noreferrer');
    a.target = '_blank';
    a.classList = state.viewedPosts.includes(post.id) ? 'fw-normal link-secondary' : 'fw-bold';
    a.textContent = post.title;
    a.type = 'a';

    button.classList = 'btn btn-outline-primary btn-sm';
    button.dataset.id = post.id;
    button.dataset.bsTarget = '#modal';
    button.dataset.bsToggle = 'modal';
    button.textContent = i18n.t('uiElements.button');
    button.type = 'button';

    li.append(a, button);
    ul.prepend(li);
  });
  return ul;
};

const createCard = (title) => {
  const card = document.createElement('div');
  const body = document.createElement('div');
  const h2 = document.createElement('h2');

  card.classList = 'card border-0';
  body.classList = 'card-body';
  h2.classList = 'card-title h4';
  h2.textContent = title;

  body.append(h2);
  card.append(body);
  return card;
};

const createFeeds = (feeds) => {
  const ul = createList();
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    li.classList = 'list-group-item border-0 border-end-0';
    h3.classList = 'h6 m-0';
    p.classList = 'm-0 small text-black-50';

    h3.textContent = feed.title;
    p.textContent = feed.description;
    li.append(h3, p);
    ul.prepend(li);
  });
  return ul;
};

const viewedPosts = (id, elements) => {
  const post = elements.posts.querySelector(`a[data-id="${id}"]`);
  post.classList = 'fw-normal link-secondary';
};

const renderModal = (state, elements) => {
  if (state.activePostId === null) return;
  const currentPost = state.posts.filter((el) => el.id === state.activePostId)[0];

  const { modalTitle } = elements;
  const { modalBody } = elements;
  const { modalLink } = elements;

  modalBody.textContent = currentPost.description;
  modalTitle.textContent = currentPost.title;
  modalLink.href = currentPost.link;

  viewedPosts(currentPost.id, elements);
};

const renderRssData = (state, elements, i18n) => {
  elements.feeds.innerHTML = '';
  elements.posts.innerHTML = '';
  const cardFeeds = createCard(i18n.t('uiElements.feeds'));
  cardFeeds.append(createFeeds(state.feeds));
  elements.feeds.append(cardFeeds);
  const cardPosts = createCard(i18n.t('uiElements.posts'));
  const posts = createPosts(state, i18n);
  cardPosts.append(posts);
  elements.posts.append(cardPosts);
  state.rssForm.state = formStates.state.valid;
};

export {
  render, renderMessage, renderRssData, renderModal, viewedPosts,
};
