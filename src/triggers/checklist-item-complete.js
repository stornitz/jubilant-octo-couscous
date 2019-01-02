module.exports = (card, params, tools, constants) => {
  let checklistItemComplete = false;
  let j = 0;
  
  if('checklist_name' in params) {
    params.checklist_display_name = constants.checklists[params.checklist_name].display_name;
  }

  while(!checklistItemComplete && j < card.checklists.length) {
    if(card.checklists[j].name == params.checklist_display_name) {

      let checkItems = card.checklists[j].checkItems;
      let i = 0;

      while(!checklistItemComplete && i < checkItems.length) {
        checklistItemComplete = checkItems[i].name == params.item_name && checkItems[i].state == "complete";
        i++;
      }
    }
    j++;
  }

  return checklistItemComplete;
}