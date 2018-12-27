module.exports = (card, params, tools, constants) => {
  tools.TrelloAPI.request('put', `/cards/${card.id}/idList`, {
    value: params.new_list_id
  }).catch(err => console.log(`Error moving card ${card.shortLink} : ${err.data}`));
}