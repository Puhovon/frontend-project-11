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

const parseItems = (xml) => {
  const parser = new DOMParser();
  const chanel = parser.parseFromString(xml, 'text/xml');
  return [...chanel.querySelectorAll('item')].map((el) => parseItem(el));
};

const parseFeeds = (xml) => {
  const parser = new DOMParser();
  const chanel = parser.parseFromString(xml, 'text/xml');
  const feed = {
    title: chanel.querySelector('title').textContent,
    description: chanel.querySelector('description').textContent,
  };
  return feed;
};

export default (xml) => ({
  feed: parseFeeds(xml),
  items: parseItems(xml),
});
