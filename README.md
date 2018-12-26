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
- **constants/** : define texts, checklist, labels and fields for easy access **(Unclear usage at this point)** _(in JSON)_
- **config.json** : Server configuration

# TODO
- **everything**
- add and receive Trello webhooks
- load actions/triggers from their directories
- create basic actions and triggers
- plug everything together
- prevent external modification of a card (maybe this can be a simple workflow)

## Actions

`void action(card, ...?)`

- move card to another list
- add/remove labels
- set/unset a field
- add a checklist
- update card text

## Triggers

`boolean trigger(card, ...?)`

- checklist complete
- checklist item complete
- card in a list
- files attached
- comments