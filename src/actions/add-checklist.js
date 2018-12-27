module.exports = (card, params, tools, constants) => {
  if(!(params.checklist_name in constants.checklists)) {
    throw `Checklist not found ${params.checklist_name}`;
  }

  let checklist = constants.checklists[params.checklist_name];

  // Create the checklist on the card
  tools.TrelloAPI.request('post', `/cards/${card.id}/checklists`, {
    name: checklist.name
  }).catch(onError)
  .then((res) => {
    let checklistId = res.data.id;

    checklist.items.forEach(item => {
      tools.TrelloAPI.request('post', `/checklists/${checklistId}/checkItems`, {
        name: item
      })
    });
  })
};

function onError(err) {
  console.log(`Error creating checklist on card ${card.shortLink} : ${err.data}`);
}