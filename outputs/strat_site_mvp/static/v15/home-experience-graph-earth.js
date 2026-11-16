/* Reuses the existing Three.js globe, NASA texture, drag and camera controls. */
(function () {
  'use strict';
  window.HomeExperienceEarth = function (host) {
    const T = window.THREE;
    let renderer, scene, camera, globe, drag, distance = 3.4, rotation = -1.4;
    const fallback = host.querySelector('.xn-earth-sphere');
    function draw() {
      host.dataset.rotation = rotation.toFixed(3);
      host.dataset.distance = distance.toFixed(2);
      fallback.style.backgroundPositionX = (50 + rotation * 45) + '%';
      fallback.style.transform = 'scale(' + (3.4 / distance) + ')';
      if (!renderer || !host.clientWidth || !host.clientHeight) return;
      renderer.setSize(host.clientWidth, host.clientHeight, false);
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.position.set(0, .1, distance);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
      globe.rotation.y = rotation;
      renderer.render(scene, camera);
    }
    function rotate(dx, dy = 0) {
      rotation += dx;
      if (globe) globe.rotation.x = Math.max(-1, Math.min(1, globe.rotation.x + dy));
      draw();
    }
    host.parentElement.querySelector('.xn-earth-controls').addEventListener('click', event => {
      const action = event.target.closest('[data-earth-camera]')?.dataset.earthCamera;
      if (!action) return;
      if (action === 'left' || action === 'right') rotate(action === 'left' ? -.32 : .32);
      else { distance = Math.max(2.4, Math.min(5.5, distance + (action === 'in' ? -.4 : .4))); draw(); }
    });
    host.addEventListener('pointerdown', event => { drag = { x: event.clientX, y: event.clientY }; host.setPointerCapture(event.pointerId); });
    host.addEventListener('pointermove', event => {
      if (!drag) return;
      rotate((event.clientX - drag.x) * .008, (event.clientY - drag.y) * .005);
      drag = { x: event.clientX, y: event.clientY };
    });
    for (const name of ['pointerup', 'pointercancel']) host.addEventListener(name, () => { drag = null; });
    try {
      if (!T) throw new Error('Three.js unavailable');
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setClearColor(0x030b14, 0);
      renderer.domElement.setAttribute('aria-label', '드래그로 회전하는 지구');
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.hidden = true;
      host.append(renderer.domElement);
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(42, 1, .05, 1000);
      scene.add(new T.AmbientLight(0x8baac9, .65));
      const light = new T.DirectionalLight(0xe9f5ff, 1.1);
      light.position.set(-30, 35, 65); scene.add(light);
      const material = new T.MeshPhongMaterial({ color: 0xffffff, shininess: 14 });
      globe = new T.Mesh(new T.SphereGeometry(.92, 48, 32), material); scene.add(globe);
      globe.add(new T.Mesh(new T.SphereGeometry(.947, 48, 32), new T.MeshBasicMaterial({ color: 0x5ca9db, transparent: true, opacity: .16, side: T.BackSide })));
      new T.TextureLoader().load('media/earth/nasa-blue-marble-2048.jpg', texture => {
        if (T.SRGBColorSpace) texture.colorSpace = T.SRGBColorSpace;
        material.map = texture; material.needsUpdate = true;
        renderer.domElement.hidden = false; fallback.hidden = true; host.dataset.renderer = 'three-webgl'; draw();
      }, undefined, () => { host.dataset.renderer = 'image-fallback'; });
      renderer.domElement.addEventListener('webglcontextlost', event => {
        event.preventDefault(); renderer.domElement.hidden = true; fallback.hidden = false; host.dataset.renderer = 'image-fallback';
      });
    } catch (error) {
      renderer?.dispose(); renderer = null; host.dataset.renderer = 'image-fallback';
    }
    new ResizeObserver(draw).observe(host);
    draw();
    return { draw };
  };
})();
