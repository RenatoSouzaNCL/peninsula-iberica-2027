/* Via Singularis Travel · app de roteiro (PWA)
   Todo o conteúdo vem de roteiro.json. Para criar outra viagem, troque só esse arquivo. */
'use strict';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE_KEY = 'vs-roteiro-reservas';

let T = null;               // dados da viagem
const MES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const WD = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];

/* ---------- ícones (traço) ---------- */
const P = {
  plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  train:'<rect x="4" y="3" width="16" height="13" rx="3"/><path d="M4 11h16M12 3v8M8 19l-2 2M16 19l2 2M8 16h.01M16 16h.01"/>',
  bus:'<path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
  walk:'<circle cx="13" cy="4" r="2"/><path d="m7 21 3-6 2 2v4M10 15l1-5-3 1-2 3M11 10l3 3 3 1"/>',
  car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6H7.3a2 2 0 0 0-1.6.9L3 10.5 2.3 12A2 2 0 0 0 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  bed:'<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  bulb:'<path d="M9 18h6M10 22h4M15.1 14c.2-1 .7-1.7 1.4-2.5A5.5 5.5 0 0 0 12 2a5.5 5.5 0 0 0-4.5 9.5c.7.8 1.2 1.5 1.4 2.5"/>',
  alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  ext:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  food:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
};
const icon = (k, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[k] || P.arrow}</svg>`;

function stepIcon(name) {
  const n = name.toLowerCase();
  if (/voo|aeroporto/.test(n) && !/ônibus|metrô|uber/.test(n)) return 'plane';
  if (/uber|táxi|taxi/.test(n)) return 'car';
  if (/metrô|trem|comboio|avlo|ouigo|iryo/.test(n)) return 'train';
  if (/ônibus|flixbus|carris|moventis|alsa|bus/.test(n)) return 'bus';
  if (/a pé|caminhada/.test(n)) return 'walk';
  if (/restaurante|almoço|café/.test(n)) return 'food';
  return 'arrow';
}
const NOTE_ICON = {checkin:'bed', star:'star', night:'moon', tip:'bulb', alert:'alert', y2027:'alert', transport:'bus', walk:'walk', info:'info'};

/* ---------- datas ---------- */
const parse = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtShort = iso => { const d = parse(iso); return `${String(d.getDate()).padStart(2, '0')} ${MES[d.getMonth()]}`; };
const fmtNum = iso => { const d = parse(iso); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`; };
const wd = iso => WD[parse(iso).getDay()];
function todayISO() {
  const q = new URLSearchParams(location.search).get('hoje');   // teste: ?hoje=2027-06-05
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const trecho = id => T.trechos.find(t => t.id === id);
const todayDay = () => T.days.find(d => d.date === todayISO());

/* ---------- mapas ---------- */
const looksAddress = s => /\d|s\/n|^(r\.|rua|av\.|avenida|c\.|carrer|calle|pl\.|plaça|plaza|praça|pg\.|p\.º|largo|cta\.|ctra\.|camí|tv\.|estrada|calçada|escadinhas)/i.test(s || '');
function mapQuery(name, detail, city) {
  const addr = (detail || '').split(' · ').filter(looksAddress).filter(x => !/^\d+([,.]\d+)?\s?k?m\b/.test(x))[0];
  return [name, addr, city].filter(Boolean).join(', ');
}
const mapsURL = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const mapLink = (q, label = 'Mapa') => `<a class="maplink" href="${mapsURL(q)}" target="_blank" rel="noopener">${icon('pin')}${label}</a>`;
function routeURL(stops, city) {
  const pts = stops.map(s => mapQuery(s.name, s.detail, city));
  const u = new URL('https://www.google.com/maps/dir/');
  u.searchParams.set('api', '1');
  u.searchParams.set('origin', pts[0]);
  u.searchParams.set('destination', pts[pts.length - 1]);
  if (pts.length > 2) u.searchParams.set('waypoints', pts.slice(1, -1).slice(0, 8).join('|'));
  u.searchParams.set('travelmode', 'walking');
  return u.toString();
}

/* ---------- blocos do dia ---------- */
function renderBlock(b, day) {
  if (b.type === 'note') {
    const kind = b.kind || 'info';
    const isCheckin = kind === 'checkin';
    const extra = isCheckin ? `<div>${mapLink(b.title.split(' · ').slice(1).join(', ') + ', ' + day.mapCity, 'Ver no mapa')}</div>` : '';
    return `<div class="note ${kind}"><span class="ico">${icon(NOTE_ICON[kind] || 'info')}</span><div>
      ${b.label ? `<div class="lbl">${esc(b.label)}</div>` : ''}
      <div class="tt">${esc(b.title)}</div>${b.text ? `<div class="tx">${esc(b.text)}</div>` : ''}${extra}</div></div>`;
  }
  let inner = `<h3 class="sec-title">${esc(b.title)}</h3>`;
  if (b.intro) inner += `<div class="walk">${esc(b.intro)}</div>`;
  if (b.type === 'steps') {
    inner += b.items.map(it => `<div class="step"><span class="ico">${icon(stepIcon(it.name))}</span><div class="body">
      <div class="name">${esc(it.name)}</div>${it.detail ? `<div class="detail">${esc(it.detail)}</div>` : ''}
      ${it.time ? `<span class="time${it.pending ? ' pending' : ''}">${esc(it.time)}</span>` : ''}</div></div>`).join('');
  } else if (b.type === 'stops') {
    inner += '<ol class="stops">' + b.items.map((it, i) => `<li><span class="num">${i + 1}</span><div>
      <div class="name">${esc(it.name)}</div>${it.detail ? `<div class="detail">${esc(it.detail)}</div>` : ''}
      ${mapLink(mapQuery(it.name, it.detail, day.mapCity))}</div></li>`).join('') + '</ol>';
    if (b.items.length > 1) inner += `<a class="routebtn" href="${routeURL(b.items, day.mapCity)}" target="_blank" rel="noopener">${icon('route')}Abrir rota a pé no Google Maps</a>`;
  } else {
    inner += b.items.map(it => `<div class="place"><div class="name">${esc(it.name)}</div>
      ${it.detail ? `<div class="detail">${esc(it.detail)}</div>` : ''}${mapLink(mapQuery(it.name, it.detail, day.mapCity))}</div>`).join('');
  }
  return `<section class="card">${inner}</section>`;
}

/* ---------- telas ---------- */
function setAccent(c) { document.documentElement.style.setProperty('--accent', c || '#1D4E9E'); document.querySelector('meta[name=theme-color]').content = c || '#13223F'; }

function viewDay(n) {
  const day = T.days.find(d => d.n === n);
  if (!day) return viewHome();
  const tr = trecho(day.trecho);
  setAccent(tr.color);
  const prev = T.days[n - 2], next = T.days[n];
  const isToday = day.date === todayISO();
  document.title = `Dia ${n} · ${day.place}`;
  return `
  <header class="topbar"><div class="wrap"><a class="back" href="#/dias">‹ Dias</a><span class="t">Trecho ${String(tr.id).padStart(2,'0')} · ${esc(tr.name)}</span></div></header>
  <div class="dayhead"><div class="wrap">
    <div class="row"><div class="bignum">${parse(day.date).getDate()}</div>
      <div class="meta"><div class="dn">Dia ${String(n).padStart(2,'0')} de ${T.days.length}</div><div class="wd">${esc(MES[parse(day.date).getMonth()])} · ${esc(wd(day.date))}</div></div></div>
    <span class="pill">${esc(day.place)}</span>${isToday ? '<span class="today-badge">Hoje</span>' : ''}
    <h2>${esc(day.title)}</h2>
  </div></div>
  <div class="wrap"><div class="cards">${day.blocks.map(b => renderBlock(b, day)).join('')}</div>
    <nav class="pager" aria-label="Navegar entre dias">
      ${prev ? `<a href="#/dia/${prev.n}"><small>‹ Dia ${prev.n}</small><span>${esc(prev.place)}</span></a>` : '<span class="ph"></span>'}
      ${next ? `<a class="next" href="#/dia/${next.n}"><small>Dia ${next.n} ›</small><span>${esc(next.place)}</span></a>` : '<span class="ph"></span>'}
    </nav>
    ${footer()}
  </div>`;
}

function viewHome() {
  const t = todayISO();
  const td = todayDay();
  if (td) return viewDay(td.n);            // durante a viagem, abre direto no dia de hoje
  setAccent(null);
  document.title = `${T.brand} · ${T.title}`;
  const before = t < T.start;
  const left = daysBetween(t, T.start);
  const done = doneCount();
  return `
  <header class="hero"><div class="wrap">
    <div class="kicker"><b>${esc(T.brand)}</b> · ${esc(T.title)} ${T.year}</div>
    <h1>${esc(T.headline[0])}<span>${esc(T.headline[1])}</span></h1>
    <p>${esc(T.summary)}</p>
    <div class="chips"><div class="chip"><small>Período</small><strong>${fmtShort(T.start)} → ${fmtShort(T.end)} ${T.year}</strong></div>
      ${T.passenger ? `<div class="chip"><small>Passageiro</small><strong>${esc(T.passenger)}</strong></div>` : ''}</div>
    <div class="stats">${T.stats.map(s => `<div><strong>${esc(s[0])}</strong>${esc(s[1])}</div>`).join('')}</div>
  </div></header>
  <div class="wrap">
    ${before ? `<div class="countdown"><strong>${left}</strong><div><div class="lb">${left === 1 ? 'dia para a viagem' : 'dias para a viagem'}</div>
      <div class="sm">Embarque em ${fmtNum(T.start)}/${T.year} · ${done} de ${T.checklist.length} reservas marcadas</div></div></div>` :
      `<div class="countdown"><strong>✓</strong><div><div class="lb">Viagem concluída</div><div class="sm">Reveja o roteiro quando quiser</div></div></div>`}
    ${T.notice ? `<div class="banner">${icon('info')}<div>${esc(T.notice)}</div></div>` : ''}
    <div class="section"><div class="eyebrow">A viagem em ${T.trechos.length} trechos</div><h3>Toque em um trecho</h3><p class="sub">para ver o dia a dia</p>
      ${T.trechos.map(tr => { const first = T.days.find(d => d.trecho === tr.id); const nd = T.days.filter(d => d.trecho === tr.id).length;
        return `<a class="trecho" style="--c:${tr.color}" href="#/dia/${first.n}"><span class="n">${String(tr.id).padStart(2,'0')}</span><div>
        <div class="nm">${esc(tr.name)}</div><div class="ct">${esc(tr.cities)}</div><div class="dt">${fmtShort(tr.from)} → ${fmtShort(tr.to)} · ${nd} dia${nd > 1 ? 's' : ''}</div></div></a>`; }).join('')}
    </div>
    <a class="btn" href="#/dia/1">Começar pelo dia 1 →</a>
    ${footer()}
  </div>`;
}

function viewDays() {
  setAccent(null);
  document.title = 'Dias · ' + T.title;
  const t = todayISO();
  let html = `<header class="hero"><div class="wrap"><div class="kicker"><b>${esc(T.brand)}</b></div><h1 style="font-size:44px">Dia a dia</h1>
    <p>${T.days.length} dias · ${fmtShort(T.start)} → ${fmtShort(T.end)} ${T.year}</p></div></header><div class="wrap">`;
  for (const tr of T.trechos) {
    html += `<div class="group-h" style="--c:${tr.color}">${String(tr.id).padStart(2,'0')} · ${esc(tr.name)}</div>`;
    html += T.days.filter(d => d.trecho === tr.id).map(d => `<a class="dayrow${d.date === t ? ' is-today' : ''}${d.date < t && t <= T.end ? ' is-past' : ''}" style="--c:${tr.color}" href="#/dia/${d.n}">
      <div class="d"><strong>${parse(d.date).getDate()}</strong><small>${MES[parse(d.date).getMonth()]} · ${wd(d.date).slice(0,3)}</small></div>
      <div class="info"><div class="pl">${esc(d.place)}</div><div class="ti">Dia ${d.n} · ${esc(d.title)}</div></div></a>`).join('');
  }
  return html + footer() + '</div>';
}

function viewTransfers() {
  setAccent(null);
  document.title = 'Deslocamentos · ' + T.title;
  const color = iso => trecho(T.days.find(d => d.date === iso)?.trecho || 5).color;
  return `<header class="hero"><div class="wrap"><div class="kicker"><b>${esc(T.brand)}</b></div><h1 style="font-size:44px">Deslocamentos</h1>
    <p>Horários que não podem escapar</p></div></header><div class="wrap">
    ${T.notice ? `<div class="banner">${icon('alert')}<div>${esc(T.notice)}</div></div>` : ''}
    <div class="section">${T.transfers.map(([iso, route, mode, time]) => { const day = T.days.find(d => d.date === iso);
      return `<a class="tr" style="--c:${color(iso)}" href="#/dia/${day.n}"><div class="dt">${fmtNum(iso).slice(0,2)}<small>${MES[parse(iso).getMonth()]} · ${wd(iso).slice(0,3)}</small></div>
      <div><div class="rt">${esc(route)}</div><div class="md">${esc(mode)}</div><span class="time${/definir/i.test(time) ? ' pending' : ''}">${esc(time)}</span></div></a>`; }).join('')}</div>
    ${footer()}</div>`;
}

function viewStays() {
  setAccent(null);
  document.title = 'Hospedagens · ' + T.title;
  const nights = T.stays.reduce((a, s) => a + s[1], 0);
  return `<header class="hero"><div class="wrap"><div class="kicker"><b>${esc(T.brand)}</b></div><h1 style="font-size:44px">Onde dormir</h1>
    <p>${T.stays.length} hospedagens · ${nights} noites</p></div></header><div class="wrap"><div class="section">
    ${T.stays.map(([city, n, name, addr, from, to]) => { const c = trecho(T.days.find(d => d.date === from).trecho).color;
      return `<div class="stay" style="--c:${c}"><div class="ct">${esc(city)} · ${n} noite${n > 1 ? 's' : ''}</div><div class="nm">${esc(name)}</div>
      <div class="ad">${esc(addr)}</div><div class="dt">${wd(from)}, ${fmtShort(from)} → ${wd(to)}, ${fmtShort(to)}</div>${mapLink(name + ', ' + addr, 'Ver no mapa')}</div>`; }).join('')}
    </div>${footer()}</div>`;
}

/* ---------- reservas (marcações ficam neste aparelho) ---------- */
function loadChecks() { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; } }
function saveChecks(o) { try { localStorage.setItem(STORE_KEY, JSON.stringify(o)); } catch { /* sem armazenamento: segue sem salvar */ } }
const doneCount = () => { const c = loadChecks(); return T.checklist.filter(i => c[i.id]).length; };

