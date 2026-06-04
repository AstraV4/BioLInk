// ===========================================================================
//  Moteur de la page profil. Lit la config JSON injectee par le serveur.
//  Securite : les donnees utilisateur sont posees via textContent / attributs
//  valides, jamais via innerHTML. Seules les icones (constantes) sont en HTML.
// ===========================================================================
const CONFIG = JSON.parse(document.getElementById('cfg').textContent);
const $ = id => document.getElementById(id);

// --- Icones (constantes de confiance) ---
const ICONS = {
  discord:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19 19 0 0 0 15.6 3l-.2.4a14 14 0 0 1 4.1 2 14 14 0 0 0-12 0 14 14 0 0 1 4.2-2L11.4 3A19 19 0 0 0 6.7 4.4 19.7 19.7 0 0 0 3.3 18a19 19 0 0 0 5.8 2.9l.7-1.1a12 12 0 0 1-1.9-.9l.5-.4a13.6 13.6 0 0 0 11.6 0l.5.4a12 12 0 0 1-1.9.9l.7 1.1A19 19 0 0 0 26 18l-.3-.5A19.7 19.7 0 0 0 20.3 4.4ZM9.7 15.1c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm4.6 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Z"/></svg>',
  github:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.3l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.3 22H2l7.7-8.8L1.6 2h6.8l4.7 6.2L18.2 2Zm-1.2 18h1.8L7.1 3.9H5.2L17 20Z"/></svg>',
  youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.5 31 31 0 0 0-.4-4.5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z"/></svg>',
  spotify:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.5-5.4-1.8-9-1a.6.6 0 1 1-.3-1.2c3.9-.9 7.3-.5 10 1.1a.6.6 0 0 1 .2.9Zm1.2-2.7a.8.8 0 0 1-1 .3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.4-1.5c3.7-1.1 8.3-.6 11.4 1.4a.8.8 0 0 1 .1 1Zm.1-2.8C14.7 9 8.9 8.8 5.7 9.8a.9.9 0 1 1-.6-1.8c3.8-1.1 10.1-.9 14 1.4a.9.9 0 1 1-1 1.6Z"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 2c.3 2.2 1.6 3.6 3.7 3.8v2.5c-1.3.1-2.5-.3-3.7-1v6.4c0 3.4-2.1 5.8-5.4 5.8-3 0-5.1-2.3-5.1-5.2 0-3.1 2.4-5.2 5.6-4.9v2.7c-.5-.1-1-.2-1.5-.1-1.3.2-2 1-1.9 2.4.1 1.3 1 2 2.2 1.9 1.3-.1 2-1 2-2.6V2h3.6Z"/></svg>',
  telegram:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.5 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.4-.1-.6-.6-.2L6 13.4l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3Z"/></svg>',
  email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>'
};
const STATUS_COLORS = { online:'#22c55e', idle:'#f59e0b', dnd:'#ef4444', offline:'#6b7280' };

// --- Theme ---
const root = document.documentElement.style;
root.setProperty('--accent', CONFIG.accent || '#8b5cf6');
root.setProperty('--accent-2', CONFIG.accent2 || '#22d3ee');

// --- Fond ---
if (CONFIG.bgIsVideo && CONFIG.background){
  const v = $('bg-video'); v.src = CONFIG.background; v.style.display = 'block'; $('bg').style.display = 'none';
} else if (CONFIG.background){
  $('bg').style.backgroundImage = "url(" + JSON.stringify(CONFIG.background) + ")";
}

// --- Identite (textContent => sans danger) ---
$('uname-text').textContent = CONFIG.username || '';
$('title').textContent = CONFIG.title || '';
if (CONFIG.avatar) $('avatar').src = CONFIG.avatar;
$('views').textContent = (CONFIG.views || 0).toLocaleString('fr-FR');

if (CONFIG.status && STATUS_COLORS[CONFIG.status]){
  $('status').style.background = STATUS_COLORS[CONFIG.status];
  $('status').style.boxShadow = '0 0 12px ' + STATUS_COLORS[CONFIG.status];
} else { $('status').style.display = 'none'; }

// --- Liens sociaux ---
const linksBox = $('links');
(CONFIG.socials || []).forEach(s => {
  const a = document.createElement('a');
  a.className = 'link';
  let href = s.url || '';
  if (s.type === 'email' && !/^mailto:/i.test(href)) href = 'mailto:' + href;
  if (!/^(https?:|mailto:)/i.test(href)) return; // securite : schemas autorises seulement
  a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.title = s.type || '';
  a.innerHTML = ICONS[s.type] || ICONS.globe; // icone = constante de confiance
  linksBox.appendChild(a);
});

// --- Boutons texte ---
const btnBox = $('btn-links');
(CONFIG.buttons || []).forEach(b => {
  if (!/^(https?:|mailto:)/i.test(b.url || '')) return;
  const a = document.createElement('a');
  a.className = 'btn-link'; a.href = b.url; a.target = '_blank'; a.rel = 'noopener';
  a.textContent = b.label || 'Lien'; // textContent => sans danger
  btnBox.appendChild(a);
});

