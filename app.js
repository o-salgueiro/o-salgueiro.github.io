

function applyLang(lang){
  const strings = dict[lang] || dict.es;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (strings[key]) el.textContent = strings[key];
  });
  document.title = strings['site.title'] || dict.es['site.title'];
  document.querySelectorAll('.lang button').forEach(btn => {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  try { localStorage.setItem('lang', lang); } catch(e){}
}

function initLang(){
  const stored = localStorage.getItem('lang');
  const lang = (stored && ['gl','es','en'].includes(stored)) ? stored : 'es';
  applyLang(lang);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initLang();
  document.querySelectorAll('.lang button').forEach(btn => {
    btn.addEventListener('click', ()=>applyLang(btn.getAttribute('data-lang')));
  });

  const sections=['inicio','tenis','actividades','historia','instalacions','novas','tarifas','contacto'];
  function showSection(id){
    try{ localStorage.setItem('last_tab', id); }catch(e){}
    const all = sections.map(s=>document.getElementById(s)).filter(Boolean);
    all.forEach(el=>el.classList.add('hidden'));
    if(id==='inicio' || !sections.includes(id)){
      document.getElementById('inicio').classList.remove('hidden');
    }else{
      const target=document.getElementById(id); if(target) target.classList.remove('hidden');
    }
    document.querySelectorAll('nav a[href^="#"]').forEach(a=>{
      const ok=a.getAttribute('href')==='#'+id;
      a.classList.toggle('active',ok);
      a.setAttribute('aria-current', ok ? 'page' : 'false');
    });
    window.scrollTo({top:0,behavior:'instant'});
  }
  // const initial = (location.hash.replace('#','')) || 'inicio';
  // showSection(initial);
  // window.addEventListener('hashchange', ()=>showSection(location.hash.replace('#','')||'inicio'));

  // Hero carousel 5s
  const imgs = Array.from(document.querySelectorAll('#hero-carousel img'));
  let i=0;
  if (imgs.length){
    imgs.forEach((im, idx)=> im.classList.toggle('active', idx===0));
    setInterval(()=>{
      imgs[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
    }, 5000);
  }

  // Lightbox
  const lb=document.getElementById('lightbox');
  const lbImg=lb ? lb.querySelector('img') : null;
  const closeBtn=lb ? lb.querySelector('.lightbox-close') : null;
  function openLB(src){ if(lbImg){ lbImg.src=src; } if(lb) lb.classList.add('show'); }
  function closeLB(){ if(lb) lb.classList.remove('show'); if(lbImg) lbImg.removeAttribute('src'); }
  function bindGallery(id){
    const g=document.getElementById(id);
    if(g) g.addEventListener('click',e=>{ if(e.target && e.target.tagName==='IMG') openLB(e.target.src); });
  }
  bindGallery('gallery'); bindGallery('gallery-instalacions');
  if(lb) lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
  if(closeBtn) closeBtn.addEventListener('click', closeLB);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLB(); });

  // COOKIE CONSENT: bloqueo ligero hasta aceptar
  const COOKIE_KEY = 'os_cookie_consent';
  const cookieEl = document.getElementById('cookie-consent');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  function showCookie(){ if(cookieEl) cookieEl.classList.remove('hidden'); document.body.setAttribute('data-cookie','required'); }
  function hideCookie(){ if(cookieEl) cookieEl.classList.add('hidden'); document.body.removeAttribute('data-cookie'); }

  try{
    const stored = localStorage.getItem(COOKIE_KEY);
    if(stored === 'accepted'){
      hideCookie();
    }else{
      showCookie();
    }
  }catch(e){ showCookie(); }

  if(cookieAcceptBtn){
    cookieAcceptBtn.addEventListener('click', () => {
      try{ localStorage.setItem(COOKIE_KEY,'accepted'); }catch(e){}
      hideCookie();
    });
  }

  // Evitar navegación hasta aceptar cookies (salvo enlaces a la página de cookies)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest && e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(href.includes('cookies') || href.includes('/cookies.html') || href.includes('cookies.html')) return;
    if(localStorage.getItem(COOKIE_KEY) !== 'accepted'){
      e.preventDefault();
      if(cookieEl) cookieEl.classList.remove('hidden');
      window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'});
    }
  }, true);

  // Mailto + validación checkbox privacidad + cookies
  window.sendMailto = function(e){
    e.preventDefault();
    const name=document.getElementById('cf-name') ? document.getElementById('cf-name').value.trim() : '';
    const email=document.getElementById('cf-email') ? document.getElementById('cf-email').value.trim() : '';
    const msg=document.getElementById('cf-message') ? document.getElementById('cf-message').value.trim() : '';
    const privacyChecked = document.getElementById('cf-privacy') ? document.getElementById('cf-privacy').checked : false;

    if(!name || !email || !msg){
      alert((document.documentElement.lang || 'es') === 'en' ? 'Please complete all required fields.' : (document.documentElement.lang || 'es') === 'gl' ? 'Completa todos os campos obrigatorios.' : 'Por favor completa todos los campos obligatorios.');
      return false;
    }

    if(!privacyChecked){
      alert((document.documentElement.lang || 'es') === 'en' ? 'You must accept the privacy policy to send.' : (document.documentElement.lang || 'es') === 'gl' ? 'Debe aceptar a política de privacidade para enviar.' : 'Debe aceptar la política de privacidad para enviar.');
      return false;
    }

    if(localStorage.getItem(COOKIE_KEY) !== 'accepted'){
      if(cookieEl) cookieEl.classList.remove('hidden');
      alert((document.documentElement.lang || 'es') === 'en' ? 'You must accept cookies before continuing.' : (document.documentElement.lang || 'es') === 'gl' ? 'Debe aceptar as cookies antes de continuar.' : 'Debe aceptar las cookies antes de continuar.');
      return false;
    }

    const subject=encodeURIComponent(`Contacto web – ${name}`);
    const body=encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensaxe:\n${msg}`);
    const mail=`mailto:salgueiropaderne@gmail.com?subject=${subject}&body=${body}`;
    const a=document.getElementById('mailto-hidden');
    if(a){ a.setAttribute('href', mail); a.click(); }

    try{ window.location.assign(mail); }catch(_){}

    setTimeout(()=>{
      if (!document.hasFocus()) return;
      const lang=(document.documentElement.lang||'es');
      const strings=dict[lang]||dict.es;
      const promptTxt=strings['mailto.prompt'] || dict.es['mailto.prompt'];
      if(confirm(promptTxt)){
        const url=`https://mail.google.com/mail/?view=cm&fs=1&to=salgueiropaderne@gmail.com&su=${subject}&body=${body}`;
        window.open(url, '_blank', 'noopener');
      }
    }, 300);

    return false;
  };

  // set year
  const y=document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
});
// Menú activo según la sección visible
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");

function updateActiveMenu() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });

  const brand = document.querySelector(".brand");

  if (window.scrollY < 300) {
    brand.classList.add("active");
  } else {
    brand.classList.remove("active");
  }
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load", updateActiveMenu);
