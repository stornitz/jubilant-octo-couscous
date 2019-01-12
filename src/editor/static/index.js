const workflowsNode = document.getElementById('workflows');
const selectTriggersNode = document.getElementById('select-triggers');
const selectActionsNode = document.getElementById('select-actions');
const workflowTemplate = document.querySelector('#templates #workflow');

let workflows = {};
let triggers = {};
let actions = {};

function request(method, url, data=null, callback) {
  var xmlhttp = new XMLHttpRequest();

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

function createWorkflowNode(workflowId, workflow) {
  let copy = workflowTemplate.cloneNode(true);
  copy.setAttribute('id', workflowId);

  workflowsNode.appendChild(copy);
  document.querySelector(`#${workflowId} #workflow-name`).innerHTML = workflow.name;
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