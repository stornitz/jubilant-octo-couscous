module.exports = (card, params, tools, constants) => {
  if('new_list_name' in params) {
    params.new_list_id = constants.__lists[params.new_list_name];
  }

  tools.TrelloAPI.request('put', `/cards/${card.id}/idList`, {
    value: params.new_list_id
  });
}