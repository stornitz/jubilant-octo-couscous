module.exports = (card, params, tools, constants) => {
  if('list_name' in params) {
    return (card.list.name === params.list_name);
  } else if('list_id' in params) {
    return (card.list.id === params.list_id);
  }

  return false;
}