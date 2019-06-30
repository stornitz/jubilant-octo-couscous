const axios = require('axios');
const TrelloAPIBatch = require('./trello-api-batch.js');
// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');

let TrelloAPI = function(key, token) {
  this.key = key;
  this.token = token;
  this.trello_url = "https://api.trello.com/1";
}

TrelloAPI.prototype.request = function (method, request_url, params = {}, data = undefined) {
  params.key = this.key;
  params.token = this.token;

  return axios.request({
    method: method,
    url: this.trello_url + request_url,
    params: params,
    data: data
  });
}

TrelloAPI.prototype.get = function(request_url, params = {}) {
  return this.request('get', request_url, params);
}

TrelloAPI.prototype.startBatch = function() {
  return new TrelloAPIBatch(this, axios);
}

TrelloAPI.prototype.safe = (promise) => {
  return new Promise((resolve, reject) => {
    promise.then(resolve, (error) => {
      console.log('== REQUEST ERROR ==')
      console.log(error.response.statusText, error.response.status);
      console.log("URL: ", error.config.url);
      console.log("Params: ", error.config.params);
      console.log("Req Data: ", error.config.data);
      console.log("Res Data: ", error.response.data);
    });
  });  
}

TrelloAPI.prototype.getWebhooks = function() {
  return this.get(`/tokens/${this.token}/webhooks`);
}

TrelloAPI.prototype.createWebhook = function (idBoard, callbackURL) {
  return new Promise((resolve, reject) => {
    // First, we check if the webhook already exist
    this.getWebhooks().then(res => {
      let alreadyExists = false;
      let i = 0;

      while(!alreadyExists && i < res.data.length) {
        let webhook = res.data[i];
        alreadyExists = (webhook.idModel == idBoard) && (webhook.callbackURL == callbackURL); 
      }

      // If it does already exists, then the webhook is created !
      if(alreadyExists) {
        resolve();
      } else {
        // If it doesn't, we create it
        this.request("post", "/webhooks", {
          idModel: idBoard,
          callbackURL: callbackURL
        }).then(resolve, reject);
      }
    }, reject);
  })
}

TrelloAPI.prototype.deleteWebhook = function (idBoard, idWebhook) {
  return this.request("delete", `/webhooks/${idWebhook}`);
}

TrelloAPI.prototype.getCardInfos = function(idCard) {
  return this.get(`/cards/${idCard}`, {
    fields: "all",
    list: true,
    checklists: "all",
    pluginData: true,
    attachments: true,
    customFieldItems: true
  });
}

TrelloAPI.prototype.getCardInfos = function(idCard) {
  return this.get(`/cards/${idCard}`, {
    fields: "all",
    list: true,
    checklists: "all",
    pluginData: true,
    attachments: true,
    customFieldItems: true
  });
}

TrelloAPI.prototype.getCardsOnBoard = function(idBoard) {
  return new Promise((resolve, reject) => {
    this.get(`/boards/${idBoard}/cards`, {
      fields: "none",
    }).then(res => {
      let batch = this.startBatch();
      let getCardInfos = this.getCardInfos.bind(batch);

      res.data.forEach(card => {
        getCardInfos(card.id);
      });

      batch.sendBatch().then(resolve, reject);
    });
  });
}

module.exports = TrelloAPI;