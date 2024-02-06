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
  const callApi = async () => {
    try {
      const resp = await axiosInstance.get(url);
      if (resp.data[0].status === 'success') {
        onValueGenerated(resp.data[0].random);
      } else if (resp.data[0].code != 5) {
        throw new Error('API error');
      }

      if (!stopped) {
        timeoutHandle = setTimeout(callApi, interval);
      }
    } catch (err) {
      if (onError) {
        onError(new Error('API Error'));
      }
      if (err.code === 'ECONNABORTED' && !stopped) {
        timeoutHandle = setTimeout(callApi, interval);
      }
    }
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
