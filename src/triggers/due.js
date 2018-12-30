module.exports = (card, params, tools, constants) => {
  let dueCorrect = false;
  
  let pointOfReference = 'point_of_reference' in params ? new Date(params.point_of_reference) : new Date();

  if(card.due != null) {
    switch(params.set) {
      case true:
        dueCorrect = card.due != null;
        break;
      case "past":
        dueCorrect = new Date(card.due) <= pointOfReference;
        break;
      case "future":
        dueCorrect = pointOfReference <= new Date(card.due);
        break;
    }

    if(dueCorrect && 'due_complete' in params) {
      dueCorrect = card.dueComplete == params.due_complete;
    }
  }

  return dueCorrect;
}