const parseItem = (xml) => {
  const title = xml.querySelector('title').textContent;
  const description = xml.querySelector('description').textContent;
  const link = xml.querySelector('link').textContent;
  const item = {
    title,
    description,
    link,
  };
  return item;
};

export default (xml, url) => {
  const parser = new DOMParser();
  const chanel = parser.parseFromString(xml, 'text/xml');

  const parsererrors = chanel.querySelector('parsererror');
  if (parsererrors !== null) {
    const error = new Error();
    error.name = 'parseError';
    throw error;
  }

  const feed = {
    title: chanel.querySelector('title').textContent,
    description: chanel.querySelector('description').textContent,
    link: url,
  };
  const posts = [...chanel.querySelectorAll('item')].map((el) => parseItem(el));

  const data = { feed, posts };

  return data;
};
