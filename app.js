// Tabs, carousel, gallery lightbox, mailto, and boot
(function(){
  // Tabs
  const sections=['inicio','tenis','actividades','historia','instalacions','novas','tarifas','contacto'];
  function showSection(id){
    try{ localStorage.setItem('last_tab', id); }catch(e){}
    const mainHero=document.querySelector('main.hero');
    const allSections=sections.map(s=>document.getElementById(s)).filter(Boolean);
    allSections.forEach(el=>el.classList.add('hidden'));
    if(id==='inicio'||!sections.includes(id)){
      mainHero.classList.remove('hidden');
    }else{
      mainHero.classList.add('hidden');
      const target=document.getElementById(id); if(target) target.classList.remove('hidden');
    }
    document.querySelectorAll('nav a[href^="#"]').forEach(a=>{
      const ok=a.getAttribute('href')==='#'+id;
      a.classList.toggle('active',ok);
      a.setAttribute('aria-current', ok ? 'page' : 'false');
    });
    window.scrollTo({top:0,behavior:'instant'});
  }
  function initTabs(){
    const initial=(location.hash.replace('#',''))||localStorage.getItem('last_tab')||'inicio';
    showSection(initial);
    window.addEventListener('hashchange', ()=>showSection(location.hash.replace('#','')||'inicio'));
  }

  // Carousel
  function initCarousel(){
    const imgs = Array.from(document.querySelectorAll('#hero-carousel img'));
    if (!imgs.length) return;
    let i = 0;
    imgs.forEach((im, idx)=> im.classList.toggle('active', idx===0));
    setInterval(()=>{
      imgs[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
    }, 5000);
  }

  // Lightbox
  function initLightbox(){
    const lb=document.getElementById('lightbox');
    const lbImg=lb.querySelector('img');
    const closeBtn=lb.querySelector('.lightbox-close');
    function open(src){ lbImg.src=src; lb.classList.add('show'); }
    function close(){ lb.classList.remove('show'); lbImg.removeAttribute('src'); }
    const bindGallery = (id)=>{
      const g=document.getElementById(id);
      if(g) g.addEventListener('click',e=>{ if(e.target.tagName==='IMG') open(e.target.src); });
    };
    bindGallery('gallery'); bindGallery('gallery-instalacions');
    lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
    if(closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  }

  // Mailto
  window.sendMailto = function(e){
    e.preventDefault();
    const name=document.getElementById('cf-name').value.trim();
    const email=document.getElementById('cf-email').value.trim();
    const msg=document.getElementById('cf-message').value.trim();
    if(!name || !email || !msg){ return false; }
    const subject=encodeURIComponent(`Contacto web – ${name}`);
    const body=encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensaxe:\n${msg}`);
    const mail=`mailto:salgueiropaderne@gmail.com?subject=${subject}&body=${body}`;
    const a=document.getElementById('mailto-hidden');
    a.setAttribute('href', mail); a.click();
    try{ window.location.assign(mail); }catch(_){}
    setTimeout(()=>{
      if (!document.hasFocus()) return;
      const lang=(document.documentElement.lang||'gl');
      const strings=window.OS_DICT[lang]||window.OS_DICT.gl;
      const promptTxt=strings['mailto.prompt'] || window.OS_DICT.gl['mailto.prompt'];
      if(confirm(promptTxt)){
        const url=`https://mail.google.com/mail/?view=cm&fs=1&to=salgueiropaderne@gmail.com&su=${subject}&body=${body}`;
        window.open(url, '_blank', 'noopener');
      }
    }, 300);
    return false;
  };

  // Boot
  document.addEventListener('DOMContentLoaded', ()=>{
    window.initLang && window.initLang();
    document.querySelectorAll('.lang button').forEach(btn => {
      btn.addEventListener('click', ()=>window.applyLang(btn.getAttribute('data-lang')));
    });
    initTabs();
    initCarousel();
    initLightbox();
    const y=document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  });
})();