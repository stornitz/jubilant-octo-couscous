module.exports = (card, params, tools, constants) => {
  if('list_name' in params) {
    return (card.list.name === params.list_name);
  } 

  return false;
}