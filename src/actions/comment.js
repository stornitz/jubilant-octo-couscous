module.exports = (card, params, tools, constants) => {
  tools.TrelloAPI.request('post', `/cards/${card.id}/actions/comments`, {
    text: params.comment
  });
};