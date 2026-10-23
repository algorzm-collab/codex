(function (root) {
  'use strict';

  if (!root || !root.document) return;

  const document = root.document;
  const rowSelector = [
    'tr',
    '[role="row"]',
    '.experience-row',
    '.record-row',
    '.atlas-row',
    '[data-record-id]',
    '#experience-list > li',
    '#atlas-list > li',
    '.experience-list > li',
    '.atlas-list > li'
  ].join(', ');

  let cachedSource = null;
  let cachedText = null;
  let cachedRecords = [];
  let activeRow = null;
  let activeRecord = null;

  function parseJson(text) {
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (_) {
      return null;
    }
  }

  function asRecords(value) {
    if (Array.isArray(value)) return value;

    if (!value || typeof value !== 'object') return [];

    for (const key of ['records', 'experiences', 'items', 'data']) {
      if (Array.isArray(value[key])) return value[key];
    }

    return [];
  }

  function recordId(record) {
    if (!record || typeof record !== 'object') return '';

    const value = record.id || record.recordId || record.record_id;
    return value == null ? '' : String(value);
  }

  function recordsFromElements(container) {
    const selector = '[data-record-id], [data-id], [data-record]';
    const elements = [];

    if (container.matches && container.matches(selector)) {
      elements.push(container);
    }

    elements.push(...container.querySelectorAll(selector));

    const seen = new Set();

    return elements.map(function (element) {
      const embedded = parseJson(
        element.getAttribute('data-record') ||
        element.getAttribute('data-json') ||
        ''
      );

      const record = Object.assign(
        {},
        embedded && typeof embedded === 'object' ? embedded : {},
        element.dataset || {}
      );

      record.id =
        element.getAttribute('data-record-id') ||
        record.recordId ||
        element.getAttribute('data-id') ||
        record.id ||
        '';

      if (!record.title && !record.projectName) {
        record.title = (element.textContent || '').trim();
      }

      const id = recordId(record);
      if (id && seen.has(id)) return null;
      if (id) seen.add(id);

      return record;
    }).filter(Boolean);
  }

  function readRecords() {
    const container = document.getElementById('experience-data');
    if (!container) return [];

    const jsonNode =
      container.matches('script, textarea')
        ? container
        : container.querySelector('script[type="application/json"], textarea');

    const dataAttribute = container.getAttribute('data-records') || '';
    const text = dataAttribute || (jsonNode || container).textContent || '';

    if (
      container === cachedSource &&
      text === cachedText
    ) {
      return cachedRecords;
    }

    const parsed = parseJson(text);
    let records = asRecords(parsed);

    if (!records.length) {
      records = recordsFromElements(container);
    }

    cachedSource = container;
    cachedText = text;
    cachedRecords = records;

    return records;
  }

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function namesFor(record) {
    const fields = [
      'projectName',
      'project',
      'title',
      'originalProjectText',
      'originalTitle',
      'taskName',
      'name'
    ];

    const names = [];

    for (const field of fields) {
      const value = record && record[field];
      const values = Array.isArray(value) ? value : [value];

      for (const item of values) {
        const name = normalizeText(item);
        if (name.length >= 2 && !names.includes(name)) names.push(name);
      }
    }

    return names;
  }

  function rowFor(target) {
    const element =
      target && target.nodeType === 1
        ? target
        : target && target.parentElement;

    if (!element || typeof element.closest !== 'function') return null;

    return element.closest(rowSelector);
  }

  function recordForRow(row) {
    const records = readRecords();
    if (!records.length) return null;

    let idElement = row.matches('[data-record-id], [data-id]')
      ? row
      : row.querySelector('[data-record-id], [data-id]');

    const rowId = idElement
      ? idElement.getAttribute('data-record-id') ||
        idElement.getAttribute('data-id') ||
        ''
      : '';

    if (rowId) {
      const byId = records.find(function (record) {
        return recordId(record) === String(rowId);
      });

      if (byId) return byId;
    }

    const rowText = normalizeText(row.innerText || row.textContent);
    if (!rowText) return null;

    let matches = records.map(function (record) {
      const names = namesFor(record);
      const longestName = names.reduce(function (longest, name) {
        return rowText.includes(name) && name.length > longest.length
          ? name
          : longest;
      }, '');

      return longestName ? { record: record, name: longestName } : null;
    }).filter(Boolean);

    if (!matches.length) return null;

    const longestMatch = Math.max.apply(
      null,
      matches.map(function (match) {
        return match.name.length;
      })
    );

    matches = matches.filter(function (match) {
      return match.name.length === longestMatch;
    });

    if (matches.length > 1) {
      const byInstitution = matches.filter(function (match) {
        const institution = normalizeText(match.record.institution);
        return institution && rowText.includes(institution);
      });

      if (byInstitution.length) matches = byInstitution;
    }

    if (matches.length > 1) {
      const byYear = matches.filter(function (match) {
        const year = normalizeText(match.record.year);
        return year && rowText.includes(year);
      });

      if (byYear.length) matches = byYear;
    }

    return matches.length === 1 ? matches[0].record : null;
  }

  function show(record, event) {
    const card = root.experienceHoverCard;
    if (!card || typeof card.show !== 'function') return;

    card.show(record, event.clientX, event.clientY);
  }

  function hide() {
    const card = root.experienceHoverCard;
    if (card && typeof card.hide === 'function') {
      card.hide();
    }

    activeRow = null;
    activeRecord = null;
  }

  function activate(row, record, event) {
    if (!record) {
      if (activeRow !== row) hide();
      return;
    }

    activeRow = row;
    activeRecord = record;
    show(record, event);
  }

  document.addEventListener('mouseover', function (event) {
    const row = rowFor(event.target);
    if (!row || rowFor(event.relatedTarget) === row) return;

    activate(row, recordForRow(row), event);
  });

  document.addEventListener('mousemove', function (event) {
    const row = rowFor(event.target);
    if (!row) return;

    if (row !== activeRow) {
      activate(row, recordForRow(row), event);
      return;
    }

    if (activeRecord) show(activeRecord, event);
  });

  document.addEventListener('mouseout', function (event) {
    const row = rowFor(event.target);
    if (!row || row !== activeRow) return;
    if (rowFor(event.relatedTarget) === row) return;

    hide();
  });
})(typeof window !== 'undefined' ? window : null);
