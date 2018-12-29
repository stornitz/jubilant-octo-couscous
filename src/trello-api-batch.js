let TrelloAPIBatch = function(trelloAPI, axios) {
  this.trelloAPI = trelloAPI;
  this.axios = axios;
  this.batchUrls = [];
}

TrelloAPIBatch.prototype.get = function(request_url, params = {}) {
  this.batchUrls.push(this.axios.getUri({
    method: "get",
    url: request_url,
    params: params
  }));
}

TrelloAPIBatch.prototype.sendBatch = function() {
  return this.trelloAPI.get('/batch/', {
    urls: this.batchUrls.join(',')
  });
}

module.exports = TrelloAPIBatch;