const networkError = new Error();
networkError.code = 'ECONNABORTED';

const CsrngMock = function CsrngMock(axios) {
  let mock = axios.get;

  this.mockSuccessfulResponse = function(randomValue) {
    mock = mock.mockImplementation(() =>
      Promise.resolve({
        data: [{status: 'success', min: 0, max: 100, random: randomValue}],
      }),
    );
    return this;
  };

  this.mockSuccessfulResponseOnce = function(randomValue) {
    mock = mock.mockImplementationOnce(() =>
      Promise.resolve({
        data: [{status: 'success', min: 0, max: 100, random: randomValue}],
      }),
    );
    return this;
  };

  this.mockUnsuccessfulResponse = function(code) {
    mock = mock.mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            status: 'error',
            code: code,
          },
        ],
      }),
    );
    return this;
  };

  this.mockError = function(err) {
    mock = mock.mockImplementation(() => Promise.reject(err));
    return this;
  };

  this.mockNetworkError = function() {
    mock = axios.get.mockImplementation(() => Promise.reject(networkError));
    return this;
  };

  this.mock = function() {
    return mock;
  };
};

module.exports = {
  csrng: (axios) => new CsrngMock(axios),
};
