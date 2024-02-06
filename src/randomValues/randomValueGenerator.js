const axios = require('axios');
const url = 'https://csrng.net/csrng/csrng.php?min=0&max=100';

const createRandomValueGenerator = function createRandomValueGenerator(
    interval,
    onValueGenerated,
    onError,
) {
  if (!Number.isInteger(interval)) {
    throw new Error('Invalid interval');
  }
  if (typeof onValueGenerated !== 'function') {
    throw new Error('Invalid onValueGenerated');
  }
  if (
    onError !== null &&
    onError !== undefined &&
    typeof onError !== 'function'
  ) {
    throw new Error('Invalid onError');
  }

  const axiosInstance = axios.create();

  const callApi = () =>
    axiosInstance
        .get(url)
        .then((resp) => {
          if (resp.data[0].status === 'success') {
            onValueGenerated(resp.data[0].random);
          } else {
            if (resp.data[0].code != 5) {
              throw new Error('API error');
            }
          }
        })
        .then(() => {
          setTimeout(callApi, interval);
        })
        .catch(() => {
          if (onError) {
            onError(new Error('API Error'));
          }
        });

  setTimeout(callApi, interval);

  return {
    getInterval: () => interval,
  };
};

module.exports = {
  create: createRandomValueGenerator,
};
