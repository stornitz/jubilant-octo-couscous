const axios = require('axios');
// TODO check if file exists
// TODO provide default configuration if not set
const config = require('../config.json');

let TrelloAPI = function(key, token) {
  this.key = key;
  this.token = token;
  this.trello_url = "https://api.trello.com/1";
}

TrelloAPI.prototype.request = function (method, request_url, params = {}) {
  params.key = this.key;
  params.token = this.token;

  return axios.request({
    method: method,
    url: this.trello_url + request_url,
    params: params
  });
}

TrelloAPI.prototype.getWebhooks = function() {
  return this.request('get', `/tokens/${this.token}/webhooks`);
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
        }).then(resolve).catch(reject);
      }
    }).catch(reject);
  })
}

TrelloAPI.prototype.getCardInfos = function(idCard) {
  return this.request('get', `/cards/${idCard}`, {
    fields: "all",
    list: true,
    checklists: "all",
    pluginData: true,
    attachments: true,
    customFieldItems: true
  });
}

module.exports = TrelloAPI;