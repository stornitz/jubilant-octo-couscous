# Triggers

On this page, you can find the default triggers provided on this repository.

- [Checklists](#checklists)
  * [checklist-complete](#checklist-complete)
  * [checklist-item-complete](#checklist-item-complete)
- [card-in-list](#card-in-list)
- [custom-field](#custom-field)
- [due](#due)
- [label](#label)
- [nb-members](#nb-members)

# Checklists

## checklist-complete

Check if every item in a checklist is complete.

### Parameters

- **checklist_name** : refers to the checklist key  in `constants.json`.
  In the example below, checklist_name would be _my-first-checklist_.
```json
...
  "checklists": {
    "my-first-checklist" : {
        ...
    },
    ...
  }
...
```
-  **checklist_display_name** : checklist name on Trello.

At least one parameter is required.

## checklist-item-complete

Check if a specified item in a checklist is complete.

### Parameters

- **checklist_name** * : refers to the checklist key  in `constants.json`.
- **checklist_display_name** * : checklist name on Trello.
- **item_name** (required) : item name in the checklist.

\* : At least one parameter is required.

# card-in-list

Check if the card is in a specified list.

### Parameters

- **list_id** : the trello id of the list.
- **list_name** : the name of the list..

At least one parameter is required.

# custom-field

Define a custom field to the value of your choice.

### Parameters

- **custom_field_id** : the trello id of the custom field.
- **custom_field_name** * : the name of the custom field.
- **custom_field_type** (required) : the type of the custom field. This can be one of: _text, number, date, checked, list_item_id, list_item_text_ *. 
- **custom_field_value** * : the value of the custom field. To clear the value of the field, set this parameter to `null` .
- **check_if_set**  *: only check if the field is defined, without checking the value

\* : to use these parameters and settings, you need to enable `populate_custom_fields` in the config file.

You need one of _id_ or _name_, **and** one of  _check_if_set_ or _value_.

# due

Check a due date.

### Parameters

- **point_of_reference** : point of reference for all of the operation. if not defined, the point of reference is now().
- **set** (required) : One of theses values: 
    * _true_ : check if the due date is set.
    * _past_ : check if the due date is before the point of reference.
    * _future_ : check if the due date is after the point of reference. 
- **due_complete** : Check if the date is correct **and** if the due date is marked as completed.

# label

Check if a label is attached to the card.

### Parameters

- **with_name** : check if the label with this name is present.
- **without_name** : check if the label with this name is absent..
- **with_id** : check if the label with this id is present.
- **without_id** : check if the label with this id is absent.

At least one parameter is required.

# nb-members

Check the numbers of members on the card.

### Parameters

- **eq** : equal to
- **ne** : different from
- **gt** : greater than
- **gte** : greater than or equal to  
- **lt** : lower than 
- **lte** : lower than or equal to 

At least one parameter is required.
