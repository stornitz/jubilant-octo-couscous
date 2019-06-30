exports.name = "Add label"

exports.params = {
  new_label_name: "Name of the label",
  new_label_id: "Id of the label",
  new_label_color: "Color of the label"
}

exports.fct = (card, params, tools, constants) => {
  if('new_label_name' in params) {
    params.new_label_id = constants.__labels[params.new_label_name];
  } else if('new_label_color' in params) {
    params.new_label_id = constants.__labelsByColor[params.new_label_color];
  }

  tools.TrelloAPI.request('put', `/cards/${card.id}/idLabels`, {
    value: params.new_label_id
  });
}