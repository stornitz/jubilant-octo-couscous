exports.name = "Set card title"

exports.params = {
  new_title: "Title"
}

exports.fct = (card, params, tools, constants) => {
  tools.TrelloAPI.request('put', `/cards/${card.id}/name`, {
    value: params.new_title
  });
}