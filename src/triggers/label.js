module.exports = (card, params, tools, constants) => {

  let key = null;
  let value = null;
  let without = false;

  if('with_name' in params) {
    key = 'name';
    value = params.with_name;
  } else if('without_name' in params) {
    key = 'name';
    value = params.without_name;
    without = true;
  } else if('with_id' in params) {
    key = 'id';
    value = params.with_id;
  } else if('without_id' in params) {
    key = 'id';
    value = params.without_id;
    without = true;
  }

  if(key != null && value != null) {
    let labelFound = false;
    let i = 0;

    while(!labelFound && i < card.labels.length) {
      labelFound = card.labels[i][key] == value;
      i++;
    }

    return without ? !labelFound : labelFound;
  } else {
    return false;
  }
}