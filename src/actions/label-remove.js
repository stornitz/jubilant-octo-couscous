module.exports = (card, params, tools, constants) => {
  if('label_name' in params) {
    params.label_id = constants.__labels[params.label_name];
  } else if('label_color' in params) {
    params.label_id = constants.__labelsByColor[params.label_color];
  }

  tools.TrelloAPI.request('delete', `/cards/${card.id}/idLabels/${params.label_id}`);
}