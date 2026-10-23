
(()=>{'use strict';
 const $=s=>document.querySelector(s),hero=$('.r3-hero'),panel=$('#r3-selection'),status=$('#r3-status');
 const payload=JSON.parse($('#experience-data').textContent),records=window.AtlasCore.normalize(payload.records),byId=new Map(records.map(r=>[r.id,r]));
 const topics=[
 {id:'strategy',name:'중장기 전략·시나리오',f:'전략',x:50,y:13},
 {id:'portfolio',name:'사업 포트폴리오',theme:'신사업·포트폴리오',x:81,y:31},
 {id:'organization',name:'조직·적정인력',f:'조직',x:82,y:68},
 {id:'job',name:'직무·인사·보수',f:'인사',x:50,y:89},
 {id:'performance',name:'성과관리',f:'성과관리',x:18,y:68},
 {id:'ax',name:'AI·AX',x:19,y:31}];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const kinds={certificate_record:'실적증명 자료',profile_phrase:'회사소개 자료',legacy_record:'기존 보유 자료',public_source_record:'공개 출처 자료',source_occurrence_group:'원본 이력 자료'};
 topics.forEach(t=>{t.records=t.f?records.filter(r=>r.profileTheme===t.f):t.theme?records.filter(r=>r.theme===t.theme):[];});
 hero.dataset.sourceRecords=records.length;hero.dataset.overviewRecords='0';hero.dataset.institutionEdges='0';hero.dataset.visibleRecords='0';
 topics.forEach((t,i)=>{t.rx=[310,240,272,225,296,265][i];const dx=t.x*6.4-320,dy=t.y*5.4-270;t.ry=Math.abs(dy)/Math.sqrt(1-(dx/t.rx)**2);});
 const svg=$('.r3-orbits');svg.innerHTML=topics.map(t=>`<ellipse data-orbit="${t.id}" cx="320" cy="270" rx="${t.rx}" ry="${t.ry}"/>`).join('')+topics.map(t=>`<line x1="320" y1="270" x2="${t.x*6.4}" y2="${t.y*5.4}"/>`).join('');
 $('#r3-topics').innerHTML=topics.map(t=>`<button type="button" class="r3-topic" style="--x:${t.x}%;--y:${t.y}%" data-topic="${t.id}" aria-pressed="false" aria-controls="r3-selection"><span class="r3-planet" aria-hidden="true"></span><b>${t.name}</b><small>${t.id==='ax'?'방법 · 적용조건':`연결 자료 ${t.records.length}건`}</small></button>`).join('');
 let active=null;const mobile=window.matchMedia('(max-width:700px)');
 function rememberTopic(topic){const url=new URL(location.href);if(topic)url.searchParams.set('topic',topic);else url.searchParams.delete('topic');if(url.href!==location.href)history.pushState(null,'',url.pathname+url.search+url.hash);}
 function restoreTopic(){const t=topics.find(t=>t.id===new URL(location.href).searchParams.get('topic'));if(t)render(t);else reset();}
 function reset(){active=null;panel.hidden=true;panel.replaceChildren();hero.dataset.visibleRecords='0';hero.dataset.selectedTopic='';status.textContent='주제를 선택하면 연결 자료가 펼쳐집니다.';document.querySelectorAll('.r3-topic').forEach(b=>b.setAttribute('aria-pressed','false'));}
 function render(t){active=t;panel.hidden=false;panel.classList.remove('r3-large');hero.dataset.selectedTopic=t.id;
 document.querySelectorAll('.r3-topic').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===t.id)));
 const shown=t.records.slice(0,mobile.matches?2:4),basis=t.f?`기존 기능 분류: ${t.f}`:`원문 주제: ${t.theme}`;hero.dataset.visibleRecords=shown.length;
 status.textContent=t.id==='ax'?'AI·AX · 방법과 적용조건 연결':`${t.name} · ${t.records.length}자료 중 ${shown.length}개 표시`;
 const href=t.f?'atlas.html?view=list&profileTheme='+encodeURIComponent(t.f):'atlas.html?view=list&q='+encodeURIComponent(t.theme||'');
 const head=`<nav class="r3-explain" aria-label="탐색 경로"><a href="index.html">전체 시야</a> → <span aria-current="page">${t.name} 태양계</span> → 자료 상세</nav><div class="r3-selection-head"><div><h2>${t.name}</h2><p class="r3-explain">${t.id==='ax'?'AI 적용을 위한 업무 목적·자료·권한과 운영 조건을 검토합니다. 수행 자료 연결은 미확인입니다.':`연결 자료 ${t.records.length}건 중 일부입니다. 기존 원장 순서이며 우수 실적의 순위가 아닙니다.`}</p></div>${shown.length?'<button class="r3-reading" type="button" aria-pressed="false">글자 확대</button>':''}</div>`;
 let shared='';
 for(let i=0;i<shown.length&&!shared;i++)for(let j=i+1;j<shown.length;j++)if(shown[i].theme&&shown[i].theme===shown[j].theme&&!/미확인|미분류/.test(shown[i].theme)){shared=`<p class="r3-shared" data-edge-from="${esc(shown[i].id)}" data-edge-to="${esc(shown[j].id)}"><svg class="r3-extra-edge" viewBox="0 0 1000 25" preserveAspectRatio="none" aria-hidden="true"><path d="M${(i+.5)*1000/shown.length} 0 V15 H${(j+.5)*1000/shown.length} V0"/></svg><i aria-hidden="true"></i>자료 ${i+1} ↔ ${j+1} · 공통 원문 주제: ${esc(shown[i].theme)}<br>같은 계약이나 성과의 인과관계를 뜻하지 않습니다.</p>`;break;}
 const n=shown.length;
 panel.innerHTML=head+(n?`<div class="r3-record-map"><span class="r3-root-label">${t.name} · 자료 연결</span><svg class="r3-record-links" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">${shown.map((r,i)=>`<path d="M500 22 L${(i+.5)*1000/n} 60"/>`).join('')}</svg><div class="r3-records">${shown.map((r,i)=>`<a class="r3-record" data-record="${esc(r.id)}" href="atlas.html?view=list&record=${encodeURIComponent(r.id)}"><span class="r3-kind">${i+1} · ${esc(kinds[r.recordKind]||r.sourceType||'출처 자료')}</span><h3>${esc(r.title)}</h3><span class="r3-basis">${esc(basis)}</span><span class="r3-detail">자료 상세 보기 ↗</span></a>`).join('')}</div></div>${shared}`:'')+`<div class="r3-selection-links"><a href="approach.html#framework-${t.id}">분석 방법과 적용조건 ↗</a>${n?`<a href="${href}">연결 자료 ${t.records.length}건 모두 보기 →</a>`:''}</div>`;
 panel.querySelector('.r3-reading')?.addEventListener('click',e=>{const large=panel.classList.toggle('r3-large');e.currentTarget.setAttribute('aria-pressed',String(large));e.currentTarget.textContent=large?'기본 글자':'글자 확대';});
 }
 $('#r3-topics').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(!b)return;rememberTopic(b.dataset.topic);render(topics.find(t=>t.id===b.dataset.topic));panel.scrollIntoView({behavior:'smooth',block:'nearest'});});
 $('#r3-reset').addEventListener('click',()=>{rememberTopic(null);reset();hero.scrollIntoView({behavior:'smooth',block:'start'});});mobile.addEventListener('change',()=>{if(active)render(active);});
 window.addEventListener('popstate',restoreTopic);restoreTopic();
})();
