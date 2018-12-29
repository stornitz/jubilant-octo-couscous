module.exports = (card, params, tools, constants) => {
  let nbMembers = card.idMembers.length;

  if('eq' in params) {
    return nbMembers == params.eq;
  } else if('ne' in params) {
    return nbMembers != params.ne;
  } else if('gt' in params) {
    return nbMembers > params.gt;
  } else if('gte' in params) {
    return nbMembers >= params.gte;
  } else if('lt' in params) {
    return nbMembers < params.lt;
  } else if('lte' in params) {
    return nbMembers <= params.lte;
  } else {
    throw 'Error: comparison operator not found.'
  }
}