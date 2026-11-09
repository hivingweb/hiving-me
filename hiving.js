/* ============================================================
   HIVING — interactions
   ============================================================ */
/* Machines modestes : on coupe les effets lourds (fond animé, curseur
   custom, image-trail) pour garder un site fluide. Heuristique : peu de
   coeurs CPU ou peu de RAM annoncés par le navigateur. */
window.HIVING_LOWP = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HIVING = window.HIVING = window.HIVING || { setMotion(){} };

  /* ---------- NAV ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => { if(nav) nav.classList.toggle('scrolled', window.scrollY > 40); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- hero entrance ---------- */
  const heroEl = document.querySelector('.hero');
  requestAnimationFrame(() => { if(heroEl) heroEl.classList.add('in'); });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], .manifesto__big, .line-mask').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const countIO = new IntersectionObserver((es) => {
    es.forEach(e => {
      if(!e.isIntersecting) return;
      const el = e.target, target = parseFloat(el.dataset.count), span = el.querySelector('.val') || el.firstChild;
      if(reduce){ span.textContent = Math.round(target); countIO.unobserve(el); return; }
      const dur = 1400, start = performance.now();
      const tick = (now) => { const p = Math.min(1,(now-start)/dur); span.textContent = Math.round(target*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); countIO.unobserve(el);
    });
  }, { threshold:0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- universe hover peek ---------- */
  const peek = document.querySelector('.uni__peek');
  const peekImg = peek ? peek.querySelector('image-slot') : null;
  let peekRAF=null, mx=0, my=0;
  document.querySelectorAll('.uni').forEach(u => {
    u.addEventListener('mouseenter', () => {
      if(!peek) return; peek.classList.add('show');
      if(peekImg){ const id=u.dataset.slot||'uni-peek'; if(peekImg.id!==id){ peekImg.id=id; peekImg.setAttribute('placeholder', u.dataset.label||''); } }
    });
    u.addEventListener('mouseleave', () => { if(peek) peek.classList.remove('show'); });
  });
  window.addEventListener('mousemove', (e) => {
    mx=e.clientX; my=e.clientY;
    if(peek && !peekRAF){ peekRAF = requestAnimationFrame(() => { peek.style.left=(mx+26)+'px'; peek.style.top=(my-70)+'px'; peekRAF=null; }); }
  });

  /* ---------- photos des studios : fichiers WebP (media/slots/) au lieu du JSON de plusieurs Mo ---------- */
  ['studio-1', 'studio-2'].forEach(id => {
    const s = document.getElementById(id);
    if(s && s.tagName === 'IMAGE-SLOT' && !s.hasAttribute('src')) s.setAttribute('src', '/media/slots/' + id + '.webp');
  });

  /* ============================================================
     TALENT ECOSYSTEM — the living network (wow moment)
     ============================================================ */
  const stage = document.querySelector('.eco__stage');
  if(stage){
    const TALENTS = [
      { id:'eco-1', nm:'Shana B', uv:'Lifestyle', reach:'238K', plat:'TikTok 204K · Insta 34K', hd:'@shanabachh', brands:'Sézane · Rouje', desc:'Mode et beauté avec un œil sûr. Looks, bons plans et inspirations, toujours un cran avant la tendance.', email:'shana@hiving.me', ig:'https://www.instagram.com/shanabachh/', tt:'https://www.tiktok.com/@shanabach', x:90.1, y:37.8, s:92 },
      { id:'eco-3', nm:'Hugo Chassaing', uv:'Lifestyle', reach:'1,5M', plat:'TikTok 1,2M · Insta 310K', hd:'@huugoch', brands:'Netflix FR · SFR', desc:'Allure de surfeur, carrure de mannequin. Lifestyle solaire, vlogs et formats qui sentent bon l\'été.', email:'huugoch@hiving.me', ig:'https://www.instagram.com/huugoch/', tt:'https://www.tiktok.com/@huugooch', x:57.6, y:16.5, s:100 },
      { id:'eco-4', nm:'Ethan Hazard', uv:'Lifestyle', reach:'289K', plat:'TikTok 144K · Insta 145K', hd:'@ethan_hazard__', brands:'Riot Games · Logitech', desc:'Divertissement qui accroche : storytime, défis et punchlines. Une communauté fidèle et très réactive.', email:'ethan@hiving.me', ig:'https://www.instagram.com/ethan_hazard__/', tt:'https://www.tiktok.com/@ethan_hzd', x:31.9, y:69.0, s:90 },
      { id:'eco-5', nm:'Amandine', uv:'Lifestyle', reach:'122K', plat:'TikTok 40K · Insta 82K', hd:'@amandrieu', brands:'Sephora · Maybelline', desc:'DJ derrière les platines, caméra toujours à la main. Beauté, fêtes et art de vivre, le tout avec sincérité.', email:'amandine@hiving.me', ig:'https://www.instagram.com/amandrieu/', tt:'https://www.tiktok.com/@amandrieu', x:22.0, y:34.6, s:92 },
      { id:'eco-6', nm:'Gaël Monfils', uv:'Sport', reach:'1,6M', plat:'TikTok 281K · Insta 1,3M', hd:'@iamgaelmonfils', brands:'Asics · BNP Paribas', desc:'Légende du tennis français. Un showman sur le court comme à l\'écran, avec classe, énergie et panache.', ig:'https://www.instagram.com/iamgaelmonfils/', tt:'https://www.tiktok.com/@thegaelmonfils', yt:'https://www.youtube.com/@gaelmonfils15', x:26.1, y:8.5, s:104 },
      { id:'eco-7', nm:'Pablo Brimeux', uv:'Lifestyle', reach:'1,8M', plat:'TikTok 1,3M · Insta 544K', hd:'@brimeuxpablo', brands:'Uber · Coca-Cola', desc:'Énergie, humour et formats viraux. Les Anglais se souviennent encore de son plaquage au Crunch Creator.', email:'pablo@hiving.me', ig:'https://www.instagram.com/brimeuxpablo/', tt:'https://www.tiktok.com/@pablobrimeux', yt:'https://www.youtube.com/@AimAndPab', x:36.9, y:42.8, s:100 },
      { id:'eco-8', nm:'Lola Lacheré', uv:'Lifestyle', reach:'47K', plat:'TikTok 16K · Insta 30,6K', hd:'@lola_lachere', brands:'Zara · Rituals', desc:'Miss Nord-Pas-de-Calais 2025. Mode jeune, lifestyle et tendances, avec une communauté Gen Z au rendez-vous.', email:'lola@hiving.me', ig:'https://www.instagram.com/lola_lachere/', tt:'https://www.tiktok.com/@lola_lachere', x:46.5, y:7.4, s:88 },
      { id:'eco-9', nm:'Sharl', uv:'Lifestyle', reach:'2,7M', plat:'TikTok 2,3M · Insta 447K', hd:'@sharl.crb', brands:'Razer · Corsair', desc:'Le créateur le plus américain de France. Énergie XXL, formats fun et vibe US parfaitement assumée.', ig:'https://www.instagram.com/sharl.crb/', tt:'https://www.tiktok.com/@sharl_crb', x:62.6, y:62.5, s:104 },
      { id:'eco-10', nm:'Aimie Perino', uv:'Lifestyle', reach:'1,9M', plat:'TikTok 1,3M · Insta 587K', hd:'@aimie_perino', brands:'Gymshark · Sézane', desc:'Lifestyle et fitness, et surtout ce petit accent américain craquant. Des contenus solaires, soignés et brand-safe.', email:'aimie@hiving.me', ig:'https://www.instagram.com/aimie_perino/', tt:'https://www.tiktok.com/@aimie_perino', yt:'https://www.youtube.com/@AimAndPab', x:81.9, y:27.0, s:98 },
      { id:'eco-11', nm:'Larzize Matteo', uv:'Lifestyle', reach:'3,7M', plat:'TikTok 3,2M · Insta 463K', hd:'@larzizematteo', brands:'Red Bull · Oakley', desc:'Des muscles, des vannes et de l\'outdoor. Sport-lifestyle énergique, vidéos d\'action et bonne humeur garantie.', email:'matteo@hiving.me', ig:'https://www.instagram.com/larzizematteo/', tt:'https://www.tiktok.com/@larzizematteo', yt:'https://www.youtube.com/@Larzizematteo_', x:92.1, y:17.3, s:106 },
      { id:'eco-12', nm:'Bachelot', uv:'Lifestyle', reach:'1,2M', plat:'TikTok 1,1M · Insta 80K', hd:'@bachelooot', brands:'Burger King · Xbox', desc:'Humour et formats courts. Punchlines bien senties, sens du timing et virality maîtrisée.', email:'bachelot@hiving.me', ig:'https://www.instagram.com/bachelooot/', tt:'https://www.tiktok.com/@bachelotbachelot', x:7.2, y:13.0, s:96 },
      { id:'eco-13', nm:'Xéla', uv:'Lifestyle', reach:'183K', plat:'TikTok 152K · Insta 30,5K', hd:'@xela.bess', brands:'Polène · Diptyque', desc:'Mode et beauté, voix éditoriale posée. Storytime, looks et formats de marque qui respirent le bon goût.', email:'xela@hiving.me', ig:'https://www.instagram.com/xela.bess/', tt:'https://www.tiktok.com/@xela.bess', x:19.8, y:56.0, s:96 },
      { id:'eco-14', nm:'Perle', uv:'Lifestyle', reach:'2,2M', plat:'TikTok 2M · Insta 189K', hd:'@_perle_btr', brands:'Jeff de Bruges · Rouje', desc:'Lifestyle et art de vivre. Visuels léchés, storytime et un ton premium qui fidélise.', email:'perle@hiving.me', ig:'https://www.instagram.com/_perle_btr/', tt:'https://www.tiktok.com/@perle_btr', x:43.9, y:81.6, s:98 },
      { id:'eco-15', nm:'Vincent Lvv', uv:'Lifestyle', reach:'1,4M', plat:'TikTok 1,2M · Insta 200K', hd:'@vincentlvv', brands:'APM Monaco · Tommy', desc:'Lifestyle, mode et voyage. Toujours dans la tendance.', ig:'https://www.instagram.com/vincentlvv/', tt:'https://www.tiktok.com/@vincent_lvv', x:45.2, y:60.6, s:92 },
      { id:'eco-16', nm:'Flo', uv:'Food', reach:'557K', plat:'TikTok 326K · Insta 231K', hd:'@by.floooo', brands:'Carrefour · Thermomix', desc:'La cuisine du quotidien, en mieux. Recettes simples et gourmandes, et les bonnes adresses qui valent le détour.', email:'florence@hivingfood.fr', ig:'https://www.instagram.com/by.floooo/', tt:'https://www.tiktok.com/@by.floooo', x:29.9, y:91.8, s:90 },
      { id:'eco-17', nm:'Abellini', uv:'Food', reach:'292K', plat:'TikTok 162K · Insta 130K', hd:'@abellini__', brands:'Barilla · De Cecco', desc:'L\'Italie dans l\'assiette, la générosité en plus. Pasta, recettes de famille et plaisir qui se partage.', email:'abellini@hivingfood.fr', ig:'https://www.instagram.com/abellini__/', tt:'https://www.tiktok.com/@hien.chanh', x:62.8, y:32.1, s:88 },
      { id:'eco-18', nm:'Jules', uv:'Food', reach:'623K', plat:'TikTok 362K · Insta 261K', hd:'@julios.irl', brands:'Deliveroo · HelloFresh', desc:'Food et lifestyle, l\'énergie du quotidien. Bonnes adresses, recettes et bonne humeur communicative.', email:'julios@hivingfood.fr', ig:'https://www.instagram.com/julios.irl/', tt:'https://www.tiktok.com/@julescuisine', x:5.0, y:90.7, s:90 },
      { id:'eco-19', nm:'Lechefologue', uv:'Food', reach:'100K', plat:'Instagram 100K', hd:'@lechefologue', brands:'Le Cordon Bleu · Valrhona', desc:'Le chef qui explique la cuisine. Décryptages, culture food et savoir transmis avec passion.', email:'lechefologue@hivingfood.fr', ig:'https://www.instagram.com/lechefologue/', tt:'https://www.tiktok.com/@lechefologue', x:61.5, y:89.7, s:96 },
      { id:'eco-20', nm:'Julia', uv:'Food', reach:'175K', plat:'TikTok 48K · Insta 127K', hd:'@julia_lmp12', brands:'Vahiné · KitchenAid', desc:'Gagnante du Meilleur Pâtissier (saison 12). Pâtisserie maison, technique impeccable et gourmandise assumée.', email:'julia@hivingfood.fr', ig:'https://www.instagram.com/julia_lmp12/', tt:'https://www.tiktok.com/@julia.lmp12', x:11.0, y:27.1, s:86 },
      { id:'eco-22', nm:'Dricecook', uv:'Food', reach:'2,1M', plat:'TikTok 1,7M · Insta 415K', hd:'@dricecook', brands:'Tefal · Maggi', desc:'La cuisine en mode spectacle. Recettes virales, formats courts et exécution millimétrée.', email:'dricecook@hivingfood.fr', ig:'https://www.instagram.com/dricecook/', tt:'https://www.tiktok.com/@dricecook', x:6.6, y:41.2, s:100 },
      { id:'eco-23', nm:'SwissFitCook', uv:'Food', reach:'643K', plat:'TikTok 257K · Insta 386K', hd:'@swiss.fitcook', brands:'MyProtein · Foodspring', desc:'Le healthy qui donne faim. Recettes fit, équilibrées et faciles à refaire chez soi.', ig:'https://www.instagram.com/swiss.fitcook/', tt:'https://www.tiktok.com/@swiss_fit.cook', x:73.3, y:37.8, s:98 },
      { id:'eco-24', nm:'ChesterFoodies', uv:'Food', reach:'675K', plat:'TikTok 300K · Insta 375K', hd:'@chester_foodies', brands:'Just Eat · Burger King', desc:'Le duo qui teste tout, sans filtre. Reviews food, bonnes adresses et avis bien tranchés.', email:'chesterfoodies@hivingfood.fr', ig:'https://www.instagram.com/chester_foodies/', tt:'https://www.tiktok.com/@chesterfoodies', x:17.3, y:79.1, s:108 },
      { id:'eco-26', nm:'Vincent Salur', uv:'Food', reach:'924K', plat:'TikTok 450K · Insta 474K', hd:'@vincentsalur', brands:'Le Creuset · Maille', desc:'La cuisine maison qui rassemble. Recettes conviviales et généreuses, exécution toujours soignée.', ig:'https://www.instagram.com/vincentsalur/', tt:'https://www.tiktok.com/@vincentsalur', x:4.6, y:64.5, s:92 },
      { id:'eco-27', nm:'Damien Pichon', uv:'Food', reach:'241K', plat:'Instagram 241K', hd:'@damienpichon_', brands:'Bragard · Valrhona', desc:'La gastronomie rendue accessible. Le geste précis, le beau produit, le détail qui change tout.', email:'damien@hivingfood.fr', ig:'https://www.instagram.com/damienpichon_/', tt:'https://www.tiktok.com/@damienpichon_', x:64.0, y:46.4, s:88 },
      { id:'eco-30', nm:'Peppe', uv:'Food', reach:'217K', plat:'TikTok 42K · Insta 175K', hd:'@peppeofficiel', brands:'Galbani · San Pellegrino', desc:'La vraie Italie, sans compromis. Pizza, pasta et passion transalpine à chaque vidéo.', ig:'https://www.instagram.com/peppeofficiel/', tt:'https://www.tiktok.com/@peppeofficiel', x:52.9, y:74.7, s:86 },
      { id:'eco-31', nm:'Qistoh', uv:'Food', reach:'1,4M', plat:'TikTok 688K · Insta 688K', hd:'@qistoh_', brands:'Domino’s · Coca-Cola', desc:'Food et humour, le combo gagnant. Formats fun, bonnes adresses et virality maîtrisée.', email:'qistoh@hivingfood.fr', ig:'https://www.instagram.com/qistoh_/', tt:'https://www.tiktok.com/@qistoh', x:53.7, y:42.3, s:96 },
      { id:'eco-32', nm:'Dorian Tudeau', uv:'Food', reach:'1,3M', plat:'TikTok 788K · Insta 550K', hd:'@lecoindupatissier', brands:'Vahiné · Silikomart', desc:'Le coin du pâtissier, pas à pas. Des recettes maison expliquées simplement, pour réussir à tous les coups.', ig:'https://www.instagram.com/lecoindupatissier/', tt:'https://www.tiktok.com/@lecoindupatissier', x:40.3, y:21.9, s:96 },
      { id:'eco-33', nm:'Kilian', uv:'Food', reach:'563K', plat:'TikTok 134K · Insta 429K', hd:'@kilianfranceschi', brands:'HelloFresh · Cookeo', desc:'Food et lifestyle au quotidien. Recettes, adresses et plaisir simple, toujours bien filmés.', email:'kilian@hivingfood.fr', ig:'https://www.instagram.com/kilianfranceschi/', tt:'https://www.tiktok.com/@franceschi.kilian', x:84.1, y:6.1, s:90 },
    ];
    const UNIVS = ['Lifestyle','Sport','Food'];

    const linesSvg = stage.querySelector('.eco__lines');
    const panel = stage.querySelector('.eco__panel');
    const lineEls = [];

    // build nodes
    const nodes = TALENTS.map(t => {
      const node = document.createElement('div');
      node.className = 'node'; node.dataset.uv = t.uv; node.dataset.id = t.id;
      node.style.left = t.x + '%'; node.style.top = t.y + '%';
      node.style.width = t.s + 'px'; node.style.height = Math.round(t.s*1.25) + 'px';
      node.innerHTML =
        '<div class="node__float" style="width:100%;height:100%">'+
          '<div class="node__inner" style="width:100%;height:100%">'+
            '<image-slot id="'+t.id+'" src="/media/slots/'+t.id+'.webp" placeholder="'+t.nm+'" shape="rect" fit="cover" style="width:100%;height:100%"></image-slot>'+
            '<div class="node__grad"></div>'+
            '<div class="node__tag"><span class="nm">'+t.nm+'</span><span class="uv">'+t.uv+'</span><span class="node__reach">'+t.reach+'</span></div>'+
          '</div>'+
        '</div>';
      stage.insertBefore(node, panel);
      return { el:node, data:t };
    });

    // build lines between same-universe nodes
    UNIVS.forEach(uv => {
      const group = nodes.filter(n => n.data.uv === uv);
      for(let i=0;i<group.length;i++) for(let j=i+1;j<group.length;j++){
        const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
        ln.dataset.a = group[i].data.id; ln.dataset.b = group[j].data.id; ln.dataset.uv = uv;
        linesSvg.appendChild(ln); lineEls.push({el:ln, a:group[i].data, b:group[j].data, uv});
      }
    });

    function layoutLines(){
      const w = stage.clientWidth, h = stage.clientHeight;
      lineEls.forEach(l => {
        l.el.setAttribute('x1', l.a.x/100*w); l.el.setAttribute('y1', l.a.y/100*h);
        l.el.setAttribute('x2', l.b.x/100*w); l.el.setAttribute('y2', l.b.y/100*h);
      });
    }
    layoutLines(); window.addEventListener('resize', layoutLines);

    // panel render
    const SOC_SVG = {
      ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>',
      tt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3c.4 2 1.7 3.6 3.7 3.9V10c-1.4 0-2.7-.4-3.8-1.1v6.2a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.2a2.6 2.6 0 1 0 1.8 2.5V3h3.1z" fill="currentColor"/></svg>',
      yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5.5" width="20" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor"/></svg>'
    };
    // ---------- stats live (Supabase, lecture seule via clé publique) ----------
    const SB_URL = 'https://pmrqrbjxikljlarhkseu.supabase.co';
    const SB_KEY = 'sb_publishable_j_kHa-caXfSxkSyeGd-veA_ZdUvNCw8';
    let METRICS = null;        // eco_id -> { instagram:{...}, tiktok:{...} }
    let currentTalent = null;
    const fmtNum = (n) => {
      if(n==null) return null; n=+n;
      if(n>=1e6){ let s=(n/1e6).toFixed(n>=1e7?0:1); if(s.endsWith('.0')) s=s.slice(0,-2); return s.replace('.',',')+'M'; }
      if(n>=1e3) return Math.round(n/1e3)+'K';
      return ''+Math.round(n);
    };
    const fmtPct  = (n) => n==null ? null : (''+(Math.round(n*10)/10)).replace('.',',')+'%';
    const fmtFreq = (n) => n==null ? null : (''+(Math.round(n*10)/10)).replace('.',',')+' posts/mois';
    function renderMetrics(t){
      const wrap = panel.querySelector('.pv-metrics');
      const reach = panel.querySelector('.pv-reach');
      if(!wrap) return;
      const m = METRICS && METRICS[t.id];
      if(!m){ wrap.innerHTML=''; wrap.style.display='none'; if(reach) reach.textContent=t.reach; return; }
      const order = [['instagram', SOC_SVG.ig], ['tiktok', SOC_SVG.tt]];
      let total = 0, html = '';
      order.forEach(([key, svg]) => {
        const d = m[key]; if(!d) return;
        if(d.followers) total += +d.followers;
        const bits = [];
        if(d.engagement_rate!=null) bits.push('engagement ' + fmtPct(d.engagement_rate));
        if(key==='tiktok' && d.avg_views!=null) bits.push(fmtNum(d.avg_views) + ' vues moy.');
        let grow = '';
        if(d.growth_30d!=null && Math.round(d.growth_30d*10)!==0){
          const up = d.growth_30d > 0;
          grow = '<span class="pvm-grow '+(up?'up':'down')+'">'+(up?'↑ +':'↓ ')
               + (''+Math.abs(Math.round(d.growth_30d*10)/10)).replace('.',',')+'%</span>';
        }
        html += '<div class="pvm-row"><span class="pvm-ic">'+svg+'</span><div class="pvm-b">'
              + '<div class="pvm-top"><b>'+(fmtNum(d.followers)||'—')+'</b>abonnés'+grow+'</div>'
              + '<div class="pvm-sub">'+bits.join(' · ')+'</div></div></div>';
      });
      wrap.innerHTML = html;
      wrap.style.display = html ? '' : 'none';
      if(reach) reach.textContent = total ? fmtNum(total) : t.reach;
    }

    let DEMO = null;           // eco_id -> { aud_female, aud_18_24, aud_country1, ... }
    function audRow(label, pct){
      if(pct==null || label==null) return '';
      const p = Math.max(0, Math.min(100, +pct));
      return '<div class="pva-row"><span class="l">'+label+'</span><span class="pva-bar"><i style="width:'+p+'%"></i></span>'
           + '<span class="v">'+(''+(Math.round(p*10)/10)).replace('.',',')+'%</span></div>';
    }
    function audSec(title, rows){
      const r = rows.filter(Boolean).join('');
      return r ? '<div class="pva-sec"><div class="pva-sec-t">'+title+'</div>'+r+'</div>' : '';
    }
    function renderAudience(t){
      const wrap = panel.querySelector('.pv-aud'); if(!wrap) return;
      const d = DEMO && DEMO[t.id];
      const has = d && (d.aud_female!=null || d.aud_male!=null || d.aud_18_24!=null || d.aud_country1);
      if(!has){ wrap.innerHTML=''; wrap.style.display='none'; return; }
      const genre = audSec('Genre', [audRow('Femmes', d.aud_female), audRow('Hommes', d.aud_male)]);
      const ages = [['18-24',d.aud_18_24],['25-34',d.aud_25_34],['13-17',d.aud_13_17],['35-44',d.aud_35_44],['45+',d.aud_45_plus]]
                     .filter(a => a[1]!=null).sort((a,b) => b[1]-a[1]);
      const age = audSec('Âge', ages.map(a => audRow(a[0], a[1])));
      const cs = [[d.aud_country1,d.aud_country1_pct],[d.aud_country2,d.aud_country2_pct],[d.aud_country3,d.aud_country3_pct]].filter(x => x[0]);
      const pays = audSec('Pays', cs.map(x => audRow(x[0], x[1])));
      wrap.innerHTML = '<div class="pv-aud-h">Audience</div>' + genre + age + pays;
      wrap.style.display = '';
    }

    function showPanel(t){
      if(!panel) return;
      currentTalent = t;
      panel.querySelector('.pv-uv').textContent = t.uv;
      panel.querySelector('.pv-nm').textContent = t.nm;
      panel.querySelector('.pv-hd').textContent = t.hd + ' · ' + t.plat;
      panel.querySelector('.pv-desc').textContent = t.desc;
      panel.querySelector('.pv-reach').textContent = t.reach;
      const soc = panel.querySelector('.pv-socials');
      if(soc){
        soc.innerHTML = '';
        const add = (url, label, svg) => {
          if(!url) return;
          const a = document.createElement('a');
          a.className = 'pv-social'; a.href = url; a.target = '_blank'; a.rel = 'noopener';
          a.setAttribute('aria-label', label + ' ' + t.nm); a.title = label;
          a.innerHTML = svg;
          soc.appendChild(a);
        };
        add(t.ig, 'Instagram', SOC_SVG.ig);
        add(t.tt, 'TikTok', SOC_SVG.tt);
        add(t.yt, 'YouTube', SOC_SVG.yt);
        soc.style.display = soc.children.length ? '' : 'none';
      }
      const mail = panel.querySelector('.pv-mail');
      if(mail){
        const addr = t.email || 'contact@hiving.me';
        mail.href = 'mailto:' + addr;
        mail.querySelector('.pv-mail-addr').textContent = addr;
        mail.style.display = '';
      }
      renderMetrics(t);
      renderAudience(t);
    }
    showPanel(TALENTS[0]);

    fetch(SB_URL + '/rest/v1/influencers?select=eco_id,current_metrics(platform,followers,engagement_rate,avg_views,avg_likes,avg_comments,growth_30d,posts_per_month)',
          { headers:{ apikey:SB_KEY, Authorization:'Bearer '+SB_KEY } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(rows => {
        METRICS = {};
        rows.forEach(row => { const b={}; (row.current_metrics||[]).forEach(cm => b[cm.platform]=cm); METRICS[row.eco_id]=b; });
        if(currentTalent) renderMetrics(currentTalent);
      })
      .catch(() => { /* le site fonctionne même si Supabase est indisponible */ });

    // démographie saisie à la main dans Supabase (colonnes aud_* ; peuvent ne pas exister encore → on ignore l'erreur)
    fetch(SB_URL + '/rest/v1/influencers?select=eco_id,aud_female,aud_male,aud_13_17,aud_18_24,aud_25_34,aud_35_44,aud_45_plus,aud_country1,aud_country1_pct,aud_country2,aud_country2_pct,aud_country3,aud_country3_pct',
          { headers:{ apikey:SB_KEY, Authorization:'Bearer '+SB_KEY } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(rows => {
        DEMO = {};
        rows.forEach(row => { DEMO[row.eco_id] = row; });
        if(currentTalent) renderAudience(currentTalent);
      })
      .catch(() => { /* colonnes démographie pas encore créées : aucun souci */ });

    /* ============================================================
       PAGE TALENT — fiche immersive plein écran au clic
       ============================================================ */
    // campagnes réelles (vidéos déjà dans media/, mêmes cartes que cases.html)
    const CAMP = {
      'eco-1':  [{v:'media/cerave-shana.mp4',              b:'CeraVe',              t:'CeraVe Awards'}],
      'eco-3':  [{v:'media/cerruti-hugo.mp4',              b:'Cerruti 1881',        t:'Tailoring italien'}],
      'eco-6':  [{v:'media/laroche-gael.mp4',              b:'La Roche-Posay',      t:'Skincare & performance'},
                 {v:'media/gael-friends.mp4',              b:'Gaël & Friends',      t:'15 000 personnes'}],
      'eco-7':  [{v:'media/adidas-pablo.mp4',              b:'adidas',              t:'Drop streetwear'},
                 {v:'media/bforbank-pablo.mp4',            b:'BforBank',            t:'Finance, version pop'},
                 {v:'media/celio-camaieu.mp4',             b:'Celio × Camaïeu',     t:'Outfit of the Day'},
                 {v:'media/kaporal-aimie-pablo.mp4',       b:'Kaporal',             t:'Denim en duo'},
                 {v:'media/monsaintlazare-pablo-aimie.mp4',b:'Mon Saint-Lazare',    t:'City lifestyle'}],
      'eco-10': [{v:'media/celio-camaieu.mp4',             b:'Celio × Camaïeu',     t:'Outfit of the Day'},
                 {v:'media/kaporal-aimie-pablo.mp4',       b:'Kaporal',             t:'Denim en duo'},
                 {v:'media/monsaintlazare-pablo-aimie.mp4',b:'Mon Saint-Lazare',    t:'City lifestyle'}],
      'eco-11': [{v:'media/wero-matteo.mp4',               b:'Wero',                t:'Paiement nouvelle génération'},
                 {v:'media/parmigiano-matteo.mp4',         b:'Parmigiano Reggiano', t:'Le goût, le vrai'}],
      'eco-18': [{v:'media/metro-jules.mp4',               b:'METRO',               t:'Les pros de la food'}],
      'eco-22': [{v:'media/levis-dricecook.mp4',           b:"Levi's",              t:"Une journée en Levi's"}]
    };

    // photo du talent : version HD dédiée si dispo, sinon la vignette du nœud (affichée en médaillon)
    const TP_HD = { 'eco-1':1, 'eco-2':1, 'eco-3':1, 'eco-4':1, 'eco-5':1, 'eco-6':1, 'eco-7':1, 'eco-8':1, 'eco-9':1, 'eco-10':1, 'eco-11':1, 'eco-12':1, 'eco-13':1, 'eco-14':1, 'eco-15':1, 'eco-16':1, 'eco-17':1, 'eco-20':1, 'eco-33':1 };
    // avatars officiels 320px (mieux que les vignettes) → médaillon, pas plein cadre
    const TP_MED = { 'eco-18':1, 'eco-19':1, 'eco-22':1, 'eco-23':1, 'eco-24':1, 'eco-26':1, 'eco-27':1, 'eco-30':1, 'eco-31':1, 'eco-32':1 };
    // photos en WebP (originaux JPEG conservés à côté)
    function talentPhoto(t){
      if(TP_HD[t.id])  return { src: '/media/talents/' + t.id + '.webp', hd: true };
      if(TP_MED[t.id]) return { src: '/media/talents/' + t.id + '.webp', hd: false };
      const n = nodes.find(x => x.data.id === t.id);
      const slot = n && n.el.querySelector('image-slot');
      const img = slot && slot.shadowRoot && slot.shadowRoot.querySelector('img[part=image]');
      if(img && img.src) return { src: img.src, hd: false };
      return null;
    }

    // PRNG déterministe (la courbe d'un talent ne change pas à chaque ouverture)
    function hseed(str){ let h = 2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    function mulberry32(a){ return function(){ a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

    // série mensuelle (12 pts) ancrée sur le VRAI nombre d'abonnés actuel (Supabase) ;
    // le dernier mois utilise growth_30d réel dès qu'il existe.
    function tpSeries(t, plat, cur, growth30){
      const r = mulberry32(hseed(t.id + plat));
      const n = 12;
      let base = cur > 2e6 ? 0.009 : cur > 8e5 ? 0.014 : cur > 3e5 ? 0.020 : 0.028;
      base *= (0.8 + r() * 0.5);
      const gs = [];
      for(let i=0;i<n-1;i++){
        let g = base * (0.5 + r() * 0.9);
        if(r() < 0.07) g *= (1.7 + r() * 1.4);      // mois viral occasionnel
        gs.push(g);
      }
      if(growth30 != null) gs[n-2] = Math.max(-0.5, growth30 / 100);
      const pts = [cur];
      for(let i = gs.length - 1; i >= 0; i--) pts.unshift(pts[0] / (1 + gs[i]));
      return pts.map(Math.round);
    }
    function tpMonths(){
      const f = new Intl.DateTimeFormat('fr-FR', { month:'short' });
      const out = [];
      for(let i=11;i>=0;i--){ const d = new Date(); d.setDate(1); d.setMonth(d.getMonth()-i); out.push(f.format(d).replace('.','')); }
      return out;
    }

    function tpCountUp(el, target, suffix){
      const t0 = performance.now(), dur = 1100;
      (function tick(now){
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtNum(Math.round(target * e)) + (suffix || '');
        if(p < 1) requestAnimationFrame(tick);
      })(t0);
    }

    // ---------- graphique croissance (SVG interactif) ----------
    function tpChart(host, t, m){
      const plats = [];
      if(m && m.tiktok && m.tiktok.followers)     plats.push(['tiktok','TikTok']);
      if(m && m.instagram && m.instagram.followers) plats.push(['instagram','Instagram']);
      if(!plats.length){ host.style.display = 'none'; return; }
      plats.sort((a,b) => (+m[b[0]].followers) - (+m[a[0]].followers));
      const months = tpMonths();
      host.innerHTML =
        '<div class="tpc__head"><div><div class="tpc__t">Croissance des abonnés</div>' +
        '<div class="tpc__sub">12 derniers mois · tendance</div></div>' +
        '<div class="tpc__right"><span class="tpc__delta"></span><div class="tpc__chips">' +
        plats.map((p,i) => '<button class="tpc__chip'+(i===0?' on':'')+'" data-p="'+p[0]+'">'+p[1]+'</button>').join('') +
        '</div></div></div><div class="tpc__wrap"><svg class="tpc__svg" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>' +
        '<div class="tpc__tip" hidden></div></div>';
      const svg = host.querySelector('.tpc__svg'), tip = host.querySelector('.tpc__tip'),
            delta = host.querySelector('.tpc__delta'), wrap = host.querySelector('.tpc__wrap');
      let pts = [], xs = [], ys = [];
      function render(plat){
        const d = m[plat];
        pts = tpSeries(t, plat, +d.followers, d.growth_30d != null ? +d.growth_30d : null);
        const W=600, H=220, L=10, R=10, T=16, B=30;
        const min = Math.min.apply(null, pts), max = Math.max.apply(null, pts), span = (max-min) || 1;
        xs = pts.map((_,i) => L + i * (W-L-R) / (pts.length-1));
        ys = pts.map(v => T + (H-T-B) * (1 - (v-min) / span * 0.92));
        let line = 'M' + xs[0] + ' ' + ys[0];
        for(let i=1;i<pts.length;i++){
          const cx = (xs[i-1] + xs[i]) / 2;
          line += ' C' + cx + ' ' + ys[i-1] + ' ' + cx + ' ' + ys[i] + ' ' + xs[i] + ' ' + ys[i];
        }
        const area = line + ' L' + xs[xs.length-1] + ' ' + (H-B) + ' L' + xs[0] + ' ' + (H-B) + ' Z';
        svg.innerHTML =
          '<defs><linearGradient id="tpg" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="var(--lime)" stop-opacity=".26"/>' +
          '<stop offset="1" stop-color="var(--lime)" stop-opacity="0"/></linearGradient></defs>' +
          '<path class="tpc__area" d="'+area+'" fill="url(#tpg)"/>' +
          '<path class="tpc__line" d="'+line+'"/>' +
          '<line class="tpc__cursor" y1="'+T+'" y2="'+(H-B)+'" hidden/>' +
          '<circle class="tpc__dot" r="4.5" hidden/>' +
          '<text class="tpc__ax" x="'+L+'" y="'+(H-8)+'">'+months[0]+'</text>' +
          '<text class="tpc__ax" x="'+(W/2)+'" y="'+(H-8)+'" text-anchor="middle">'+months[6]+'</text>' +
          '<text class="tpc__ax" x="'+(W-R)+'" y="'+(H-8)+'" text-anchor="end">'+months[11]+'</text>';
        const path = svg.querySelector('.tpc__line'), len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        requestAnimationFrame(() => { path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)'; path.style.strokeDashoffset = 0; });
        const g = (pts[pts.length-1] / pts[0] - 1) * 100;
        delta.textContent = (g >= 0 ? '+' : '') + Math.round(g) + '% / an';
      }
      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const fx = (e.clientX - r.left) / r.width * 600;
        let i = 0, best = 1e9;
        xs.forEach((x,k) => { const d = Math.abs(x-fx); if(d < best){ best = d; i = k; } });
        const dot = svg.querySelector('.tpc__dot'), cur = svg.querySelector('.tpc__cursor');
        dot.setAttribute('cx', xs[i]); dot.setAttribute('cy', ys[i]); dot.hidden = false;
        cur.setAttribute('x1', xs[i]); cur.setAttribute('x2', xs[i]); cur.hidden = false;
        tip.hidden = false;
        tip.innerHTML = '<b>' + fmtNum(pts[i]) + '</b> abonnés · ' + months[i];
        const tx = xs[i] / 600 * r.width;
        tip.style.left = Math.max(6, Math.min(r.width - tip.offsetWidth - 6, tx - tip.offsetWidth / 2)) + 'px';
        tip.style.top = (ys[i] / 220 * r.height - tip.offsetHeight - 12) + 'px';
      });
      wrap.addEventListener('mouseleave', () => {
        tip.hidden = true;
        const d = svg.querySelector('.tpc__dot'), c = svg.querySelector('.tpc__cursor');
        if(d) d.hidden = true; if(c) c.hidden = true;
      });
      host.querySelectorAll('.tpc__chip').forEach(ch => ch.addEventListener('click', () => {
        host.querySelectorAll('.tpc__chip').forEach(c => c.classList.remove('on'));
        ch.classList.add('on'); render(ch.dataset.p);
      }));
      render(plats[0][0]);
    }

    // ---------- construction / ouverture ----------
    let tpEl = null, tpIO = null;
    function ensureTP(){
      if(tpEl) return tpEl;
      tpEl = document.createElement('div');
      tpEl.className = 'tp';
      tpEl.innerHTML = '<div class="tp__scrim"></div><article class="tp__card" role="dialog" aria-modal="true">' +
        '<button class="tp__close" aria-label="Fermer">✕</button>' +
        '<div class="tp__hero"><div class="tp__hero-media"></div><div class="tp__hero-info"></div></div>' +
        '<div class="tp__body"></div></article>';
      document.body.appendChild(tpEl);
      tpEl.querySelector('.tp__scrim').addEventListener('click', closeTalent);
      tpEl.querySelector('.tp__close').addEventListener('click', closeTalent);
      return tpEl;
    }
    function tpTags(t, m, d){
      const tags = [t.uv];
      if(m){
        const ig = m.instagram, tt = m.tiktok;
        if(ig && tt) tags.push((+tt.followers > +ig.followers ? 'TikTok' : 'Instagram') + ' first');
        const er = Math.max(ig ? +ig.engagement_rate || 0 : 0, tt ? +tt.engagement_rate || 0 : 0);
        if(er >= 10) tags.push('Engagement très fort');
        else if(er >= 5) tags.push('Engagement solide');
        if(tt && +tt.avg_views >= 200000) tags.push(fmtNum(tt.avg_views) + ' vues / vidéo');
      }
      if(d && d.aud_18_24 != null) tags.push(Math.round(d.aud_18_24) + '% de 18-24 ans');
      if(CAMP[t.id]) tags.push(CAMP[t.id].length + ' campagne' + (CAMP[t.id].length > 1 ? 's' : '') + ' signée' + (CAMP[t.id].length > 1 ? 's' : ''));
      return tags;
    }
    function tpCommunity(t, m, d){
      const bits = [];
      if(d && d.aud_female != null) bits.push(Math.round(Math.max(d.aud_female, d.aud_male || 0)) + '% de ' + (d.aud_female >= (d.aud_male || 0) ? 'femmes' : 'hommes'));
      if(d && d.aud_18_24 != null) bits.push('cœur d\'audience 18-24 ans');
      if(d && d.aud_country1) bits.push('majoritairement ' + d.aud_country1);
      if(!bits.length && m){
        const tt = m.tiktok, ig = m.instagram;
        if(tt && ig) bits.push('une communauté construite d\'abord sur ' + (+tt.followers > +ig.followers ? 'TikTok' : 'Instagram'));
        const er = Math.max(ig ? +ig.engagement_rate || 0 : 0, tt ? +tt.engagement_rate || 0 : 0);
        if(er) bits.push('un taux d\'engagement de ' + fmtPct(er) + ' au meilleur de ses plateformes');
      }
      return bits.length ? 'Sa communauté : ' + bits.join(' · ') + '.' : '';
    }
    function openTalent(t, evt){
      const root = ensureTP();
      const card = root.querySelector('.tp__card');
      const m = METRICS && METRICS[t.id], d = DEMO && DEMO[t.id];
      // --- hero ---
      const photo = talentPhoto(t);
      const hero = root.querySelector('.tp__hero');
      hero.classList.toggle('tp__hero--lofi', !!(photo && !photo.hd));
      root.querySelector('.tp__hero-media').innerHTML = photo
        ? (!photo.hd ? '<img class="tp__hero-blur" src="' + photo.src + '" aria-hidden="true">' : '')
          + '<img class="tp__hero-img" src="' + photo.src + '" alt="' + t.nm + '">'
        : '<div class="tp__hero-fallback">' + t.nm.charAt(0) + '</div>';
      const igF = m && m.instagram && +m.instagram.followers || 0;
      const ttF = m && m.tiktok && +m.tiktok.followers || 0;
      const total = igF + ttF;
      // nom : dernier mot en serif italique (signature éditoriale du site)
      const words = t.nm.split(' ');
      const nmHTML = words.length > 1
        ? words.slice(0, -1).join(' ') + ' <em class="ital">' + words[words.length - 1] + '</em>'
        : t.nm + '<em class="ital">.</em>';
      root.querySelector('.tp__hero-info').innerHTML =
        '<div class="tp__uv">' + t.uv + ' · × Hiving</div>' +
        '<h2 class="tp__nm">' + nmHTML + '</h2>' +
        '<div class="tp__hd">' + t.hd + '</div>' +
        '<div class="tp__reach"><span class="tp__reach-n">0</span><span class="tp__reach-l">audience totale</span></div>';
      const oldWord = hero.querySelector('.tp__word'); if(oldWord) oldWord.remove();
      const word = document.createElement('div');
      word.className = 'tp__word'; word.setAttribute('aria-hidden', 'true');
      word.textContent = t.uv;
      hero.appendChild(word);
      // --- body ---
      const body = root.querySelector('.tp__body');
      let h = '';
      const idx = TALENTS.indexOf(t) + 1;
      h += '<div class="tp__eyebrow"><span class="rule"></span> Fiche talent <span class="tp__idx">N°' + String(idx).padStart(2, '0') + '</span></div>';
      h += '<p class="tp__desc">' + t.desc + '</p>';
      h += '<div class="tp__tags">' + tpTags(t, m, d).map(x => '<span class="tp__tag">' + x + '</span>').join('') + '</div>';
      if(m){
        h += '<div class="tp__stats">';
        if(m.instagram){
          const s = m.instagram;
          h += '<div class="tp__stat"><div class="tp__stat-h">' + SOC_SVG.ig + ' Instagram</div>' +
               '<div class="tp__stat-n">' + fmtNum(s.followers) + '</div>' +
               '<div class="tp__stat-s">' + [s.engagement_rate != null ? 'engagement ' + fmtPct(s.engagement_rate) : null, s.avg_likes != null ? fmtNum(s.avg_likes) + ' likes moy.' : null].filter(Boolean).join(' · ') + '</div></div>';
        }
        if(m.tiktok){
          const s = m.tiktok;
          h += '<div class="tp__stat"><div class="tp__stat-h">' + SOC_SVG.tt + ' TikTok</div>' +
               '<div class="tp__stat-n">' + fmtNum(s.followers) + '</div>' +
               '<div class="tp__stat-s">' + [s.engagement_rate != null ? 'engagement ' + fmtPct(s.engagement_rate) : null, s.avg_views != null ? fmtNum(s.avg_views) + ' vues moy.' : null].filter(Boolean).join(' · ') + '</div></div>';
        }
        h += '</div>';
      }
      h += '<div class="tpc"></div>';
      const community = tpCommunity(t, m, d);
      const hasAud = d && (d.aud_female != null || d.aud_18_24 != null || d.aud_country1);
      if(community || hasAud){
        h += '<div class="tp__comm">';
        if(community) h += '<p class="tp__comm-t">' + community + '</p>';
        if(hasAud){
          const genre = audSec('Genre', [audRow('Femmes', d.aud_female), audRow('Hommes', d.aud_male)]);
          const ages = [['18-24',d.aud_18_24],['25-34',d.aud_25_34],['13-17',d.aud_13_17],['35-44',d.aud_35_44],['45+',d.aud_45_plus]].filter(a => a[1] != null).sort((a,b) => b[1]-a[1]);
          const age = audSec('Âge', ages.map(a => audRow(a[0], a[1])));
          const cs = [[d.aud_country1,d.aud_country1_pct],[d.aud_country2,d.aud_country2_pct],[d.aud_country3,d.aud_country3_pct]].filter(x => x[0]);
          h += '<div class="tp__aud">' + genre + age + audSec('Pays', cs.map(x => audRow(x[0], x[1]))) + '</div>';
        }
        h += '</div>';
      }
      const camps = CAMP[t.id];
      if(camps){
        h += '<div class="tp__sec-t">Campagnes marquantes</div><div class="tp__camps">' +
             camps.map(c => '<figure class="tpcamp"><video src="' + c.v + '" muted loop playsinline preload="metadata"></video>' +
                            '<figcaption><b>' + c.b + '</b>' + c.t + '</figcaption></figure>').join('') + '</div>';
      }
      const addr = t.email || 'contact@hiving.me';
      h += '<div class="tp__cta"><span class="tp__script">on en parle ?</span><a class="tp__mail" href="mailto:' + addr + '">Travailler avec ' + t.nm.split(' ')[0] + ' <span>↗</span></a><div class="tp__soc">' +
           [t.ig ? '<a href="' + t.ig + '" target="_blank" rel="noopener" title="Instagram">' + SOC_SVG.ig + '</a>' : '',
            t.tt ? '<a href="' + t.tt + '" target="_blank" rel="noopener" title="TikTok">' + SOC_SVG.tt + '</a>' : '',
            t.yt ? '<a href="' + t.yt + '" target="_blank" rel="noopener" title="YouTube">' + SOC_SVG.yt + '</a>' : ''].join('') +
           '</div></div>';
      body.innerHTML = h;
      body.scrollTop = 0;
      Array.from(body.children).forEach((c,i) => c.style.setProperty('--i', i));
      // graphe
      tpChart(body.querySelector('.tpc'), t, m);
      // vidéos : lecture quand visibles dans le corps scrollable
      if(tpIO) tpIO.disconnect();
      const vids = body.querySelectorAll('.tpcamp video');
      if(vids.length){
        tpIO = new IntersectionObserver(es => es.forEach(x => {
          const v = x.target;
          if(x.isIntersecting){ v.muted = true; v.play().catch(() => {}); } else v.pause();
        }), { root: body, threshold: 0.4 });
        vids.forEach(v => tpIO.observe(v));
      }
      // --- ouverture : reveal circulaire depuis le point de clic ---
      document.body.classList.add('tp-open');
      root.classList.add('on');
      const rect = card.getBoundingClientRect();
      const cx = ((evt && evt.clientX) || innerWidth/2) - rect.left;
      const cy = ((evt && evt.clientY) || innerHeight/2) - rect.top;
      const R = Math.ceil(Math.hypot(Math.max(cx, rect.width - cx), Math.max(cy, rect.height - cy)) * 1.05);
      card.style.clipPath = 'circle(30px at ' + cx + 'px ' + cy + 'px)';
      void card.offsetWidth;
      requestAnimationFrame(() => {
        root.classList.add('open');
        card.style.clipPath = 'circle(' + R + 'px at ' + cx + 'px ' + cy + 'px)';
      });
      setTimeout(() => { if(root.classList.contains('open')) card.style.clipPath = 'none'; }, 800);
      if(total) tpCountUp(root.querySelector('.tp__reach-n'), total);
      else root.querySelector('.tp__reach-n').textContent = t.reach;
    }
    function closeTalent(){
      if(!tpEl || !tpEl.classList.contains('open')) return;
      if(tpIO) tpIO.disconnect();
      tpEl.querySelectorAll('video').forEach(v => v.pause());
      tpEl.classList.remove('open');
      document.body.classList.remove('tp-open');
      setTimeout(() => tpEl.classList.remove('on'), 420);
    }

    // hover behaviour
    let filter = 'Tous';
    function applyHover(activeId){
      nodes.forEach(n => {
        const inFilter = (filter==='Tous' || n.data.uv===filter);
        n.el.classList.toggle('dim', !inFilter);
      });
      lineEls.forEach(l => {
        const touch = activeId && (l.a.id===activeId || l.b.id===activeId);
        const inFilter = (filter==='Tous' || l.uv===filter);
        l.el.classList.toggle('hot', !!touch && inFilter);
        l.el.style.opacity = inFilter ? '' : '0.04';
      });
    }
    // hover = aperçu dans le panneau ; clic = ouvre la page talent immersive
    nodes.forEach(n => {
      n.el.addEventListener('mouseenter', () => { showPanel(n.data); applyHover(n.data.id); n.el.classList.add('hot'); });
      n.el.addEventListener('mouseleave', () => { applyHover(null); n.el.classList.remove('hot'); });
      n.el.addEventListener('click', (e) => { e.stopPropagation(); openTalent(n.data, e); });
    });
    document.addEventListener('keydown', (e) => { if(e.key==='Escape') closeTalent(); });

    // filter chips
    document.querySelectorAll('.eco__chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.eco__chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active'); filter = chip.dataset.f;
        applyHover(null);
        if(filter!=='Tous'){ const first = TALENTS.find(t => t.uv===filter); if(first) showPanel(first); }
      });
    });

    // gentle drift (motion-aware, controllable via tweaks)
    const floats = nodes.map(n => n.el.querySelector('.node__float'));
    let driftAnims = [];
    function clearDrift(){ driftAnims.forEach(a => { try{ a.cancel(); }catch(e){} }); driftAnims = []; }
    function buildDrift(mode){
      clearDrift();
      if(reduce || mode === 'calme') return;
      if(window.matchMedia('(max-width:860px)').matches) return;   // static grid on mobile
      const amp = mode === 'cinema' ? 17 : 9;
      const spd = mode === 'cinema' ? 0.72 : 1;
      floats.forEach((f,i) => {
        const dx = (Math.random()*2-1)*amp, dy = (Math.random()*2-1)*amp;
        const dur = (6000 + Math.random()*4000)*spd;
        driftAnims.push(f.animate(
          [{transform:'translate(0,0)'},{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],
          { duration:dur, iterations:Infinity, easing:'ease-in-out', delay:i*180 }
        ));
      });
    }
    HIVING.setMotion = buildDrift;
    const initMode = document.body.classList.contains('motion-calme') ? 'calme'
                   : document.body.classList.contains('motion-cinema') ? 'cinema' : 'vivant';
    buildDrift(initMode);
  }

  /* ---------- subtle parallax ---------- */
  if(!reduce){
    const plx = [...document.querySelectorAll('[data-parallax]')];
    if(plx.length){
      const run = () => {
        const vh = window.innerHeight;
        for(const el of plx){
          const r = el.getBoundingClientRect();
          if(r.bottom < -120 || r.top > vh+120) continue;
          const sp = parseFloat(el.dataset.parallax)||0.1;
          el.style.transform = `translateY(${((r.top + r.height/2 - vh/2)*sp*-1).toFixed(1)}px)`;
        }
        requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }
  }

  /* ============================================================
     SITE-WIDE INTERACTIVE WAVE FIELD
     dot grid · mouse repel · click ripples
     ============================================================ */
  (function waveField(){
    if (window.HIVING_LOWP) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'wave-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    const GAP = 34;
    let w, h, dpr, cols, rows, t0 = performance.now();
    const mouse = { x:-9999, y:-9999 };
    let ripples = [];
    let color = '28,90,62';

    function hexToRgb(hex){
      hex = String(hex).trim().replace('#','');
      if(hex.length === 3) hex = hex.replace(/./g, c => c + c);
      if(hex.length < 6) return null;
      const n = parseInt(hex.slice(0,6), 16);
      if(Number.isNaN(n)) return null;
      return ((n>>16)&255) + ',' + ((n>>8)&255) + ',' + (n&255);
    }
    function readColor(){
      const c = getComputedStyle(document.documentElement).getPropertyValue('--forest');
      const rgb = hexToRgb(c); if(rgb) color = rgb;
    }
    readColor();
    window.addEventListener('tweakchange', () => setTimeout(readColor, 30));

    function resize(){
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      cols = Math.ceil(w/GAP)+1; rows = Math.ceil(h/GAP)+1;
    }
    resize();
    window.addEventListener('resize', resize);

    // static render for reduced motion
    if(reduce){
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<cols;i++) for(let j=0;j<rows;j++){
        ctx.fillStyle = 'rgba('+color+',0.16)';
        ctx.beginPath(); ctx.arc(i*GAP, j*GAP, 1, 0, 6.2832); ctx.fill();
      }
      return;
    }

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive:true });
    window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });
    const addRipple = (x,y) => { ripples.push({ x, y, t:performance.now() }); if(ripples.length > 7) ripples.shift(); };
    window.addEventListener('click', (e) => addRipple(e.clientX, e.clientY));
    window.addEventListener('touchstart', (e) => { const tt = e.touches[0]; if(tt) addRipple(tt.clientX, tt.clientY); }, { passive:true });
    HIVING.waveRipples = () => ripples.length;

    const RDUR = 1600;        // ripple lifetime (ms)
    const MR = 140;           // mouse radius
    const BAND = 78;          // ripple ring thickness

    function frame(now){
      const time = (now - t0)/1000;
      ctx.clearRect(0,0,w,h);
      ripples = ripples.filter(r => now - r.t < RDUR);
      const maxR = Math.hypot(w,h)*0.62;
      for(let i=0;i<cols;i++){
        for(let j=0;j<rows;j++){
          const bx = i*GAP, by = j*GAP;
          // ambient breathing
          let ox = Math.sin(bx*0.010 + by*0.012 + time*0.65)*1.5;
          let oy = Math.cos(bx*0.013 - by*0.006 - time*0.5)*1.5;
          let glow = (Math.sin(bx*0.010 + by*0.012 + time*0.65)+1)*0.04;
          // mouse repel
          const dx = bx-mouse.x, dy = by-mouse.y, d2 = dx*dx+dy*dy;
          if(d2 < MR*MR){ const d = Math.sqrt(d2)||1, f = 1-d/MR; ox += (dx/d)*f*18; oy += (dy/d)*f*18; if(f>glow) glow = f; }
          // ripples
          for(const r of ripples){
            const age = (now - r.t)/RDUR;
            const radius = age*maxR;
            const rdx = bx-r.x, rdy = by-r.y, dist = Math.sqrt(rdx*rdx+rdy*rdy);
            const diff = Math.abs(dist - radius);
            if(diff < BAND){
              const s = (1 - diff/BAND) * (1 - age);
              const dd = dist||1;
              ox += (rdx/dd)*s*30; oy += (rdy/dd)*s*30;
              if(s>glow) glow = s;
            }
          }
          const a = Math.min(0.82, 0.17 + glow*0.6);
          const rad = 1.15 + glow*1.7;
          ctx.fillStyle = 'rgba('+color+','+a.toFixed(3)+')';
          ctx.beginPath(); ctx.arc(bx+ox, by+oy, rad, 0, 6.2832); ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
})();

/* ============================================================
   SCROLL-EXPAND HERO — vanilla port of the 21st.dev
   ScrollExpandMedia effect. Scroll-jacks the intro: the Cannes
   film grows from a small card to full-bleed while the Hiving
   Night photo fades and the title parts; then the page releases.
   ============================================================ */
(function scrollExpandHero(){
  'use strict';
  const se = document.querySelector('[data-se]');
  if(!se) return;
  const header = se.closest('.hero');
  const reveal = header.querySelector('[data-se-reveal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let progress = 0;        // 0 → 1 expansion
  let expanded = false;    // film fully open, page scroll released
  let showContent = false; // reveal band visible
  let touchStartY = 0;
  let mobile = window.innerWidth < 768;

  document.body.classList.add('se-active');

  function dims(){
    const vw = window.innerWidth, vh = window.innerHeight;
    mobile = vw < 768;
    const finalH = Math.min(vh * 0.88, mobile ? 760 : 1040);
    const finalW = Math.min(vw * 0.95, finalH * 0.66);   // portrait-friendly box
    const baseW = mobile ? 200 : 240, baseH = mobile ? 290 : 340;
    return {
      w: baseW + progress * (finalW - baseW),
      h: baseH + progress * (finalH - baseH),
      tx: progress * (mobile ? 64 : 46)                  // title parting in vw
    };
  }

  function apply(){
    const d = dims();
    se.style.setProperty('--se-w', d.w + 'px');
    se.style.setProperty('--se-h', d.h + 'px');
    se.style.setProperty('--se-tx', d.tx + 'vw');
    se.style.setProperty('--se-p', progress.toFixed(4));
    header.classList.toggle('se-content', showContent);
    document.body.classList.toggle('se-open', expanded);
  }

  function setProgress(p){
    progress = Math.min(1, Math.max(0, p));
    if(progress >= 1){ expanded = true; showContent = true; }
    else if(progress < 0.75){ showContent = false; }
    apply();
  }

  // reduced motion / fallback: skip the scroll-jack, show it open
  if(reduce){ progress = 1; expanded = true; showContent = true; apply(); return; }

  apply();

  // keep the muted film rolling (autoplay is allowed muted, but nudge it)
  const video = se.querySelector('.se__video');
  const nudgePlay = () => { if(video && video.paused){ video.play().catch(()=>{}); } };
  if(video){ video.addEventListener('canplay', nudgePlay); nudgePlay(); }

  function onWheel(e){
    if(expanded && e.deltaY < 0 && window.scrollY <= 5){
      // scrolling back up at the very top → re-arm the collapse
      expanded = false;
      apply();
      e.preventDefault();
    } else if(!expanded){
      e.preventDefault();
      setProgress(progress + e.deltaY * 0.0009);
    }
  }
  function onTouchStart(e){ touchStartY = e.touches[0].clientY; }
  function onTouchMove(e){
    if(!touchStartY) return;
    const y = e.touches[0].clientY, dy = touchStartY - y;
    if(expanded && dy < -20 && window.scrollY <= 5){
      expanded = false; apply(); e.preventDefault();
    } else if(!expanded){
      e.preventDefault();
      const factor = dy < 0 ? 0.008 : 0.005;
      setProgress(progress + dy * factor);
      touchStartY = y;
    }
  }
  function onTouchEnd(){ touchStartY = 0; }
  function onScroll(){ if(!expanded) window.scrollTo(0, 0); }

  window.addEventListener('wheel', onWheel, { passive:false });
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('touchstart', onTouchStart, { passive:false });
  window.addEventListener('touchmove', onTouchMove, { passive:false });
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('resize', apply);
  nudgePlay();

  // anchor links must escape the intro lock: jump the film open, then navigate
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => { if(!expanded){ setProgress(1); } });
  });
})();

/* ============================================================
   ROBUST VIDEOS — lazy-load + auto-retry
   Loads each film only when it scrolls into view (and one at a
   time), instead of firing 4 large requests at once and saturating
   the dev server — which is what made them fail to appear.
   ============================================================ */
(function robustVideos(){
  'use strict';
  const vids = [...document.querySelectorAll('.case__video, .se__video')];
  if(!vids.length) return;
  const play = v => { const p = v.play(); if(p && p.catch) p.catch(()=>{}); };

  // On a failed/aborted load, reload after a short backoff. The browser
  // won't re-fetch a URL that already errored, so we cache-bust each retry.
  vids.forEach(v => {
    let retries = 0;
    v.addEventListener('error', () => {
      if(retries++ >= 6) return;
      setTimeout(() => {
        const base = (v.getAttribute('src') || '').split('?')[0];
        v.setAttribute('src', base + '?r=' + retries);
        try { v.load(); } catch(e){}
        if(v.dataset.inview === '1') v.addEventListener('canplay', () => play(v), { once:true });
      }, 300 * retries);
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      v.dataset.inview = e.isIntersecting ? '1' : '0';
      if(e.isIntersecting){
        if(v.preload === 'none') v.preload = 'auto';
        if(v.readyState === 0){ try { v.load(); } catch(err){} }
        play(v);
      } else {
        v.pause();
      }
    });
  }, { threshold:0.2, rootMargin:'250px 0px' });
  vids.forEach(v => io.observe(v));
})();

/* whole Hiving Food card clickable (the pop invites the click) */
(function foodCardClick(){
  'use strict';
  const food = document.querySelector('.food');
  if(!food) return;
  const link = food.querySelector('a[href]');
  if(!link) return;
  food.addEventListener('click', e => {
    if(e.target.closest('a, button')) return;   // real links/buttons keep working
    window.open(link.href, link.target || '_self', 'noopener');
  });
})();

/* ============================================================
   CUSTOM DIRECTIONAL CURSOR
   A trailing ring that stretches toward the movement direction
   (squash & stretch along the velocity vector) + an exact dot.
   In addition to the wave-field bg and word-hover effects.
   ============================================================ */
(function directionalCursor(){
  'use strict';
  if(window.HIVING_LOWP) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.setAttribute('aria-hidden','true');
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';  dot.setAttribute('aria-hidden','true');
  document.body.appendChild(ring); document.body.appendChild(dot);
  document.documentElement.classList.add('has-cursor');
  ring.style.opacity = '0'; dot.style.opacity = '0';   // appear on first move

  let mx = window.innerWidth/2, my = window.innerHeight/2;   // target (real pointer)
  let dx = mx, dy = my;                                      // dot position (snappy)
  let rx = mx, ry = my;                                      // ring position (trailing)
  let active = false;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if(!active){
      active = true;
      dx = rx = mx; dy = ry = my;               // resynchronise (pas de traversée d'écran)
      ring.style.opacity = ''; dot.style.opacity = '';
    }
  }, { passive:true });
  // la souris sort de la fenêtre (ou l'app perd le focus) → on cache ET on ré-arme
  const hideCursor = () => { active = false; ring.style.opacity = '0'; dot.style.opacity = '0'; };
  document.addEventListener('mouseleave', hideCursor);
  window.addEventListener('blur', hideCursor);

  function frame(){
    // dot: tight follow
    dx += (mx - dx) * 0.4;
    dy += (my - dy) * 0.4;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;

    // ring: trails, and stretches along its own velocity (the "direction" cue)
    const nrx = rx + (mx - rx) * 0.16;
    const nry = ry + (my - ry) * 0.16;
    const vx = nrx - rx, vy = nry - ry;
    rx = nrx; ry = nry;
    const speed = Math.min(Math.hypot(vx, vy), 55) / 55;          // 0..1
    const ang = Math.atan2(vy, vx) * 180 / Math.PI;
    const sx = 1 + speed * 0.65;                                  // stretch in motion dir
    const sy = 1 - speed * 0.40;                                  // squash perpendicular
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) rotate(${ang}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // grow + fill over interactive targets
  const HIT = 'a, button, .node, .eco__chip, .food, .plateau, [role="button"], input, label';
  document.addEventListener('mouseover', e => {
    if(e.target.closest && e.target.closest(HIT)){ ring.classList.add('cursor-ring--lg'); dot.classList.add('cursor-dot--lg'); }
  });
  document.addEventListener('mouseout', e => {
    if(e.target.closest && e.target.closest(HIT)){ ring.classList.remove('cursor-ring--lg'); dot.classList.remove('cursor-dot--lg'); }
  });
})();

