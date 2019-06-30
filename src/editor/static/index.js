const workflowsNode = document.getElementById('workflows');
const selectTriggersNode = document.getElementById('select-triggers');
const selectActionsNode = document.getElementById('select-actions');

const workflowTemplate = document.querySelector('#templates #workflow');
const triggerTemplate = document.querySelector('#templates #trigger');
const actionTemplate = document.querySelector('#templates #action');
const fieldTemplate = document.querySelector('#templates #field');

let workflows = {};
let triggers = {};
let actions = {};

function request(method, url, data=null, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/json");

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
        if(xmlhttp.status != 200) {
          alert(`Error on ${method} ${url}`);
        } else if(callback != null) {
          callback(JSON.parse(xmlhttp.responseText));
        }
      }
  };

  xmlhttp.open(method, url, true);
  xmlhttp.send(data);
}

// function renameWorkflow(element) {
//   let workflowId = element.parentNode.dataset.workflowId;
//   let newName = prompt('New name ?', element);
//   request('POST', )
// }

function deleteWorkflow(element) {
  let workflowId = element.parentNode.parentNode.id;
  request('DELETE', '/workflow/' + workflowId, function() {
    let toRemove = element.parentNode.parentNode;
    toRemove.parentNode.removeChild(toRemove);
  });
}

function createTriggerOption(name) {
  var option = document.createElement('option');
  option.value = name;
  option.innerHTML = name;
  selectTriggersNode.appendChild(option);
}

function createActionOption(name) {
  var option = document.createElement('option');
  option.value = name;
  option.innerHTML = name;
  selectActionsNode.appendChild(option);
}

function createWorkflowObjects(workflowId, workflowObjects, prefix, template) {
  let parentNode = document.querySelector(`#${workflowId} .${prefix}`);

  workflowObjects.forEach((object, key) => {
    let objectCopy = template.cloneNode(true);
    let objectId = `obj-${key}`;
    objectCopy.setAttribute('id', objectId);
    parentNode.appendChild(objectCopy);

    document.querySelector(`#${workflowId} .${prefix} #${objectId} .title`).innerHTML = object.name;

    // TODO add fields
  });
}

function createWorkflowNode(workflowId, workflow) {
  let copy = workflowTemplate.cloneNode(true);
  copy.setAttribute('id', workflowId);

  workflowsNode.appendChild(copy);
  document.querySelector(`#${workflowId} #workflow-name`).innerHTML = workflow.name;

  createWorkflowObjects(workflowId, workflow.triggers, 'triggers', triggerTemplate);
  createWorkflowObjects(workflowId, workflow.actions, 'actions', actionTemplate);
}

function loadInitialData() {
  request('GET', '/initial-data', null, function(data) {
    workflows = data.workflows;
    triggers = data.triggers;
    actions = data.actions;

    Object.keys(triggers).forEach(createTriggerOption);
    Object.keys(actions).forEach(createActionOption);

    Object.keys(workflows).forEach(file => {
      createWorkflowNode(file, workflows[file]);
    });
  });
}

window.onload = loadInitialData;