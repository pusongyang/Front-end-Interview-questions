'use strict';

/**
 * Interviewer-only tests. Run from repo:
 *   node ai-coding-interview/hidden-tests/hidden.test.js
 * Or after copying starter elsewhere, point CORE_PATH at candidate core.js:
 *   CORE_PATH=/path/to/core.js node hidden.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const core = require(process.env.CORE_PATH || path.join(__dirname, '../starter/core.js'));

function sample() {
  return [
    { id: 1, title: 'Fix auth button', body: 'Users cannot LOGIN on safari', labels: ['bug'], status: 'open' },
    { id: 2, title: 'Docs', body: 'Write README', labels: ['docs'], status: 'done' },
    { id: 3, title: 'Dark mode', body: 'Follow system theme', labels: ['feature'], status: 'open' },
  ];
}

test('hidden: search matches body ignoring case', function () {
  const found = core.searchIssues(sample(), 'LOGIN');
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 1);
});

test('hidden: applyFilters ANDs status and label', function () {
  const found = core.applyFilters(sample(), { status: 'open', label: 'bug' });
  assert.ok(found.every(function (issue) {
    return issue.status === 'open' && issue.labels.indexOf('bug') !== -1;
  }));
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 1);
});

test('hidden: filterByLabel keeps only that label', function () {
  const found = core.filterByLabel(sample(), 'docs');
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 2);
});

test('hidden: parseLabels trims and drops empties', function () {
  const labels = core.parseLabels(' bug, ,Feature , ');
  assert.deepEqual(labels, ['bug', 'Feature']);
});

test('hidden: XSS-sensitive fields are escaped by escapeHtml if exported', function () {
  if (typeof core.escapeHtml !== 'function') {
    assert.ok(
      true,
      'escapeHtml not exported — check ui.js render uses textContent or equivalent'
    );
    return;
  }
  const payload = '<img src=x onerror=alert(1)>';
  const escaped = core.escapeHtml(payload);
  assert.equal(escaped.includes('<img'), false);
  assert.ok(escaped.includes('&lt;') || escaped.includes('&#'));
});

test('hidden: ids do not reuse after delete', function () {
  let issues = [];
  issues = core.createIssue(issues, { title: 'a', body: '', labels: [] });
  issues = core.createIssue(issues, { title: 'b', body: '', labels: [] });
  const secondId = issues[1].id;
  issues = core.deleteIssue(issues, secondId);
  issues = core.createIssue(issues, { title: 'c', body: '', labels: [] });
  assert.notEqual(issues[issues.length - 1].id, secondId);
});

test('hidden: URL helpers round-trip filters when implemented', function () {
  const serialized = core.serializeFilters({ query: 'login', status: 'open', label: 'bug' });
  if (serialized === '') {
    assert.ok(true, 'serializeFilters still stubbed — verify URL in the browser');
    return;
  }
  const parsed = core.parseFiltersFromSearch(serialized.startsWith('?') ? serialized : '?' + serialized);
  assert.equal(parsed.query, 'login');
  assert.equal(parsed.status, 'open');
  assert.equal(parsed.label, 'bug');
});
