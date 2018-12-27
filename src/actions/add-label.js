module.exports = (card, params, tools, constants) => {
  tools.TrelloAPI.request('put', `/cards/${card.id}/idLabels`, {
    value: params.new_label_id
  }).catch(err => console.log(`Error add label to card ${card.shortLink} : ${err.data}`));
}