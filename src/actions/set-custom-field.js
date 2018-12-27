module.exports = (card, params, tools, constants) => {
  if('custom_field_name' in params) {
    params.custom_field_id = constants.__customFields[params.custom_field_name];
  }

  let data = {};
  if(params.custom_field_new_value === null) {
    data.value = "";
    data.idValue = "";
  } else if(['text', 'number', 'date', 'checked'].includes(params.custom_field_type)) {
    data.value = {};
    data.value[params.custom_field_type] = params.custom_field_new_value;
  } else if(params.custom_field_type == 'list_item_id') {
    data.idValue = params.custom_field_new_value;
  } else if(params.custom_field_type == 'list_item_text') {
    data.idValue = constants.__customFieldsItems[params.custom_field_id][params.custom_field_new_value];
  }
  
  tools.TrelloAPI.request('put', `/card/${card.id}/customField/${params.custom_field_id}/item`, {}, data);
}