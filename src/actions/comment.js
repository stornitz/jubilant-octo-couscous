exports.name = "Add a comment"

exports.params = {
	comment: "Text"
}

exports.fct = (card, params, tools, constants) => {
  tools.TrelloAPI.request('post', `/cards/${card.id}/actions/comments`, {
    text: params.comment
  });
};