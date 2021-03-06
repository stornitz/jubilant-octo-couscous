# jubilant-octo-couscous
Automation server for Trello

# Simple description

## Keywords
- **Trigger** : will return true or false for a specific card, allowing us to trigger an action
- **Action** : will do something to/with the card (e.g. move a card, add a checklist, ...)
- **Workflow** : a combinaison of triggers and actions to do something when something happend (best definition ever)

## Step by step idea
The basic idea is : 
1. A webhook is triggered by Trello
1. The new card goes through all the _workflows_ (in a specified order ? maybe later)
  1. For each _workflow_, the card tries the _triggers_
  1. If they are all true, then execute the _actions_, in order.

# How will we use it

1. Clone the repository
2. _Optional_: Code your owns triggers and actions if you don't find the ones you need
3. Create your workflows using declarative syntax (JSON).
4. Configure and start the server.

# Important files and directories
- **src/**
  - **triggers/** : default triggers _(in JS)_
  - **actions/** : default actions _(in JS)_
  - **index.js** : Server entry point : where the magic happens
- **workflows/** : sample workflows _(in JSON)_
- **constants.json** : define texts, checklist, labels and fields for easy access _(in JSON)_
- **config.json** : Server configuration

# User documentation

- [Config file](doc/CONFIG.md)
- [Triggers](doc/TRIGGERS.md)
- [Actions](doc/ACTIONS.md)

**NOTE** : An action often create an event which can trigger a webhook. This can create loop in workflows and exceed the API Rate Limit.
To prevent that you have two solutions : create workflows that do not overlap **or** ignore every action from the user (ideally a bot).

## Developper documentation

### Actions

`void action(card, actionOption, tools, constants)`

### Triggers

`boolean trigger(card, triggerOption, tools, constants)`

# TODO

- check params before calling an action/trigger
- prevent external modification of a card (maybe this can be a simple workflow)
- query trello in batch to reduce api usage
- create a web workflow creator ?

## Triggers

- files attached

## Actions

- check/uncheck an item
- dynamics actions