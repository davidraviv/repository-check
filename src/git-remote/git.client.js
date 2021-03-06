import axios from 'axios';

const host = 'https://api.github.com';
const options = {
  headers: {
    accept: 'application/json',
    'Accept-Encoding': 'gzip',
  },
};

// eslint-disable-next-line import/prefer-default-export
export async function getPopular({ count, page, requestedLanguage }) {
  const url = `${host}/search/repositories?q=language:${requestedLanguage}&sort=stars&per_page=${count}&page=${page}`;
  return (await axios.get(url, options)).data;
}
