exports.name = "Custom Field"

exports.params = {
  custom_field_id: 'The id of the custom field',
  custom_field_name: 'The name of the custom field',
  check_if_set: 'Set to true',
  custom_field_type: 'The type of the custom field',
  custom_field_value: 'The value of the custom field'
}

exports.fct = (card, params, tools, constants) => {
  if('custom_field_name' in params) {
    params.custom_field_id = constants.__customFields[params.custom_field_name];
  }

  let searchOnlyIfSet = 'check_if_set' in params && params.check_if_set;
  let searchIdValue = params.custom_field_type == 'list_item_id';

  if(params.custom_field_type == 'list_item_text') {
    searchIdValue = true;
    params.custom_field_value = constants.__customFieldsItems[params.custom_field_id][params.custom_field_value];
  }

  let i = 0;
  let isCustomFieldMatching = false;

  while(!isCustomFieldMatching && i < card.customFieldItems.length) {
    let item = card.customFieldItems[i];

    if(item.idCustomField == params.custom_field_id) {
      isCustomFieldMatching = searchOnlyIfSet ||
        (searchIdValue && item.idValue == params.custom_field_value) ||
        (item.value[params.custom_field_type] == params.custom_field_value);
    }
    i++;
  }
  
  return isCustomFieldMatching;
}