function viewChecklist() {
  setAccent(null);
  document.title = 'Reservas · ' + T.title;
  const c = loadChecks();
  const done = doneCount(), total = T.checklist.length;
  return `<header class="hero"><div class="wrap"><div class="kicker"><b>${esc(T.brand)}</b></div><h1 style="font-size:44px">Antes de embarcar</h1>
    <p>Bilhetes, reservas e cartões de transporte</p></div></header><div class="wrap">
    <div class="section"><h3>Reservas</h3><p class="sub" id="ckcount">${done} de ${total} marcadas · as marcações ficam salvas neste aparelho</p>
      <div class="progress"><i id="ckbar" style="width:${Math.round(done / total * 100)}%"></i></div>
      <div style="margin-top:14px">${T.checklist.map(i => `<div class="check${c[i.id] ? ' done' : ''}"><input type="checkbox" id="ck-${i.id}" data-id="${i.id}"${c[i.id] ? ' checked' : ''}><label for="ck-${i.id}">${esc(i.text)}</label></div>`).join('')}</div>
    </div>
    <div class="section"><h3>Cartões de transporte</h3><div class="cardlist">${T.cards.map(([c, t]) => `<div><b>${esc(c)}</b>${esc(t)}</div>`).join('')}</div></div>
    <div class="section"><h3>Reserve com horário marcado</h3><p class="sub">Vendem ingressos por horário e costumam esgotar na alta temporada</p>
      <div class="tags">${T.timed.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>
    ${footer()}</div>`;
}

