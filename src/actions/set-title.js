module.exports = (card, params, tools, constants) => {
  tools.TrelloAPI.request('put', `/cards/${card.id}/name`, {
    value: params.new_title
  });
}