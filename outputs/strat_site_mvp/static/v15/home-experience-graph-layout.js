(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HomeExperienceLayout = factory();
})(globalThis, function () {
  'use strict';
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const config = {
    hubSpace: 560, flatten: .56, groupDensity: 13, groupSpacing: 7,
    hubTicks: 86, recordTicks: 112, linkPadding: 14
  };

  function hash(value) {
    let seed = 2166136261;
    for (let i = 0; i < value.length; i++) seed = Math.imul(seed ^ value.charCodeAt(i), 16777619);
    return seed >>> 0;
  }
  const unit = value => hash(value) / 4294967296;

  function layoutGraph(model, d3) {
    if (!model.nodes.length) return [];
    const hubs = model.hubs.map(node => ({
      ...node, radius: Math.max(24, config.groupDensity * Math.sqrt(node.members.length))
    })).sort((a, b) => b.members.length - a.members.length || a.key.localeCompare(b.key));
    hubs.forEach((hub, index) => {
      const angle = index * goldenAngle + .36;
      const orbit = config.hubSpace * Math.sqrt(index / Math.max(1, hubs.length - 1));
      hub.x = hub.anchorX = Math.cos(angle) * orbit;
      hub.y = hub.anchorY = Math.sin(angle) * orbit * config.flatten;
    });
    d3.forceSimulation(hubs).stop()
      .force('separation', d3.forceCollide(hub => hub.radius * .78 + config.groupSpacing).iterations(2))
      .force('x', d3.forceX(hub => hub.anchorX).strength(.08))
      .force('y', d3.forceY(hub => hub.anchorY).strength(.12))
      .tick(config.hubTicks);
    const byKey = new Map(hubs.map(hub => [hub.key, hub]));
    for (const hub of hubs) {
      hub.fx = hub.x;
      hub.fy = hub.y;
    }
    const records = model.entries.map(node => {
      const hub = byKey.get(node.group);
      const angle = unit(node.key + ':angle') * Math.PI * 2;
      const depth = unit(node.key + ':depth');
      const ring = (hub?.radius || config.hubSpace) * (.2 + .8 * Math.sqrt(depth));
      const dx = Math.cos(angle) * ring;
      const dy = Math.sin(angle) * ring * .83;
      const x = (hub?.x || 0) + dx;
      const y = (hub?.y || 0) + dy;
      return { ...node, x, y, anchorX: x, anchorY: y, depth, ring };
    });
    const nodes = [...hubs, ...records];
    const links = model.edges.map(edge => ({ ...edge }));
    d3.forceSimulation(nodes).stop()
      .force('membership', d3.forceLink(links).id(node => node.key)
        .distance(link => config.linkPadding + link.target.ring).strength(.17))
      .force('separation', d3.forceCollide(node => node.kind === 'theme' ? 10 : 3.6).iterations(2))
      .force('x', d3.forceX(node => node.anchorX).strength(.11))
      .force('y', d3.forceY(node => node.anchorY).strength(.11))
      .tick(config.recordTicks);
    return nodes;
  }

  return { layoutGraph, unit };
});
