module.exports = (card, params, tools, constants) => {
  if('by_name' in params) {
    params.by_display_name = constants.checklists[params.by_name].display_name;
  }

  card.checklists.forEach(checklist => {
    if(checklist.name == params.by_display_name) {
      tools.TrelloAPI.request('delete', `/checklists/${checklist.id}`);
    }
  });
};