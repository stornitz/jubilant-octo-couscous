module.exports = (card, params, tools, constants) => {
  let atLeastOneChecklistChecked = false;
  let completeChecklist = true;
  let j = 0;
  
  if('checklist_name' in params) {
    params.checklist_display_name = constants.checklists[params.checklist_name].display_name;
  }

  while(completeChecklist && j < card.checklists.length) {
    if(card.checklists[j].name == params.checklist_display_name) {

      atLeastOneChecklistChecked = true;
      let checkItems = card.checklists[j].checkItems;
      let i = 0;

      while(completeChecklist && i < checkItems.length) {
        completeChecklist = checkItems[i].state == "complete";
        i++;
      }
    }
    j++;
  }

  // Will return true if there's at least one checklist with the right name that:
  // - either have no checkitem
  // - or have every checkitem complete
  return atLeastOneChecklistChecked && completeChecklist;
}