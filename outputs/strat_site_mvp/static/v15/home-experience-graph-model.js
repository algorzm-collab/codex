(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HomeExperienceGraph = factory();
})(globalThis, function () {
  'use strict';

  const legacyTopics = Object.freeze({
    strategy: { themes: ['전략', '중장기전략'], report: true },
    portfolio: { themes: ['신사업·포트폴리오'] },
    organization: { themes: ['조직', '조직진단'], report: true },
    job: { themes: ['직무·인사·보수', '직무·인사'] },
    performance: { themes: ['성과관리'], report: true },
    ax: { themes: [], report: true, label: 'AI·AX' }
  });
  const recordKindLabels = new Map([
    ['certificate_record', '수행 증빙 자료'],
    ['profile_phrase', '대표 컨설턴트 경력 자료'],
    ['legacy_record', '공개 수행 이력'],
    ['public_source_record', '공개 출처 자료'],
    ['source_occurrence_group', '수행 이력 자료']
  ]);
  const themeKey = label => 'theme:' + label;
  const recordKey = id => 'record:' + id;
  const clean = value => typeof value === 'string' ? value.trim() : '';
  const normalize = value => clean(value).normalize('NFKC').toLocaleLowerCase('ko-KR');
  const atlasHref = (name, value) => 'atlas.html?view=list&' + name + '=' + encodeURIComponent(value);
  const byLabel = (a, b) => a.label.localeCompare(b.label, 'ko') || a.key.localeCompare(b.key);
  const recordKindLabel = kind => recordKindLabels.get(kind) || '공개 자료';

  function buildGraph(records) {
    const themes = new Map();
    const documents = new Map();
    for (const record of records) {
      if (!record || !clean(record.id) || documents.has(record.id)) continue;
      const label = clean(record.theme) || '기타 공개 자료';
      const group = themeKey(label);
      if (group && !themes.has(group)) {
        themes.set(group, { key: group, kind: 'theme', label, members: [] });
      }
      const title = clean(record.title) ? record.title : recordKindLabel(record.recordKind) + ' · 과업명 비공개';
      const document = { key: recordKey(record.id), kind: 'record', label: title, group, record };
      if (group) themes.get(group).members.push(document);
      documents.set(record.id, document);
    }
    const hubs = [...themes.values()].sort(byLabel);
    const entries = [...documents.values()].sort((a, b) => a.key.localeCompare(b.key));
    for (const hub of hubs) hub.members.sort(byLabel);
    const nodes = [...hubs, ...entries];
    const edges = entries.filter(node => node.group).map(node => ({
      source: node.group,
      target: node.key,
      relation: 'source-theme'
    }));
    return { hubs, entries, nodes, edges, byKey: new Map(nodes.map(node => [node.key, node])) };
  }

  function searchGraph(model, query, group = null) {
    const availableHubs = group ? model.hubs.filter(hub => hub.key === group) : model.hubs;
    const availableEntries = group ? model.byKey.get(group)?.members || [] : model.entries;
    const terms = normalize(query).split(/\s+/u).filter(Boolean);
    if (!terms.length) return { hubs: availableHubs, entries: availableEntries, nodes: [...availableHubs, ...availableEntries] };
    const matches = value => terms.every(term => value.includes(term));
    const hubs = availableHubs.filter(node => matches(normalize(node.label)));
    const entries = availableEntries.filter(({ label, record }) => matches(
      normalize([label, record.theme, record.institution, record.id].filter(Boolean).join(' '))
    )).sort(byLabel);
    return { hubs, entries, nodes: [...hubs, ...entries] };
  }

  function readRoute(url, model) {
    const q = new URL(url, 'https://example.invalid/').searchParams;
    const requested = q.get('level');
    const level = requested === 'solar' || requested === 'earth' ? requested : 'universe';
    const legacy = q.get('topic');
    const legacyTopic = Object.hasOwn(legacyTopics, legacy) ? legacyTopics[legacy] : null;
    const raw = q.get('theme');
    const hub = (raw && model.byKey.get(themeKey(raw))) || legacyTopic?.themes
      .map(theme => model.byKey.get(themeKey(theme))).find(Boolean);
    const rawRecord = q.get('record');
    const record = rawRecord && model.byKey.get(recordKey(rawRecord));
    const group = level !== 'universe' ? (hub?.key || record?.group || null) : null;
    const query = q.get('q') || '';
    const results = clean(query) ? searchGraph(model, query, group) : null;
    const suggested = results && (results.hubs.includes(hub) ? hub : results.hubs[0] || results.entries[0]);
    const selected = record && (!group || record.group === group) ? record.key : results ? suggested?.key : hub?.key || group;
    return {
      level: level === 'earth' ? 'earth' : group ? 'solar' : 'universe',
      group,
      selected: selected || null,
      query,
      legacy: legacyTopic ? legacy : null
    };
  }

  function writeRoute(url, state, model) {
    const current = new URL(url, 'https://example.invalid/');
    const q = current.searchParams;
    for (const key of ['level', 'topic', 'theme', 'record', 'q']) q.delete(key);
    q.set('level', state.level);
    if (state.legacy) q.set('topic', state.legacy);
    const group = model.byKey.get(state.group);
    const selected = model.byKey.get(state.selected);
    const hub = group || (selected?.kind === 'theme' ? selected : null);
    if (hub) q.set('theme', hub.label);
    if (selected?.kind === 'record') q.set('record', selected.record.id);
    if (state.query) q.set('q', state.query);
    return current.pathname + current.search + current.hash;
  }

  function reportTopic(label) {
    const match = Object.entries(legacyTopics).find(([, definition]) => definition.report && definition.themes.includes(label));
    if (match) return match[0];
    if (/조직|organization/i.test(label)) return 'organization';
    if (/성과|performance/i.test(label)) return 'performance';
    if (/전략|strategy|가치체계/i.test(label)) return 'strategy';
    return '';
  }

  function methodTopic(label) {
    return Object.entries(legacyTopics).find(([, definition]) => definition.themes.includes(label))?.[0] || reportTopic(label);
  }

  return { buildGraph, searchGraph, readRoute, writeRoute, reportTopic, methodTopic, atlasHref, recordKindLabel };
});
