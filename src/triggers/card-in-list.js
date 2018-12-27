module.exports = (params, tools, card) => {
  if('list_name' in params) {
    return (card.list.name === params.list_name);
  } 

  return false;
}