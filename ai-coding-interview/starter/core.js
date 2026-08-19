'use strict';

function createIssue(issues, input) {
  const title = input.title == null ? '' : String(input.title);
  const body = input.body == null ? '' : String(input.body);
  const labels = Array.isArray(input.labels) ? input.labels : [];
  const issue = {
    id: issues.length + 1,
    title: title,
    body: body,
    labels: labels,
    status: 'open',
  };
  return issues.concat([issue]);
}

function deleteIssue(issues, id) {
  return issues.filter(function (issue) {
    return issue.id !== id;
  });
}

function toggleStatus(issue) {
  return Object.assign({}, issue, {
    status: issue.status === 'open' ? 'done' : 'open',
  });
}

function searchIssues(issues, query) {
  if (!query) {
    return issues;
  }
  return issues.filter(function (issue) {
    return issue.title.includes(query);
  });
}

function filterByStatus(issues, status) {
  return issues.filter(function (issue) {
    return issue.status === status;
  });
}

function filterByLabel(issues, label) {
  if (!label) {
    return issues;
  }
  return issues;
}

function applyFilters(issues, filters) {
  filters = filters || {};
  var next = searchIssues(issues, filters.query);
  if (filters.status) {
    next = filterByStatus(next, filters.status);
  }
  if (filters.label) {
    next = filterByLabel(next, filters.label);
  }
  return next;
}

function parseLabels(raw) {
  if (!raw) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  return String(raw).split(',');
}

function loadState(raw) {
  if (!raw) {
    return { issues: [] };
  }
  return JSON.parse(raw);
}

function saveState(state) {
  return JSON.stringify(state);
}

function parseFiltersFromSearch(search) {
  return { query: '', status: 'all', label: '' };
}

function serializeFilters(filters) {
  return '';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createIssue,
    deleteIssue,
    toggleStatus,
    searchIssues,
    filterByStatus,
    filterByLabel,
    applyFilters,
    parseLabels,
    loadState,
    saveState,
    parseFiltersFromSearch,
    serializeFilters,
  };
}
