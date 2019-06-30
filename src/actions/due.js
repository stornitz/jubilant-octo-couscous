exports.name = "Due date (set, move, erase)"

exports.params = {
  set: "New value",
  move: "Move time in ms"
}

exports.fct = (card, params, tools, constants) => {
  let newValue = null;
  if('set' in params) {
    newValue = params.set;
  } else if('move' in params && card.due != null) {
    let ms = new Date(card.due).getTime() + params.move;
    newValue = new Date(ms).toJSON();
  }

  tools.TrelloAPI.request('put', `/cards/${card.id}/due`, {
    value: newValue
  });
};