// --- Curseur personnalise ---
if (CONFIG.cursor){
  root.setProperty('--cursor', 'none');
  const c = $('cursor'); c.style.display = 'block';
  addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; });
  addEventListener('mousedown', () => { c.style.width='38px'; c.style.height='38px'; c.style.background='rgba(139,92,246,.3)'; });
  addEventListener('mouseup',   () => { c.style.width='26px'; c.style.height='26px'; c.style.background='transparent'; });
}

// --- Machine a ecrire ---
(function typewriter(){
  const el = $('bio-text');
  const lines = (CONFIG.bio && CONFIG.bio.length) ? CONFIG.bio : [''];
  let li=0, ci=0, del=false;
  (function tick(){
    const full = lines[li] || '';
    el.textContent = full.slice(0, ci);
    if (!del && ci < full.length){ ci++; setTimeout(tick, 55); }
    else if (!del && ci === full.length){ del = true; setTimeout(tick, 1600); }
    else if (del && ci > 0){ ci--; setTimeout(tick, 28); }
    else { del = false; li = (li+1) % lines.length; setTimeout(tick, 300); }
  })();
})();

// --- Tilt 3D ---
const card = $('card');
addEventListener('mousemove', e => {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  card.style.transform = `rotateY(${x*9}deg) rotateX(${-y*9}deg)`;
});
addEventListener('mouseleave', () => card.style.transform = '');

// --- Particules ---
(function fx(){
  if (CONFIG.effect === 'none' || !CONFIG.effect) return;
  const cv = $('fx'), ctx = cv.getContext('2d');
  let W, H, P = [];
  function size(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
  size(); addEventListener('resize', size);
  const N = CONFIG.effect === 'stars' ? 120 : 90;
  for (let i=0;i<N;i++) P.push({
    x:Math.random()*W, y:Math.random()*H,
    r: CONFIG.effect==='rain'?Math.random()*1+.5:Math.random()*2.2+.6,
    s: CONFIG.effect==='rain'?Math.random()*6+5:Math.random()*1.2+.3,
    d: Math.random()*.6-.3, a: Math.random()*.6+.3, tw: Math.random()*.05
  });
  (function draw(){
    ctx.clearRect(0,0,W,H);
    for (const p of P){
      ctx.beginPath();
      if (CONFIG.effect==='rain'){
        ctx.strokeStyle=`rgba(180,200,255,${p.a})`; ctx.lineWidth=p.r;
        ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.d,p.y+p.s*2); ctx.stroke();
        p.y+=p.s*2; p.x+=p.d;
      } else if (CONFIG.effect==='stars'){
        p.a+=p.tw; if(p.a>1||p.a<.2)p.tw*=-1;
        ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.arc(p.x,p.y,p.r,0,7); ctx.fill();
        p.y+=p.s*.15;
      } else {
        ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.arc(p.x,p.y,p.r,0,7); ctx.fill();
        p.y+=p.s*.4; p.x+=Math.sin(p.y*.01)*.5+p.d;
      }
      if(p.y>H){p.y=-10;p.x=Math.random()*W}
      if(p.x>W)p.x=0; if(p.x<0)p.x=W;
    }
    requestAnimationFrame(draw);
  })();
})();

// --- Lecteur audio ---
const audio = $('audio');
const ICON_PLAY = '<path d="M8 5v14l11-7z"/>', ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
const ppIcon = $('pp-icon');
if (CONFIG.song){
  audio.src = CONFIG.song;
  $('song-name').textContent = CONFIG.songName || 'Musique';
  audio.volume = 0.4;
  const pp = $('pp'), bar = $('bar'), prog = $('progress'), vol = $('vol');
  pp.addEventListener('click', () => {
    if (audio.paused){ audio.play(); ppIcon.innerHTML = ICON_PAUSE; }
    else { audio.pause(); ppIcon.innerHTML = ICON_PLAY; }
  });
  audio.addEventListener('timeupdate', () => { if (audio.duration) bar.style.width = (audio.currentTime/audio.duration*100) + '%'; });
  prog.addEventListener('click', e => { const r = prog.getBoundingClientRect(); audio.currentTime = (e.clientX-r.left)/r.width*audio.duration; });
  vol.addEventListener('input', e => audio.volume = e.target.value);
} else {
  const player = $('player'); if (player) player.remove();
}

// --- Ecran d'entree ---
$('enter').addEventListener('click', () => {
  $('enter').classList.add('hidden');
  $('stage').classList.add('show');
  if (CONFIG.song){
    const player = $('player'); if (player) player.classList.add('show');
    audio.play().then(() => { if (ppIcon) ppIcon.innerHTML = ICON_PAUSE; }).catch(() => {});
  }
  const v = $('bg-video'); if (v && v.style.display !== 'none') v.play().catch(() => {});
}, { once:true });