/* ============================================================
   CTA IMAGE TRAIL
   Drops a photo along the cursor path (cycling through the set);
   each pops in then shrinks away. Vanilla port of the React
   "image-trail" (21st.dev danielpetho) — no framer-motion.
   ============================================================ */
(function ctaImageTrail(){
  'use strict';
  if(window.HIVING_LOWP) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.querySelector('[data-cta-trail]');
  if(!layer) return;
  const section = layer.parentElement;

  const N = 17;
  const SRCS = Array.from({length:N}, (_,i) => 'media/trail/trail-' + String(i+1).padStart(2,'0') + '.jpg');
  SRCS.forEach(s => { const im = new Image(); im.src = s; });   // preload

  const INTERVAL = 78;   // min ms between drops
  const MIN_DIST = 22;   // min px moved between drops (velocity-aware)
  const ROT = 16;        // ± rotation range (deg)
  let idx = 0, lastX = 0, lastY = 0, lastT = 0, primed = false;

  function spawn(x, y){
    const el = document.createElement('div');
    el.className = 'trail-img';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    const img = document.createElement('img');
    img.src = SRCS[idx]; img.alt = ''; img.decoding = 'async';
    idx = (idx + 1) % N;
    el.appendChild(img);
    layer.appendChild(el);

    const rot = (Math.random() - 0.5) * ROT * 2;
    const base = 'translate(-50%,-50%) rotate(' + rot.toFixed(2) + 'deg) ';
    const anim = el.animate([
      { transform: base + 'scale(0.35)', opacity: 0 },
      { transform: base + 'scale(1.12)', opacity: 1, offset: 0.18 },
      { transform: base + 'scale(1)',    opacity: 1, offset: 0.42 },
      { transform: base + 'scale(0)',    opacity: 0 }
    ], { duration: 900, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
    anim.onfinish = () => el.remove();
  }

  section.addEventListener('pointermove', e => {
    if(e.pointerType === 'touch') return;
    const r = layer.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if(x < 0 || y < 0 || x > r.width || y > r.height) return;
    const now = performance.now();
    if(!primed){ primed = true; lastX = x; lastY = y; lastT = now; return; }
    if(now - lastT < INTERVAL) return;
    if(Math.hypot(x - lastX, y - lastY) < MIN_DIST) return;
    lastT = now; lastX = x; lastY = y;
    spawn(x, y);
  }, { passive:true });
})();

/* ============================================================
   UNIVERSE ROWS → live network
   Clicking "Lifestyle" / "Sport" in the "Deux univers" section
   jumps to the ecosystem ("Pas des influenceurs. Des médias.")
   and activates the matching filter — they're now connected.
   ============================================================ */
(function universeLinks(){
  'use strict';
  const MAP = { 'uni-lifestyle':'Lifestyle', 'uni-sport':'Sport' };
  const eco = document.getElementById('talents');
  document.querySelectorAll('.uni[data-slot]').forEach(u => {
    const f = MAP[u.dataset.slot];
    if(!f) return;
    u.setAttribute('role', 'link');
    u.setAttribute('tabindex', '0');
    const go = () => {
      if(eco) eco.scrollIntoView({ behavior:'smooth', block:'start' });
      const chip = document.querySelector('.eco__chip[data-f="' + f + '"]');
      if(chip) chip.click();
    };
    u.addEventListener('click', go);
    u.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
  });
})();

/* ============================================================
   CASES — HORIZONTAL SCROLL GALLERY
   The section pins; scrolling vertically slides the video track
   horizontally. Videos auto-play when visible (no hover needed).
   First frames loaded one-by-one (WEBrick-safe).
   ============================================================ */
(function hscrollGallery(){
  'use strict';
  const sec = document.querySelector('[data-hscroll]');
  if(!sec) return;
  const track = sec.querySelector('[data-hscroll-track]');
  if(!track) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vids = [...track.querySelectorAll('video')];

  // ---- sequential first-frame loader (avoids saturating the dev server) ----
  let queue = vids.slice(), busy = false;
  function pump(){
    if(busy) return;
    const v = queue.shift();
    if(!v) return;
    busy = true;
    let tries = 0;
    const next = () => { busy = false; pump(); };
    const onLoaded = () => { try{ v.pause(); v.currentTime = 0; }catch(e){} cleanup(); next(); };
    const onError = () => { cleanup(); if(tries++ < 4){ setTimeout(() => { const base=(v.getAttribute('src')||'').split('?')[0]; v.setAttribute('src', base+'?r='+tries); attach(); try{ v.load(); }catch(e){} }, 250*tries); } else next(); };
    function attach(){ v.addEventListener('loadeddata', onLoaded, {once:true}); v.addEventListener('error', onError, {once:true}); }
    function cleanup(){ v.removeEventListener('loadeddata', onLoaded); v.removeEventListener('error', onError); }
    v.preload = 'auto'; attach();
    try{ v.load(); }catch(e){ onError(); }
  }
  const startIO = new IntersectionObserver((es) => {
    es.forEach(e => { if(e.isIntersecting){ startIO.disconnect(); pump(); } });
  }, { rootMargin:'400px 0px' });
  startIO.observe(sec);

  // play the videos currently within the horizontal viewport, pause the rest
  function playVisible(){
    const vw = window.innerWidth;
    vids.forEach(v => {
      const r = v.getBoundingClientRect();
      const vis = r.right > -40 && r.left < vw + 40 && r.bottom > 0 && r.top < window.innerHeight;
      if(vis){ if(v.paused){ const p = v.play(); if(p && p.catch) p.catch(() => {}); } }
      else if(!v.paused){ v.pause(); }
    });
  }

  if(reduce){ playVisible(); window.addEventListener('scroll', playVisible, { passive:true }); return; }

  // ---- pinned horizontal translate driven by vertical scroll ----
  let dist = 0;
  function measure(){
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    sec.style.height = (window.innerHeight + dist) + 'px';
  }
  let ticking = false;
  function update(){
    ticking = false;
    const total = sec.offsetHeight - window.innerHeight;
    const top = sec.getBoundingClientRect().top;
    const p = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
    track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
    playVisible();
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }

  measure(); update();
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', () => { measure(); update(); });
})();

/* ============================================================
   MOBILE NAV — burger toggle
   ============================================================ */
(function mobileNav(){
  'use strict';
  const burger = document.querySelector('[data-nav-burger]');
  const menu = document.querySelector('[data-nav-mobile]');
  if(!burger || !menu) return;
  function setOpen(open){
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  burger.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', e => { if(e.key === 'Escape') setOpen(false); });
})();
