(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('experience-network');
  const source = $('experience-data');
  if (!root || !source || !window.HomeExperienceGraph) return;
  const { buildGraph, searchGraph, readRoute, writeRoute, reportTopic, methodTopic, atlasHref, recordKindLabel } = window.HomeExperienceGraph;
  const count = new Intl.NumberFormat('ko-KR');
  const pageSize = 12;
  const report = 'report-strategy-ax-performance.html';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const queryInput = $('xn-query');
  const canvas = $('xn-canvas');
  const list = $('xn-list');
  const detail = $('xn-detail');
  const recordsEl = $('xn-records');
  const groupsEl = $('xn-hubs');
  const pagesEl = $('xn-pages');
  const float = $('xn-float');
  const controls = $('xn-controls');
  const status = $('xn-status');
  let payload = {};
  try { payload = JSON.parse(source.textContent); } catch (error) { console.error('Experience data could not be read.', error); }
  const model = buildGraph(Array.isArray(payload?.records) ? payload.records : []);
  let state = readRoute(location.href, model);
  let page = 0;
  let data = { hubs: model.hubs, entries: model.entries, nodes: model.nodes };
  let renderer;
  let earthRenderer;
  let returnToUniverse = history.state?.experienceGraph?.returnToUniverse || null;

  function element(tag, label, attrs = {}) {
    const node = document.createElement(tag);
    if (label != null) node.textContent = label;
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }
  function kicker(label) { return element('p', label, { class: 'xn-kicker' }); }
  function publicValue(value) { return value != null && String(value).trim() && !/(?:\[?미확인\]?|미대조|확인 중|확인 전|미분류|증빙 대조|원본 연결|내부 검수)/.test(String(value)); }
  function layerLabel(value) {
    return { '원본 엑셀 이력': '수행 이력 자료', '기존 익명 이력': '비공개 수행 이력', '이전 공개 이력': '공개 수행 이력', '대표 제공 프로필': '대표 프로필' }[value] || value || '';
  }
  function sourceLabel(record) {
    return { '증명 원장': '수행실적 목록', '원본후보 엑셀': '수행 이력 자료', '기존 익명 이력': '비공개 수행 이력', '대표 제공 프로필': '대표 프로필', '이전 홈페이지 이력': '기존 홈페이지 소개', '이전 공개자료': '기존 공개자료' }[record.sourceType || record.source] || '';
  }
  function ownerLabel(record) {
    if (record.layer === '법인 실적') return '주식회사 스트래티지';
    if (record.layer === '대표 개인 이력') return '대표 개인의 이전 수행 경력';
    return publicValue(record.evidenceOwner) ? record.evidenceOwner : '';
  }
  function link(label, href, primary = false) { return element('a', label, { href, class: primary ? 'xn-action xn-primary' : 'xn-action' }); }
  function button(label, action, key, primary = false) {
    const item = element('button', label, { type: 'button', class: primary ? 'xn-action xn-primary' : 'xn-action', 'data-action': action });
    if (key) item.dataset.key = key;
    return item;
  }
  function reportHref(topic) {
    const query = new URLSearchParams();
    if (topic) query.set('topic', topic);
    const hub = model.byKey.get(state.group);
    const node = model.byKey.get(state.selected);
    if (hub) query.set('theme', hub.label);
    if (node?.kind === 'record') query.set('record', node.record.id);
    return report + (query.size ? '?' + query : '');
  }
  function hubOf(node) { return node?.kind === 'theme' ? node : model.byKey.get(node?.group); }
  function listScope(view) {
    return view.group || (!view.query.trim() ? hubOf(model.byKey.get(view.selected))?.key : null);
  }

  function historyPayload(view) {
    return { ...history.state, experienceGraph: { view, returnToUniverse, listOpen: list.open, page } };
  }
  function saveView(view) { history.replaceState(historyPayload(view), '', location.href); }
  function navigate(next, options = {}) {
    const previous = writeRoute(location.href, state, model);
    saveView(renderer?.snapshot() || null);
    state = next;
    if (!options.keepPage) page = 0;
    if (options.listOpen != null) list.open = options.listOpen;
    const nextUrl = writeRoute(location.href, next, model);
    if (previous !== nextUrl) history.pushState(historyPayload(null), '', nextUrl);
    render(options.view, options.focus, options.reset);
    saveView(renderer?.snapshot() || null);
  }

  function select(key, focus) {
    if (!model.byKey.has(key)) return;
    const node = model.byKey.get(key);
    const next = { ...state, selected: key, ...(state.level === 'earth' && node.kind === 'theme' ? { group: key, legacy: reportTopic(node.label) || null, query: '' } : {}) };
    navigate(next, { focus, keepPage: listScope(state) === listScope(next) });
  }

  function goEarth(key) {
    const node = model.byKey.get(key || state.selected);
    const hub = hubOf(node) || model.byKey.get(state.group);
    navigate({ ...state, level: 'earth', group: hub?.key || null, selected: node?.key || hub?.key || null }, { listOpen: true });
    $('xn-earth').scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
  }

  function goSolar() {
    if (!state.group) return goUniverse();
    navigate({ ...state, level: 'solar', selected: state.group }, { listOpen: false });
  }

  function explore(key) {
    const hub = model.byKey.get(key);
    if (hub?.kind !== 'theme') return;
    if (state.level === 'universe') returnToUniverse = { state: { ...state }, view: renderer?.snapshot() || null, listOpen: list.open };
    const legacy = reportTopic(hub.label);
    navigate({ level: 'solar', group: key, selected: key, query: '', legacy: legacy || null }, { listOpen: false });
    $('xn-universe').focus({ preventScroll: true });
  }

  function goUniverse() {
    if (state.level === 'universe') {
      if (state.selected || state.query || state.legacy) {
        navigate({ level: 'universe', group: null, selected: null, query: '', legacy: null }, { reset: true });
      }
      renderer?.zoomBy('fit');
      return;
    }
    if (state.query.trim() && state.level !== 'earth') {
      search(state.query, null);
      return;
    }
    const back = returnToUniverse;
    const next = back?.state || { level: 'universe', group: null, selected: null, query: '', legacy: null };
    navigate(next, { view: back?.view, listOpen: back?.listOpen ?? false });
  }

  function submitSearch(event) {
    event.preventDefault();
    search(queryInput.value.trim(), state.group);
  }

  function search(query, group) {
    const results = searchGraph(model, query, group);
    const node = query ? results.hubs[0] || results.entries[0] : model.byKey.get(group);
    navigate({ level: state.level === 'earth' ? 'earth' : group ? 'solar' : 'universe', group, selected: node?.key || null, query, legacy: group ? state.legacy : null },
      { focus: Boolean(query && node), listOpen: Boolean(query) || !renderer });
  }

  function renderCounts() {
    const visibleHub = model.byKey.get(state.group);
    const stats = visibleHub ? [[visibleHub.members.length, '관련 자료'], [1, '과업 주제']] :
      [[model.entries.length, '공개 자료'], [model.hubs.length, '과업 주제']];
    $('xn-counts').replaceChildren(...stats.map(([value, label]) => {
      const stat = element('span');
      stat.append(element('b', count.format(value)), document.createTextNode(' ' + label));
      return stat;
    }));
  }

  function renderFloat(node, hub) {
    const box = [];
    if (node?.kind === 'record') {
      box.push(kicker('선택한 수행 경험'), element('strong', node.label), element('p', hub?.label || layerLabel(node.record.layer) || '공개 경험 자료'),
        link('자료 상세 ↗', atlasHref('record', node.record.id), true));
    } else if (hub) {
      box.push(kicker('선택한 과업 주제'), element('strong', hub.label), element('p', count.format(hub.members.length) + '개 관련 자료'),
        state.group ? button('지구 · 수행 경험 보기 →', 'earth', hub.key, true) : button('주제 탐색 →', 'explore', hub.key, true));
    } else {
      box.push(kicker('01 우주 · 수행 경험'), element('strong', '경험의 관계 지도'),
        element('p', '빛이 큰 점은 주제입니다. 주제나 자료를 선택하면 연결을 밝힙니다.'),
        button('주제 목록 보기 ↓', 'list'));
    }
    float.replaceChildren(...box);
    float.hidden = !renderer;
  }

  function renderDetail(node, hub) {
    const content = [];
    if (node?.kind === 'record') {
      const { record } = node;
      content.push(kicker('선택한 수행 경험'), element('h2', node.label));
      const facts = element('dl', null, { class: 'xn-facts' });
      for (const [name, value] of [
        ['과업 주제', record.theme], ['수행 구분', layerLabel(record.layer)], ['수행 주체', ownerLabel(record)],
        ['당시 소속', record.affiliation || record.organizationAtTime], ['공개 기관명', record.institution],
        ['자료 유형', recordKindLabel(record.recordKind)], ['자료 출처', sourceLabel(record)],
        ['기간', record.period || record.year]
      ]) {
        if (publicValue(value)) facts.append(element('dt', name), element('dd', value));
      }
      content.push(facts);
      if (!ownerLabel(record)) content.push(element('p', '수행 주체와 당시 소속은 상담 시 개별 확인합니다.'));
      content.push(link('과업·수행 주체·출처 상세 보기 ↗', atlasHref('record', record.id), true));
      content.push(link('이 과업을 참고해 상담하기 ↗', 'inquiry.html?records=' + encodeURIComponent(record.id)));
      if (hub && !state.group) content.push(button('이 자료의 주제 탐색 →', 'explore', hub.key));
    } else if (hub) {
      content.push(kicker('선택한 과업 주제'), element('h2', hub.label),
        element('p', '관련 수행 경험과 자료 ' + count.format(hub.members.length) + '개를 살펴보십시오. 과업을 선택하면 수행 구분과 출처를 확인할 수 있습니다.'),
        state.level === 'earth' ? button('관련 과업 목록 보기 ↓', 'list', null, true) : state.group ? button('지구 · 수행 경험 보기 →', 'earth', hub.key, true) : button('주제 탐색 →', 'explore', hub.key, true),
        link('이 주제의 전체 경험 보기 ↗', atlasHref('theme', hub.label)));
    } else {
      content.push(kicker('수행 경험 탐색'), element('h2', '우리 기관과 비슷한 과제를 찾아보십시오.'),
        element('p', '주제를 고르고 실제 과업과 수행 주체를 살펴보십시오. 법인 실적과 대표 컨설턴트의 경력은 자료 상세에서 구분해 안내합니다.'),
        button('주제와 자료 목록 ↓', 'list'));
    }
    detail.replaceChildren(...content);
  }

  function renderRelated(hub) {
    const topic = methodTopic(hub?.label || '') || state.legacy;
    const reportTopicName = ['strategy', 'organization', 'performance', 'ax'].includes(topic) ? topic : '';
    $('xn-related').replaceChildren(kicker('과제에서 실행 계획까지'), element('h2', '관련 분석 방법과 상담'),
      link('전략·AX·성과관리 분석 리포트 ↗', reportHref(reportTopicName)),
      link('분석 방법과 적용조건 ↗', topic ? 'approach.html#framework-' + topic : 'approach.html'),
      link('기관·과업별 전체 경험 보기 ↗', 'atlas.html?view=list'),
      link('우리 기관의 과제 상담하기 ↗', 'inquiry.html' + (hub ? '?topic=' + encodeURIComponent(hub.label) : '')),
      element('p', '같은 과업이 여러 출처에 기록될 수 있습니다. 자료 수와 고유 계약 건수는 다릅니다.'));
  }

  function renderList() {
    const group = model.byKey.get(listScope(state));
    const hubs = state.level === 'earth' ? model.hubs : state.group ? [] : data.hubs;
    const hasQuery = Boolean(state.query.trim());
    const entries = orderedRecords(group && !state.group ? group.members : data.entries);
    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
    page = Math.min(page, totalPages - 1);
    const label = hasQuery ? '검색 자료' : group ? '연결 자료' : '전체 자료';
    $('xn-list-title').textContent = [group?.label, label, count.format(entries.length) + '개'].filter(Boolean).join(' ');
    groupsEl.hidden = !hubs.length;
    groupsEl.replaceChildren(...hubs.map(hub => {
      const chip = button(hub.label + ' · ' + count.format(hub.members.length), 'select', hub.key);
      chip.setAttribute('aria-pressed', String(state.selected === hub.key));
      return chip;
    }));
    recordsEl.replaceChildren(...entries.slice(page * pageSize, (page + 1) * pageSize).map(node => {
      const row = element('li');
      const record = button(node.label, 'select', node.key);
      record.setAttribute('aria-pressed', String(state.selected === node.key));
      row.append(record);
      if (state.level === 'earth') row.append(link('자료 상세 ↗', atlasHref('record', node.record.id)));
      const description = [node.record.theme, layerLabel(node.record.layer)].filter(Boolean).join(' · ');
      if (description) row.append(element('small', description));
      return row;
    }));
    if (!entries.length) {
      const message = hasQuery ? '일치하는 자료가 없습니다.' : '공개 자료가 없습니다.';
      recordsEl.append(element('li', message));
    }
    const prev = button('이전', 'previous');
    const next = button('다음', 'next');
    prev.disabled = page === 0;
    next.disabled = page + 1 >= totalPages;
    pagesEl.hidden = totalPages === 1;
    pagesEl.replaceChildren(prev, element('span', count.format(page + 1) + ' / ' + count.format(totalPages)), next);
  }

  function orderedRecords(entries) {
    if (state.level !== 'earth') return entries;
    const priority = record => record.recordKind === 'certificate_record' ? record.layer === '법인 실적' ? 0 : record.layer === '대표 개인 이력' ? 1 : 2 :
      ({ legacy_record: 3, public_source_record: 4, profile_phrase: 5, source_occurrence_group: 6 }[record.recordKind] ?? 7);
    const year = record => Math.max(0, ...(String(record.period || record.year || '').match(/(?:19|20)\d{2}/g) || []).map(Number));
    return [...entries].sort((a, b) => priority(a.record) - priority(b.record) || year(b.record) - year(a.record) || a.label.localeCompare(b.label, 'ko'));
  }

  function renderEarth(hub) {
    const earth = $('xn-earth');
    if (!earth) return;
    const isEarth = state.level === 'earth';
    earth.hidden = !isEarth;
    $('xn-space').hidden = isEarth;
    root.querySelector('.xn-footline').hidden = isEarth;
    if (!isEarth) return;
    const title = state.legacy === 'ax' && !hub ? 'AI·AX · 분석 방법과 수행 경험' : (hub?.label || '전체 수행 경험');
    $('xn-earth-title').textContent = title;
    $('xn-earth-intro').textContent = state.legacy === 'ax' && !hub ?
      'AI·AX 적용 방법과 검토 조건을 확인하십시오. 아래는 함께 참고할 수 있는 전체 수행 경험입니다.' :
      '실제 과업을 선택해 수행 주체와 자료를 살펴보고, 우리 기관에 필요한 분석 방법을 확인하십시오.';
    const entries = orderedRecords(data.entries);
    let featured = entries.slice(0, 3);
    if (!state.group) {
      const corporate = entries.filter(node => node.record.layer === '법인 실적');
      const personal = entries.filter(node => node.record.layer === '대표 개인 이력');
      if (corporate.length && personal.length) {
        featured = [...corporate.slice(0, 2), personal[0]];
        featured = [...featured, ...entries.filter(node => !featured.includes(node))].slice(0, 3);
      }
    }
    const previews = featured.map(node => {
      const card = element('article', null, { class: 'xn-earth-case' });
      card.append(button(node.label + ' →', 'select', node.key, state.selected === node.key),
        element('small', [node.record.theme || '기타 공개 자료', layerLabel(node.record.layer)].filter(Boolean).join(' · ')),
        link('자료 상세 ↗', atlasHref('record', node.record.id)));
      return card;
    });
    if (!previews.length) previews.push(element('p', '조건에 맞는 자료가 없습니다. 검색어를 바꾸거나 다른 주제를 선택하십시오.'));
    $('xn-earth-cases').replaceChildren(...previews);
    const topic = methodTopic(hub?.label || '') || state.legacy;
    $('xn-earth-actions').replaceChildren(
      link('관련 분석 방법 ↗', topic ? 'approach.html#framework-' + topic : 'approach.html'),
      link('과제 상담하기 ↗', 'inquiry.html' + (hub ? '?topic=' + encodeURIComponent(hub.label) : '')));
    list.open = true;
    if (!earthRenderer) earthRenderer = window.HomeExperienceEarth?.($('xn-earth-globe'));
    earthRenderer?.draw();
  }

  function render(view, focus, reset) {
    const node = model.byKey.get(state.selected);
    const hub = hubOf(node) || model.byKey.get(state.group);
    data = searchGraph(model, state.query, state.group);
    queryInput.value = state.query;
    $('xn-search').querySelector('label').textContent = state.group ? '이 주제의 공개 자료 검색' : '공개 경험 자료 검색';
    const selected = node ? ' · ' + node.label + ' 선택' : '';
    const lens = state.group ? model.byKey.get(state.group)?.label || '' : '';
    root.dataset.level = state.level;
    root.dataset.selection = node?.kind || '';
    $('xn-universe').setAttribute('aria-current', state.level === 'universe' ? 'step' : 'false');
    $('xn-level').setAttribute('aria-current', state.level === 'solar' ? 'step' : 'false');
    $('xn-level').textContent = lens ? '02 태양계 · ' + lens : '02 태양계';
    $('xn-earth-entry').setAttribute('aria-current', state.level === 'earth' ? 'step' : 'false');
    const ax = state.legacy === 'ax' && !state.group ? 'AI·AX 분석 방법과 전체 수행 경험을 살펴보십시오.' : '';
    const queryText = state.query ? '검색 일치 · 주제 ' + count.format(data.hubs.length) + '개 · 자료 ' + count.format(data.entries.length) + '개' : '';
    status.textContent = ax || (queryText ? queryText + selected : (state.level === 'earth' ? (lens || '전체 수행 경험') + ' · 지구' : lens ? lens + ' 태양계' : '우주 · 전체 관계') + selected);
    renderCounts();
    renderFloat(node, hub);
    renderDetail(node, hub);
    renderRelated(hub);
    renderList();
    renderEarth(model.byKey.get(state.group));
    renderer?.setState(state, data, view, focus, reset);
  }

  function openList() {
    list.open = true;
    const summary = list.querySelector('summary');
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ block: 'center', behavior: motion.matches ? 'instant' : 'smooth' });
  }

  root.addEventListener('click', event => {
    const action = event.target.closest('[data-action]');
    if (!action) return;
    if (action.dataset.action === 'select') {
      const key = action.dataset.key;
      select(key, true);
      if (mobile.matches || state.level === 'earth') {
        detail.querySelector('h2').tabIndex = -1;
        detail.querySelector('h2').focus({ preventScroll: true });
        detail.scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
      } else {
        [...list.querySelectorAll('[data-key]')].find(item => item.dataset.key === key)?.focus({ preventScroll: true });
      }
    }
    if (action.dataset.action === 'explore') explore(action.dataset.key);
    if (action.dataset.action === 'earth') goEarth(action.dataset.key);
    if (action.dataset.action === 'list') openList();
    if (action.dataset.action === 'previous' || action.dataset.action === 'next') {
      page += action.dataset.action === 'next' ? 1 : -1;
      renderList();
      saveView(renderer?.snapshot() || null);
      const matching = pagesEl.querySelector('[data-action="' + action.dataset.action + '"]:enabled');
      (matching || recordsEl.querySelector('button'))?.focus({ preventScroll: true });
    }
  });
  $('xn-search').addEventListener('submit', submitSearch);
  $('xn-universe').addEventListener('click', goUniverse);
  $('xn-level').addEventListener('click', goSolar);
  $('xn-earth-entry').addEventListener('click', () => goEarth());
  $('xn-show-list').addEventListener('click', openList);
  controls.addEventListener('click', event => {
    const action = event.target.closest('[data-zoom]')?.dataset.zoom;
    if (action) renderer?.zoomBy(action);
  });
  canvas.addEventListener('keydown', event => {
    const zoomAction = { '+': 'in', '=': 'in', '-': 'out', Home: 'fit' }[event.key];
    const pan = { ArrowLeft: [45, 0], ArrowRight: [-45, 0], ArrowUp: [0, 45], ArrowDown: [0, -45] }[event.key];
    if (zoomAction || pan) event.preventDefault();
    if (zoomAction) renderer?.zoomBy(zoomAction);
    if (pan) renderer?.pan(...pan);
  });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.level !== 'universe' && !event.target.matches('input')) {
      if (state.level === 'earth') goSolar(); else goUniverse();
      $('xn-universe').focus();
    }
  });
  window.addEventListener('popstate', event => {
    state = readRoute(location.href, model);
    const saved = event.state?.experienceGraph;
    returnToUniverse = saved?.returnToUniverse || null;
    list.open = saved?.listOpen ?? Boolean(state.query);
    page = saved?.page || 0;
    render(saved?.view, Boolean(state.selected && !saved?.view), !saved?.view);
  });

  try { renderer = window.HomeExperienceCanvas?.createCanvas(canvas, model, select, saveView); }
  catch (error) { console.error('Experience graph canvas could not start.', error); }
  canvas.hidden = !renderer;
  controls.hidden = !renderer;
  $('xn-empty').hidden = Boolean(renderer);
  list.open = !renderer || Boolean(state.query) || Boolean(history.state?.experienceGraph?.listOpen);
  page = history.state?.experienceGraph?.page || 0;
  render(history.state?.experienceGraph?.view, Boolean(state.selected && !state.group));
  saveView(renderer?.snapshot() || null);
  if (state.level === 'earth') requestAnimationFrame(() => $('xn-earth').scrollIntoView({ block: 'start' }));
  list.addEventListener('toggle', () => saveView(renderer?.snapshot() || null));
})();
