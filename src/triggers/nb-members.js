exports.name = "Number of members"

exports.params = {
  eq: 'Egal to',
  ne: 'Not egal to',
  gt: 'Greater than',
  gte: 'Greater than or egal to',
  lt: 'Lower than',
  lte: 'Liwer than or egal to'
}

exports.fct = (card, params, tools, constants) => {
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