import formStates from '../abstractions/formStates';

const render = (state, elements) => {
  if (state.rssForm.state === formStates.state.download) {
    elements.submitButton.disabled = true;
  }
  if (state.rssForm.state === formStates.state.valid) {
    elements.input.classList.remove('is-invalid');
    elements.input.value = '';
    elements.input.focus();
    elements.submitButton.disabled = false;
  }
  if (state.rssForm.valid === formStates.state.invalid) {
    elements.input.classList.add('is-invalid');
    elements.submitButton.disabled = false;
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

const createPosts = (posts) => {
  const ul = createList();
  posts.map((post) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');

    li.classList = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    a.href = post.link;
    a.dataset.id = post.id;
    a.setAttribute('rel', 'noopener noreferrer');
    a.target = '_blank';
    a.classList = 'fw-bold';
    a.textContent = post.title;

    button.classList = 'btn btn-outline-primary btn-sm';
    button.dataset.id = post.id;
    button.textContent = 'Посмотреть';

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
  feeds.map((feed) => {
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

const renderRssData = (state, elements) => {
  const cardFeeds = createCard('Фиды');
  cardFeeds.append(createFeeds(state.feeds));
  elements.feeds.replaceChildren(cardFeeds);
  const cardPosts = createCard('Посты');
  cardPosts.append(createPosts(state.posts));
  elements.posts.replaceChildren(cardPosts);
  state.rssForm.state = formStates.state.valid;
};
export { render, renderMessage, renderRssData };
