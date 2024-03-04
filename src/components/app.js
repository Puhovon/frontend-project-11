import 'bootstrap';

export default () => {
    const form = document.querySelector('form');
    const getUrl = (e) => {
        e.preventDefault();
        const target = e.target;
        const data = new FormData(target);
        const url = new URL(data.get('url'));
        console.log(url)
    }
    form.addEventListener('submit', getUrl)
}
