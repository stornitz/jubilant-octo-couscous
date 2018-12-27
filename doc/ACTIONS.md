# Actions

On this page, you can find the default actions provided on this repository.

- [Actions](#actions)
- [Checklists](#checklists)
  * [checklist-add](#checklist-add)
  * [checklist-remove](#checklist-remove)
- [Labels](#labels)
  * [label-add](#label-add)
  * [label-remove](#label-remove)
- [Others](#others)
  * [move-card](#move-card)
  * [set-title](#set-title)

# Checklists

## checklist-add

Add a checklist to the card from the `constants.json` file.

### Parameters

- **checklist_name** (required) : refers to the checklist key  in `constants.json`.
  In the example below, checklist_name would be _my-first-checklist_.
```json
...
  "checklists": {
    "my-first-checklist" : {
      "display_name": "My first checklist",
      "items" : [
        "Option 1", 
        "Option 2",
        "Option 3"
      ]
    },
    ...
  }
...
```

## checklist-remove

Remove every checklist matching a display name (the one you see on Trello) from a card.

### Parameters

- **by_name** : refers to the checklist key in `constants.json`.
- **by_display_name** : refers to the checklist name in Trello.

At least one parameter is required.

# Labels

## label-add

Add an existing label to a card.

### Parameters

- **new_label_id** : the trello id of the label you want to add.
- **new_label_name** : the name of the label you want to add.
- **new_label_color** : the color of the label you want to add (only work if you have one label per color at maximum).

At least one parameter is required.

## label-remove

Remove an existing label from a card.

### Parameters

- **label_id** : the trello id of the label you want to remove.
- **label_name** : the name of the label you want to remove.
- **label_color** : the color of the label you want to remove (only work if you have one label per color at maximum).

At least one parameter is required.

# Others

## move-card

Move a card to a specified list (on the same board).

### Parameters

- **new_list_id** : the trello id of the list where you want to move the card.
- **new_list_name** : the name of the list where you want to move the card.

At least one parameter is required.

## set-title

Set the title of the card to a string constant.
If you want to dynamically set the title, you will have to create your own actions based on [set-title.js](../src/actions/set-title.js).

### Parameters

- **new_title** (required) : the new title.