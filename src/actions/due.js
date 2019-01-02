module.exports = (card, params, tools, constants) => {
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