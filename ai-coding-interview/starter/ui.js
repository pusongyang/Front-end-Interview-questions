'use strict';

(function () {
  var STORAGE_KEY = 'issue-board';
  var searchEl = document.getElementById('search');
  var statusEl = document.getElementById('status');
  var labelEl = document.getElementById('label');
  var listEl = document.getElementById('list');
  var formEl = document.getElementById('create');

  var state = { issues: [] };

  function persist() {
    localStorage.setItem(STORAGE_KEY, saveState(state));
  }

  function currentFilters() {
    return {
      query: searchEl.value,
      status: statusEl.value,
      label: labelEl.value.trim(),
    };
  }

  function render() {
    var visible = applyFilters(state.issues, currentFilters());
    listEl.innerHTML = visible
      .map(function (issue) {
        var labels = (issue.labels || [])
          .map(function (name) {
            return '<span>' + name + '</span>';
          })
          .join('');
        return (
          '<article class="issue ' +
          issue.status +
          '" data-id="' +
          issue.id +
          '">' +
          '<strong>' +
          issue.title +
          '</strong>' +
          '<p>' +
          issue.body +
          '</p>' +
          '<div class="labels">' +
          labels +
          '</div>' +
          '<p class="muted">#' +
          issue.id +
          ' · ' +
          issue.status +
          '</p>' +
          '<button data-action="toggle">切换状态</button>' +
          '<button data-action="delete">删除</button>' +
          '</article>'
        );
      })
      .join('');
  }

  function onFiltersChange() {
    render();
  }

  searchEl.addEventListener('input', onFiltersChange);
  statusEl.addEventListener('change', onFiltersChange);
  labelEl.addEventListener('input', onFiltersChange);

  formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(formEl);
    state.issues = createIssue(state.issues, {
      title: data.get('title'),
      body: data.get('body'),
      labels: parseLabels(data.get('labels')),
    });
    formEl.reset();
    persist();
    render();
  });

  listEl.addEventListener('click', function (event) {
    var button = event.target.closest('button');
    if (!button) {
      return;
    }
    var article = event.target.closest('[data-id]');
    var id = Number(article.getAttribute('data-id'));
    var action = button.getAttribute('data-action');
    if (action === 'delete') {
      state.issues = deleteIssue(state.issues, id);
    }
    if (action === 'toggle') {
      state.issues = state.issues.map(function (issue) {
        return issue.id === id ? toggleStatus(issue) : issue;
      });
    }
    persist();
    render();
  });

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    state = loadState(saved);
    if (!state.issues) {
      state.issues = [];
    }
  } catch (err) {
    state = { issues: [] };
  }

  render();
})();
