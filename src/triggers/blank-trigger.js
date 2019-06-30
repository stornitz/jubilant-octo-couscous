exports.name = "Blank trigger (check nothing!)";

exports.params = {}

exports.fct = (card, params, tools, constants) => {
  // Everything is ok when there's nothing to check

  return true;
}