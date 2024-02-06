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

  let timeoutHandle;
  let stopped = false;

  const axiosInstance = axios.create({timeout: 1000});
  const callApi = () => {
    axiosInstance
        .get(url)
        .then((resp) => {
          if (resp.data[0].status === 'success') {
            try {
              onValueGenerated(resp.data[0].random);
            } catch {}
          } else {
            if (resp.data[0].code != 5) {
              throw new Error('API error');
            }
          }
        })
        .then(() => {
          if (!stopped) {
            timeoutHandle = setTimeout(callApi, interval);
          }
        })
        .catch((err) => {
          if (onError) {
            try {
              onError(new Error('API Error'));
            } catch {}
          }
          if (err.code === 'ECONNABORTED' && !stopped) {
            timeoutHandle = setTimeout(callApi, interval);
          }
        });
  };

  setTimeout(callApi, interval);

  return {
    getInterval: () => interval,
    stop: () => {
      stopped = true;
      clearTimeout(timeoutHandle);
    },
  };
};

module.exports = {
  create: createRandomValueGenerator,
};
