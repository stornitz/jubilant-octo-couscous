const config = require('../config.json');

const TrelloAPI = require('./trello-api.js');
const Trello = new TrelloAPI(config.trello.key, config.trello.token);

var args = process.argv.slice(2);

var firstArg = args[0] || "list";

switch(firstArg) {
	case "delete":
		if(args.length != 2) {
			console.log("Usage: npm run hooks delete <ID>");
		} else {
			Trello.deleteWebhook(config.board_to_watch, args[1]).then(res => {
				console.log("Webhook deleted.")
			}).catch(res => {
				console.log("Error", res.response.status);
				console.log(res.response.data.message);
			});
		}
		break;
	case "list":
		Trello.getWebhooks().then(res => {
			if(res.data.length == 0) {
				console.log("No Webhooks registered.");
			} else {
				console.log("Registered Webhooks:");
				console.log("ID", "CallbackURL", "Active");
				res.data.forEach(webhook => {
					console.log(webhook.id, webhook.callbackURL, webhook.active);
				});
			}
		});
		break;
	default:
		console.log("Usage: npm run hooks <list/delete>");
}