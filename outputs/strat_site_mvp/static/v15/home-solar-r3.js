/* One scene, three camera distances. Source records are never geographic points. */
(()=>{'use strict';
 const $=s=>document.querySelector(s),hero=$('.r3-hero'),map=$('.r3-map'),panel=$('#r3-selection'),status=$('#r3-status');
 if(!hero||!map)return;
 const records=window.AtlasCore.normalize(JSON.parse($('#experience-data').textContent).records);
 const topics=[{id:'strategy',name:'중장기 전략·시나리오',f:'전략',x:50,y:13},{id:'portfolio',name:'사업 포트폴리오',theme:'신사업·포트폴리오',x:81,y:31},{id:'organization',name:'조직·적정인력',f:'조직',x:82,y:68},{id:'job',name:'직무·인사·보수',f:'인사',x:50,y:89},{id:'performance',name:'성과관리',f:'성과관리',x:18,y:68},{id:'ax',name:'AI·AX',x:19,y:31}];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const mobile=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 topics.forEach(t=>{t.records=t.f?records.filter(r=>r.profileTheme===t.f):t.theme?records.filter(r=>r.theme===t.theme):[];t.p=[(t.x-50)*.88,(50-t.y)*.66,0];});
 hero.dataset.sourceRecords=records.length;hero.dataset.overviewRecords='0';hero.dataset.institutionEdges='0';hero.dataset.visibleRecords='0';
 let level='universe',active=null,renderer,scene,camera,models=[],targetLook,animation=0,earthDistance=3.4,drag=null,atmosphere=null,motionEnabled=!reduced.matches;
 const trail=document.createElement('nav');trail.className='r4-trail';trail.setAttribute('aria-label','공간 탐색 단계');
 trail.innerHTML='<button type="button" data-level="universe">01 우주</button><span>›</span><button type="button" data-level="solar" disabled>02 태양계</button><span>›</span><button type="button" data-level="earth" disabled>03 지구</button>';
 map.parentElement.prepend(trail);
 const sceneHost=document.createElement('div');sceneHost.className='r4-scene';map.prepend(sceneHost);
 const caption=document.createElement('div');caption.className='r4-caption';map.append(caption);
 const enter=document.createElement('button');enter.type='button';enter.className='r4-enter-earth';enter.textContent='지구로 확대 ↗';enter.hidden=true;map.append(enter);
 const controls=document.createElement('div');controls.className='r4-globe-controls';controls.hidden=true;
 controls.innerHTML='<button type="button" data-camera="in" aria-label="지구 더 확대">＋</button><button type="button" data-camera="out" aria-label="지구 덜 확대">−</button><button type="button" data-camera="left" aria-label="지구 왼쪽 회전">↶</button><button type="button" data-camera="right" aria-label="지구 오른쪽 회전">↷</button>';
 map.append(controls);
 const back=document.createElement('button');back.type='button';back.id='r4-back';back.textContent='← 한 단계 축소';back.disabled=true;$('#r3-reset').before(back);
 const motion=document.createElement('button');motion.type='button';motion.id='r4-motion';motion.textContent=motionEnabled?'이동 모션 끄기':'이동 모션 켜기';motion.setAttribute('aria-pressed',String(motionEnabled));$('#r3-reset').before(motion);
 motion.addEventListener('click',()=>{motionEnabled=!motionEnabled;motion.textContent=motionEnabled?'이동 모션 끄기':'이동 모션 켜기';motion.setAttribute('aria-pressed',String(motionEnabled));hero.dataset.motionEnabled=String(motionEnabled);});
 $('#r3-topics').innerHTML=topics.map(t=>`<button type="button" class="r3-topic" style="--x:${t.x}%;--y:${t.y}%" data-topic="${t.id}" aria-pressed="false"><span class="r3-planet" aria-hidden="true"></span><b>${t.name}</b><small>${t.id==='ax'?'방법 · 적용조건':`연결 자료 ${t.records.length}건`}</small></button>`).join('');

 function urlState(){const q=new URL(location.href).searchParams,t=topics.find(t=>t.id===q.get('topic'));return {t,l:t?(q.get('level')==='earth'?'earth':'solar'):'universe'};}
 function remember(l,t){const u=new URL(location.href);u.searchParams.delete('topic');u.searchParams.delete('level');if(t&&l!=='universe'){u.searchParams.set('topic',t.id);u.searchParams.set('level',l);}if(u.href!==location.href)history.pushState(null,'',u.pathname+u.search+u.hash);}
 function listHref(t){return t.f?'atlas.html?view=list&profileTheme='+encodeURIComponent(t.f):'atlas.html?view=list&q='+encodeURIComponent(t.theme||'');}
 function renderPanel(){
  if(!active){panel.hidden=true;panel.replaceChildren();hero.dataset.visibleRecords='0';return;}
  panel.hidden=false;const t=active,earth=level==='earth',shown=earth?t.records.slice(0,mobile.matches?2:4):[];
  hero.dataset.visibleRecords=shown.length;
  panel.innerHTML=`<div class="r3-selection-head"><div><p class="r4-level-tag">${earth?'03 · EARTH':'02 · SOLAR SYSTEM'}</p><h2>${earth?'지구에서 살펴보는 ':''}${t.name}</h2><p class="r3-explain">${t.id==='ax'?'AI·AX는 업무와 운영 여건에 맞춰 적용 가능성을 검토합니다. 분석 방법과 상담 안내를 살펴보십시오.':earth?`관련 경험 ${t.records.length}건을 살펴보십시오. 관심 있는 과업을 선택하면 상세와 수행 주체를 확인할 수 있습니다.`:`${t.name} 태양계입니다. 궤도 위 지구를 선택하면 같은 공간 안에서 지구까지 확대합니다.`}</p></div></div>`+
   (earth&&shown.length?`<div class="r3-records">${shown.map(r=>`<a class="r3-record" data-record="${esc(r.id)}" href="atlas.html?view=list&record=${encodeURIComponent(r.id)}"><span class="r3-kind">${esc(r.layer||'경험 자료')}</span><h3>${esc(r.title)}</h3><span class="r3-basis">${esc(t.f?'전문 분야: '+t.f:'과업 주제: '+t.theme)}</span><span class="r3-detail">과업 상세 보기 ↗</span></a>`).join('')}</div>`:'')+
   `<div class="r3-selection-links">${!earth?'<button type="button" data-earth-open class="r3-reading">지구로 확대 →</button>':''}<a href="approach.html#framework-${t.id}">분석 방법과 적용조건 ↗</a>${earth&&['strategy','ax','performance','organization'].includes(t.id)?`<a data-industrial-report href="report-strategy-ax-performance.html?topic=${t.id}">전략·AX·성과관리 분석 리포트 읽기 ↗</a>`:''}${t.records.length?`<a href="${listHref(t)}">연결 자료 ${t.records.length}건 모두 보기 →</a>`:''}</div>`;
  panel.querySelector('[data-earth-open]')?.addEventListener('click',()=>go('earth',t,true));
 }
 function updateUI(){
  hero.dataset.level=level;hero.dataset.selectedTopic=active?.id||'';back.disabled=level==='universe';
  trail.querySelectorAll('button').forEach(b=>{b.disabled=b.dataset.level!=='universe'&&!active;b.setAttribute('aria-current',String(b.dataset.level===level?'step':'false'));});
  document.querySelectorAll('.r3-topic').forEach(b=>{b.hidden=level!=='universe';b.setAttribute('aria-pressed',String(b.dataset.topic===active?.id));});
  $('.r3-center').hidden=level!=='universe';enter.hidden=level!=='solar';controls.hidden=level!=='earth';
  caption.innerHTML=level==='universe'?'<small>UNIVERSE / 01</small><strong>주제를 선택해 가까이 들어갑니다.</strong>':`<small>${level==='earth'?'EARTH / 03':'SOLAR SYSTEM / 02'}</small><strong>${esc(active.name)}${level==='earth'?' · 지구':' 태양계'}</strong><span>${level==='earth'?'드래그·회전 버튼으로 지구를 돌려보십시오.':'궤도 위 지구를 선택해 확대하십시오.'}</span>`;
  status.textContent=level==='universe'?'우주 · 여섯 주제에서 탐색 시작':level==='solar'?`${active.name} 태양계 · 지구로 확대 가능`:`${active.name} · 지구 근접 시야`;
  renderPanel();
 }
 function cameraDestination(l,t){
  const T=window.THREE;if(l==='universe')return {p:new T.Vector3(0,0,Math.max(102,108/(Number.isFinite(camera.aspect)&&camera.aspect>0?camera.aspect:1))),look:new T.Vector3(0,0,0)};
  const m=models.find(m=>m.id===t.id),center=m.group.position.clone();
  if(l==='solar'){if(mobile.matches)center.x+=2.5;return {p:center.clone().add(new T.Vector3(0,1,mobile.matches?34:27)),look:center};}
  const earth=center.add(m.earth.position);return {p:earth.clone().add(new T.Vector3(0,.1,earthDistance)),look:earth};
 }
 function project(v){return v.clone().project(camera);}
 function renderFrame(){
  if(!renderer)return;if(atmosphere)atmosphere.group.visible=level==='universe';models.forEach(m=>{m.group.visible=level==='universe'||m.id===active?.id;});
  renderer.render(scene,camera);
  if(level==='universe')topics.forEach(t=>{const p=project(new window.THREE.Vector3(...t.p));const b=$(`[data-topic="${t.id}"]`);b.style.left=Math.max(mobile.matches?22:10,Math.min(mobile.matches?78:90,(p.x+1)*50))+'%';b.style.top=((1-p.y)*50+6)+'%';});
  if(active&&level==='solar'){const m=models.find(m=>m.id===active.id),p=project(m.group.position.clone().add(m.earth.position));enter.style.left=Math.max(22,Math.min(mobile.matches?74:85,(p.x+1)*50))+'%';enter.style.top=((1-p.y)*50+10)+'%';}
  hero.dataset.cameraPosition=[camera.position.x,camera.position.y,camera.position.z].map(v=>v.toFixed(3)).join(',');
  hero.dataset.cameraTarget=[targetLook.x,targetLook.y,targetLook.z].map(v=>v.toFixed(3)).join(',');
 }
 function travel(destination,animate){
  cancelAnimationFrame(animation);animation=0;
  const finite=v=>[v.x,v.y,v.z].every(Number.isFinite);
  if(!finite(destination.p)||!finite(destination.look)){hero.dataset.transitioning='false';hero.dataset.transitionFrames='0';hero.dataset.transitionElapsed='0';hero.dataset.cameraError='nonfinite-destination';status.textContent='3D 시야 좌표를 확인할 수 없습니다. 한 단계 축소 또는 새로고침을 이용해 주십시오.';return;}
  delete hero.dataset.cameraError;
  if(!finite(camera.position)||!finite(targetLook)){camera.position.copy(destination.p);targetLook.copy(destination.look);animate=false;}
  const from=camera.position.clone(),lookFrom=targetLook.clone(),start=performance.now(),duration=animate&&motionEnabled?1100:0;
  hero.dataset.transitioning=String(duration>0);let frames=0;
  function step(now){frames++;const progress=duration?Math.min(1,(now-start)/duration):1,ease=progress<.5?4*progress**3:1-(-2*progress+2)**3/2;
   camera.position.lerpVectors(from,destination.p,ease);targetLook.lerpVectors(lookFrom,destination.look,ease);camera.lookAt(targetLook);renderFrame();
   if(progress<1)animation=requestAnimationFrame(step);else{hero.dataset.transitioning='false';hero.dataset.transitionFrames=String(frames);hero.dataset.transitionElapsed=Math.max(0,now-start).toFixed(1);sceneHost.dispatchEvent(new Event('zoomsettled'));}
  }animation=requestAnimationFrame(step);
 }
 function go(l,t,save=false,animate=true){
  if(l!=='universe'&&!t)return;if(!renderer&&l==='earth'){status.textContent='이 환경에서는 3D 지구 확대를 사용할 수 없습니다. 전체 자료 목록을 이용해 주십시오.';return;}if(save)remember(l,t);level=l;active=l==='universe'?null:t;earthDistance=mobile.matches?4.5:3.4;updateUI();
  if(renderer)travel(cameraDestination(l,t),animate);
  if(save)map.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'nearest'});
 }
 function restore(animate=false){const s=urlState();go(s.l,s.t,false,animate);}
 function init3D(){
  const T=window.THREE;if(!T)throw new Error('Three.js unavailable');
  renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.setClearColor(0x030b14,0);renderer.domElement.setAttribute('aria-label','우주·태양계·지구 3D 확대 장면');renderer.domElement.setAttribute('role','img');sceneHost.append(renderer.domElement);
  scene=new T.Scene();camera=new T.PerspectiveCamera(42,1,.05,1000);camera.position.set(0,0,102);targetLook=new T.Vector3();
  scene.add(new T.AmbientLight(0x8baac9,.45));const light=new T.DirectionalLight(0xe9f5ff,1.1);light.position.set(-30,35,65);scene.add(light);
  const earthMaterial=new T.MeshPhongMaterial({color:0xffffff,shininess:14});
  new T.TextureLoader().load('media/earth/nasa-blue-marble-2048.jpg',texture=>{if(T.SRGBColorSpace)texture.colorSpace=T.SRGBColorSpace;earthMaterial.map=texture;earthMaterial.needsUpdate=true;hero.dataset.earthTexture='loaded';renderFrame();},undefined,()=>{hero.dataset.earthTexture='failed';status.textContent='지구 표면 이미지를 불러오지 못했습니다. 확대·복귀는 사용할 수 있습니다.';});
  const orbitMaterial=new T.LineBasicMaterial({color:0x7396ad,transparent:true,opacity:.36});
  topics.forEach((t,i)=>{
   const group=new T.Group();group.position.set(...t.p);
   const sun=new T.Mesh(new T.SphereGeometry(1.65,32,24),new T.MeshBasicMaterial({color:i%2?0xd6b98a:0xb6d8ed}));group.add(sun);
   const earth=new T.Mesh(new T.SphereGeometry(.92,48,32),earthMaterial);earth.position.set(7.3,-.5,1.6);earth.rotation.y=-1.4;group.add(earth);
   const atmosphere=new T.Mesh(new T.SphereGeometry(.947,48,32),new T.MeshBasicMaterial({color:0x5ca9db,transparent:true,opacity:.16,side:T.BackSide}));earth.add(atmosphere);
   [4.1,7.4,10].forEach(radius=>{const pts=[];for(let n=0;n<=100;n++){const a=n/100*Math.PI*2;pts.push(new T.Vector3(Math.cos(a)*radius,Math.sin(a)*radius*.56,0));}group.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),orbitMaterial));});
   [[-4,0,0,.34],[-7,-3,0,.53],[3.5,5.1,-1,.47]].forEach(([x,y,z,r],j)=>{const sphere=new T.Mesh(new T.SphereGeometry(r,20,16),new T.MeshPhongMaterial({color:[0xbfb2a0,0x617e99,0xa99781][j]}));sphere.position.set(x,y,z);group.add(sphere);});
   scene.add(group);models.push({id:t.id,group,earth,sun});
  });
  if(window.StratDenseAtmosphere){try{atmosphere=window.StratDenseAtmosphere(T,hero);scene.add(atmosphere.group);hero.dataset.denseAtmosphere='ready';}catch(error){hero.dataset.denseAtmosphere='unavailable';}}
  hero.dataset.renderer='three-webgl';map.classList.add('r4-ready');
  function resize(){atmosphere?.resize();const w=map.clientWidth,h=map.clientHeight;if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();renderFrame();}
  new ResizeObserver(resize).observe(map);resize();restore();
  renderer.domElement.addEventListener('pointerdown',e=>{if(level==='solar'){const rect=renderer.domElement.getBoundingClientRect(),pointer=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();ray.setFromCamera(pointer,camera);if(ray.intersectObject(models.find(m=>m.id===active.id).earth).length)go('earth',active,true);return;}if(level!=='earth')return;drag={x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointermove',e=>{if(!drag||level!=='earth')return;const m=models.find(m=>m.id===active.id);m.earth.rotation.y+=(e.clientX-drag.x)*.008;m.earth.rotation.x=Math.max(-1,Math.min(1,m.earth.rotation.x+(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};hero.dataset.earthRotation=m.earth.rotation.y.toFixed(3);renderFrame();});
  const stop=()=>{drag=null;};renderer.domElement.addEventListener('pointerup',stop);renderer.domElement.addEventListener('pointercancel',stop);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();hero.dataset.renderer='context-lost';status.textContent='3D 화면 연결이 끊겼습니다. 전체 자료 목록은 계속 이용할 수 있습니다.';});
 }
 $('#r3-topics').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(b)go('solar',topics.find(t=>t.id===b.dataset.topic),true);});
 enter.addEventListener('click',()=>go('earth',active,true));
 back.addEventListener('click',()=>go(level==='earth'?'solar':'universe',active,true));
 $('#r3-reset').addEventListener('click',()=>go('universe',null,true));
 trail.addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b&&!b.disabled)go(b.dataset.level,active,true);});
 controls.addEventListener('click',e=>{const b=e.target.closest('[data-camera]');if(!b||!renderer)return;const action=b.dataset.camera,m=models.find(m=>m.id===active.id);
  if(action==='left'||action==='right'){m.earth.rotation.y+=action==='left'?-.32:.32;hero.dataset.earthRotation=m.earth.rotation.y.toFixed(3);renderFrame();}
  else{earthDistance=Math.max(2.4,Math.min(5.5,earthDistance+(action==='in'?-.4:.4)));travel(cameraDestination('earth',active),true);}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&level!=='universe'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();go(level==='earth'?'solar':'universe',active,true);}});
 mobile.addEventListener('change',()=>{if(renderer)go(level,active,false,false);else renderPanel();});window.addEventListener('popstate',()=>restore(true));
 const credit=document.createElement('p');credit.className='r4-credit';credit.innerHTML='지구 표면: <a href="https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/" target="_blank" rel="noopener">NASA Blue Marble</a> · 천체는 탐색을 위한 표현이며 실적의 지리적 분포가 아닙니다.';map.parentElement.append(credit);
 try{init3D();}catch(error){renderer?.dispose();renderer=null;hero.dataset.renderer='unavailable';sceneHost.hidden=true;restore();enter.hidden=true;controls.hidden=true;status.textContent='이 환경에서는 3D 확대를 사용할 수 없습니다. 주제별 목록과 전체 자료 검색을 이용해 주십시오.';}
})();
