'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('./core.js');

const sample = [
  { id: 1, title: 'Fix auth button', body: 'Users cannot LOGIN on safari', labels: ['bug'], status: 'open' },
  { id: 2, title: 'Docs', body: 'Write README', labels: ['docs'], status: 'done' },
  { id: 3, title: 'Dark mode', body: 'Follow system theme', labels: ['feature'], status: 'open' },
];

test('search is case-insensitive and includes body', function () {
  const found = core.searchIssues(sample, 'login');
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 1);
});

test('empty search returns all issues', function () {
  assert.equal(core.searchIssues(sample, '').length, 3);
  assert.equal(core.searchIssues(sample, null).length, 3);
});

test('status filter all returns every status', function () {
  const found = core.filterByStatus(sample, 'all');
  assert.equal(found.length, 3);
});

test('status filter open returns only open', function () {
  const found = core.filterByStatus(sample, 'open');
  assert.equal(found.length, 2);
});

test('applyFilters can combine query and status', function () {
  const found = core.applyFilters(sample, { query: 'dark', status: 'open' });
  assert.equal(found.length, 1);
  assert.equal(found[0].id, 3);
});