function footer() {
  const a = T.agency || {};
  const contact = [a.whatsapp && `WhatsApp ${esc(a.whatsapp)}`, a.email && esc(a.email)].filter(Boolean).join(' · ');
  return `<p class="foot"><b>${esc(a.name || T.brand)}</b>${contact ? '<br>Dúvidas durante a viagem: ' + contact : ''}<br>Boa viagem!</p>`;
}

/* ---------- roteamento ---------- */
const TABS = [['#/', 'Hoje', 'home'], ['#/dias', 'Dias', 'cal'], ['#/trajetos', 'Trajetos', 'bus'], ['#/hospedagens', 'Estadia', 'bed'], ['#/reservas', 'Reservas', 'check']];
function route() {
  const h = location.hash || '#/';
  let html, tab = '#/';
  let m;
  if ((m = h.match(/^#\/dia\/(\d+)/))) { html = viewDay(+m[1]); tab = (todayDay()?.n === +m[1]) ? '#/' : '#/dias'; }
  else if (h.startsWith('#/dias')) { html = viewDays(); tab = '#/dias'; }
  else if (h.startsWith('#/trajetos')) { html = viewTransfers(); tab = '#/trajetos'; }
  else if (h.startsWith('#/hospedagens')) { html = viewStays(); tab = '#/hospedagens'; }
  else if (h.startsWith('#/reservas')) { html = viewChecklist(); tab = '#/reservas'; }
  else html = viewHome();
  $('#app').innerHTML = html;
  $('#tabs').innerHTML = TABS.map(([href, label, ic]) => `<a href="${href}"${href === tab ? ' aria-current="page"' : ''}>${icon(ic)}${label}</a>`).join('');
  window.scrollTo(0, 0);
}

document.addEventListener('change', e => {
  const el = e.target;
  if (!el.matches('.check input')) return;
  const c = loadChecks(); c[el.dataset.id] = el.checked; saveChecks(c);
  el.closest('.check').classList.toggle('done', el.checked);
  const done = doneCount(), total = T.checklist.length;
  $('#ckcount').textContent = `${done} de ${total} marcadas · as marcações ficam salvas neste aparelho`;
  $('#ckbar').style.width = Math.round(done / total * 100) + '%';
});

// troca de dia com gesto lateral
let sx = null, sy = null;
document.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
document.addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
  const m = (location.hash || '').match(/^#\/dia\/(\d+)/);
  if (!m || Math.abs(dx) < 70 || Math.abs(dy) > 50) return;
  const n = +m[1] + (dx < 0 ? 1 : -1);
  if (n >= 1 && n <= T.days.length) location.hash = '#/dia/' + n;
}, {passive: true});

const setOnline = () => document.body.classList.toggle('is-offline', !navigator.onLine);
addEventListener('online', setOnline); addEventListener('offline', setOnline);

fetch('roteiro.json').then(r => r.json()).then(data => {
  T = data; setOnline(); route(); addEventListener('hashchange', route);
}).catch(() => {
  $('#app').innerHTML = '<div class="wrap" style="padding-top:40px"><h2>Não foi possível carregar o roteiro</h2><p>Abra o app pelo endereço publicado (ou por um servidor local) e tente de novo.</p></div>';
});

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
