import 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';

const urlValidate = async (url) => yup.string().required().url().notOneOf(url);

export default () => {
    console.log("AAAAA")
    console.log("AAAAA")
    const state = {
        rssForm: {
            valid: 'valid',
            urls: [],
            errors: [],
        },
        rssResults: {
            urls: [],
        }
    }


    const watchedState = onChange(state, (path, value) => {
        if (path === 'rssForm') {
            switch (value) {
                case 'valid':
                break;
                case 'invalid':
                break;
                case 'filling':
                break;
            }
        }
    })
    const form = document.querySelector('form');
    const getUrl = async (e) => {
        console.log("HUY")
        e.preventDefault();
        const { target } = e;
        const url = target.value
        watchedState.rssForm.urls.push(url);
         
        console.log(await urlValidate()).isValid(watchedState.rssForm.urls);
    };
    form.addEventListener('submit', getUrl);
};
