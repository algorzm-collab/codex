(function () {
  'use strict';
  const { layoutGraph, unit } = window.HomeExperienceLayout;
  const settings = { maxPixelRatio: 2, maxZoom: 6, pickRadius: 18, desktop: 761 };
  const palette = {
    lines: ['rgba(79,177,210,.17)', 'rgba(53,113,146,.09)', 'rgba(122,227,255,.49)', 'rgba(106,190,247,.25)'],
    hub: '#97e9ff', record: '#70cfe9', selected: '#f5fdff'
  };
  const inside = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  function createCanvas(canvas, model, onSelect, onView) {
    const ctx = canvas.getContext('2d');
    const d3 = window.d3;
    if (!ctx || !d3?.forceSimulation || !model.nodes.length) return null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const positions = new Map(layoutGraph(model, d3).map(node => [node.key, node]));
    const stars = Array.from({ length: 275 }, (_, i) => ({
      x: unit('field/x/' + i * 4819), y: unit('field/y/' + i * 5743), size: unit('field/s/' + i * 9277)
    }));
    let width = 0, height = 0, ratio = 1, frame = 0, active = null, hover = null, started = null;
    let visible = [], edges = [], selected = null, matched = new Set(), query = false;
    let members = new Set(), home = d3.zoomIdentity, transform = home, centerX = 0, centerY = 0, reframe = false;
    let selectionAt = 0;
    const surface = d3.select(canvas);
    const zoom = d3.zoom().scaleExtent([.12, 16])
      .filter(event => event.type === 'wheel' ? event.ctrlKey || event.metaKey || document.activeElement === canvas :
        (!event.ctrlKey && !event.button))
      .on('zoom', event => { transform = event.transform; requestDraw(); })
      .on('end', event => {
        if (event.sourceEvent && !reframe) onView(snapshot());
      });
    surface.call(zoom).on('dblclick.zoom', null);

    function snapshot() {
      return {
        x: transform.invertX(centerX), y: transform.invertY(centerY),
        scale: transform.k / home.k
      };
    }

    function fit(saved) {
      if (!width || !height || !visible.length) return;
      const margin = width < settings.desktop ? 24 : 52;
      const graphWidth = width >= settings.desktop ? width * .76 : width;
      centerX = graphWidth / 2;
      centerY = height * .50;
      const [minX, maxX] = d3.extent(visible, node => node.x);
      const [minY, maxY] = d3.extent(visible, node => node.y);
      const scale = Math.min((graphWidth - margin * 2) / Math.max(maxX - minX, 88),
        (height - margin * 2) / Math.max(maxY - minY, 88), 3.7);
      const x = (minX + maxX) / 2;
      const y = (minY + maxY) / 2;
      home = d3.zoomIdentity.translate(centerX - x * scale, centerY - y * scale).scale(scale);
      zoom.scaleExtent([scale * .48, scale * settings.maxZoom]);
      const factor = saved ? Math.max(.48, Math.min(settings.maxZoom, saved.scale)) : 1;
      const fitted = saved ? d3.zoomIdentity.translate(centerX - saved.x * scale * factor,
        centerY - saved.y * scale * factor).scale(scale * factor) : home;
      applyTransform(fitted);
    }

    function applyTransform(value) {
      reframe = true;
      surface.call(zoom.transform, value);
      reframe = false;
    }

    function resize() {
      const next = canvas.getBoundingClientRect();
      if (!next.width || !next.height || (width === next.width && height === next.height)) return;
      const saved = width ? snapshot() : null;
      width = next.width;
      height = next.height;
      ratio = Math.min(window.devicePixelRatio || 1, settings.maxPixelRatio);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      fit(saved);
      requestDraw();
    }
    new ResizeObserver(resize).observe(canvas);

    function pick(x, y) {
      let closest = null;
      let best = Infinity;
      for (const node of visible) {
        const dx = transform.applyX(node.x) - x;
        const dy = transform.applyY(node.y) - y;
        const distance = Math.hypot(dx, dy);
        const limit = node.kind === 'theme' ? settings.pickRadius : settings.pickRadius * .65;
        const weighted = distance - (node.kind === 'theme' ? 4 : 0);
        if (distance <= limit && weighted < best) { closest = node; best = weighted; }
      }
      return closest;
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function draw(now) {
      frame = 0;
      if (!width || !height) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.fillStyle = 'rgba(177,199,229,' + (.07 + star.size * .21) + ')';
        ctx.fillRect(star.x * width, star.y * height, .65 + star.size, .65 + star.size);
      }
      const dim = Boolean(query || selected || hover);
      const zoomRatio = transform.k / home.k;
      const pulse = selected && selectionAt ? Math.max(0, 1 - (now - selectionAt) / 380) : 0;
      const screen = new Map(visible.map(node => [node.key, { x: transform.applyX(node.x), y: transform.applyY(node.y) }]));
      const lit = node => members.has(node.key) || matched.has(node.key) || node.key === hover;
      const tier = edge => edge.source === selected || edge.target === selected || (hover && edge.source === hover)
        ? 2 : query && matched.has(edge.target) ? 3 : dim ? 1 : 0;
      for (const index of [1, 0, 3, 2]) {
        ctx.beginPath();
        for (const edge of edges) {
          if (tier(edge) !== index) continue;
          const a = screen.get(edge.source);
          const b = screen.get(edge.target);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.strokeStyle = palette.lines[index];
        ctx.lineWidth = index >= 2 ? .9 : .72;
        ctx.stroke();
      }
      const labels = [];
      const font = '500 12px system-ui, "Malgun Gothic", sans-serif';
      ctx.font = font;
      for (const node of visible) {
        const { x, y } = screen.get(node.key);
        if (x < -30 || y < -30 || x > width + 30 || y > height + 30) continue;
        const hub = node.kind === 'theme';
        const chosen = node.key === selected;
        const strong = lit(node);
        const radius = hub ? Math.min(7, 3.1 + Math.sqrt(node.members.length) * .27) : 1.25 + node.depth * 1.05;
        const opacity = !dim || strong ? hub ? .95 : .59 + node.depth * .36 : hub ? .30 : .26;
        ctx.globalAlpha = opacity;
        if (hub || chosen || (strong && (query || members.size < 36 || zoomRatio > 1.65))) {
          const aura = ctx.createRadialGradient(x, y, 0, x, y, chosen ? 37 : hub ? 21 : 8);
          aura.addColorStop(0, chosen ? 'rgba(168,239,255,.63)' : 'rgba(67,204,244,.54)');
          aura.addColorStop(.34, 'rgba(50,173,240,.14)');
          aura.addColorStop(1, 'rgba(31,97,183,0)');
          ctx.fillStyle = aura;
          const r = chosen ? 37 : hub ? 21 : 8;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
        ctx.fillStyle = chosen ? palette.selected : hub ? palette.hub : palette.record;
        ctx.beginPath();
        ctx.arc(x, y, chosen ? radius + 1.7 : radius, 0, Math.PI * 2);
        ctx.fill();
        if (chosen) {
          ctx.beginPath();
          ctx.arc(x, y, 15 + pulse * 7, 0, Math.PI * 2);
          ctx.moveTo(x + 22 + pulse * 11, y);
          ctx.arc(x, y, 22 + pulse * 11, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(137,225,255,' + (.48 + pulse * .27) + ')';
          ctx.lineWidth = .8;
          ctx.stroke();
        }
        if (chosen || node.key === hover || (hub && !active && !dim) || (hub && query && strong)
          || (!hub && zoomRatio >= 1.95 && (!dim || strong))) {
          labels.push({ node, x, y, priority: chosen ? 10000 : node.key === hover ? 9000 : node.members?.length || node.depth || 0 });
        }
      }
      ctx.globalAlpha = 1;
      const boxes = [];
      const labelLimit = (width >= settings.desktop ? 12 : 5) + (zoomRatio >= 1.95 ? 8 : 0);
      for (const { node, x, y, priority } of labels.sort((a, b) => b.priority - a.priority)) {
        if (boxes.length >= labelLimit) break;
        const maxChars = width >= settings.desktop ? 25 : 14;
        const chars = Array.from(node.label);
        const text = chars.length > maxChars ? chars.slice(0, maxChars).join('') + '…' : node.label;
        const w = Math.ceil(ctx.measureText(text).width) + 12;
        const box = { x: Math.max(5, Math.min(x + 10, width - w - 5)), y: Math.max(24, y - 24), w, h: 21 };
        if (box.y + box.h > height - 7 || boxes.some(other => inside(other, box))) continue;
        if (width >= settings.desktop && box.x + box.w > width * .785 && priority < 9000) continue;
        ctx.fillStyle = priority >= 9000 ? 'rgba(10,36,53,.96)' : 'rgba(7,22,38,.89)';
        ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.fillStyle = priority >= 9000 ? '#f1fbff' : '#c5dbe9';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, box.x + 6, box.y + box.h / 2);
        boxes.push(box);
      }
      if (pulse > 0 && !reducedMotion.matches) requestDraw();
    }

    function point(event) {
      const box = canvas.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    }

    canvas.addEventListener('pointerdown', event => { started = point(event); });
    canvas.addEventListener('pointermove', event => {
      if (event.buttons || event.pointerType === 'touch') return;
      const p = point(event);
      const hit = pick(p.x, p.y);
      if ((hit?.key || null) !== hover) {
        hover = hit?.key || null;
        canvas.dataset.hit = hit ? 'true' : 'false';
        requestDraw();
      }
    });
    canvas.addEventListener('pointerleave', () => { hover = null; requestDraw(); });
    canvas.addEventListener('pointercancel', () => { started = null; });
    canvas.addEventListener('pointerup', event => {
      if (!started) return;
      const p = point(event);
      const tap = Math.hypot(p.x - started.x, p.y - started.y) < 6;
      started = null;
      if (tap) {
        const hit = pick(p.x, p.y);
        if (hit) onSelect(hit.key, false);
      }
    });

    function setState(state, results, saved, focus, reset) {
      const groupChanged = active !== state.group;
      active = state.group;
      if (selected !== state.selected) selectionAt = reducedMotion.matches ? 0 : performance.now();
      selected = state.selected;
      query = Boolean(state.query.trim());
      matched = query ? new Set(results.nodes.map(node => node.key)) : new Set();
      const node = positions.get(selected);
      const hub = node?.kind === 'theme' ? node : positions.get(node?.group);
      members = new Set(node ? [node.key, ...(node.kind === 'theme' ? node.members.map(item => item.key) : hub ? [hub.key] : [])] : []);
      visible = active ? [positions.get(active), ...positions.get(active).members.map(item => positions.get(item.key))] : [...positions.values()];
      edges = active ? model.edges.filter(edge => edge.source === active) : model.edges;
      if (groupChanged || saved || reset || !width) {
        resize();
        fit(saved);
      }
      if (focus && node && !saved) {
        const scale = Math.max(transform.k, home.k * (width < settings.desktop ? 1.24 : 1.12));
        applyTransform(d3.zoomIdentity.translate(centerX - node.x * scale, centerY - node.y * scale).scale(scale));
      }
      requestDraw();
    }

    function zoomBy(action) {
      if (action === 'fit') applyTransform(home);
      else surface.call(zoom.scaleBy, action === 'in' ? 1.28 : 1 / 1.28, [centerX, centerY]);
      onView(snapshot());
    }

    function pan(x, y) {
      surface.call(zoom.translateBy, x / transform.k, y / transform.k);
      onView(snapshot());
    }
    return { setState, snapshot, zoomBy, pan };
  }

  window.HomeExperienceCanvas = { createCanvas };
})();
