/* Simple JS for interactivity (demo only) */
const mockProviders = [
  {id:1,name:'Alex Johnson',category:'Electrician',loc:'New York, NY',rate:45,rating:4.8,desc:'Certified electrician, 7 years experience',email:'alex@example.com'},
  {id:2,name:'Priya Patel',category:'Cleaner',loc:'Jersey City, NJ',rate:25,rating:4.6,desc:'Home & office cleaner, reliable',email:'priya@example.com'},
  {id:3,name:'Marcus Lee',category:'Plumber',loc:'Brooklyn, NY',rate:40,rating:4.7,desc:'Plumbing repairs, quick response',email:'marcus@example.com'},
  {id:4,name:'Sara Gomez',category:'Tutor',loc:'Queens, NY',rate:30,rating:4.9,desc:'Math & science tutor, patient',email:'sara@example.com'},
  {id:5,name:'Lina Ross',category:'Babysitter',loc:'Bronx, NY',rate:20,rating:4.5,desc:'Experienced babysitter, CPR certified',email:'lina@example.com'}
];

const mockReviews = [
  {name:'Nina',rating:5,text:'Great service and on time!',providerId:1},
  {name:'Omar',rating:4,text:'Good work, affordable',providerId:3},
  {name:'Jaya',rating:5,text:'Very helpful and friendly',providerId:2}
];

function el(q){return document.querySelector(q)}
function els(q){return Array.from(document.querySelectorAll(q))}

// render service cards on home
function renderHomeServices(){
  const container = el('#serviceCards');
  if(!container) return;
  container.innerHTML = '';
  const categories = ['Electrician','Plumber','Cleaner','Tutor','Babysitter'];
  categories.forEach(cat=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h3>${cat}</h3><p>Find reliable ${cat.toLowerCase()}s in your area.</p><p><a class="btn" href="services.html?cat=${encodeURIComponent(cat)}">Explore</a></p>`;
    container.appendChild(div);
  });
}

// render providers list on services page
function renderProviders(filter=''){
  const list = el('#providersList');
  if(!list) return;
  list.innerHTML = '';
  const qcat = new URLSearchParams(location.search).get('cat') || '';
  mockProviders.filter(p=>{
    if(qcat && p.category !== qcat) return false;
    if(filter){
      const t = filter.toLowerCase();
      return (p.name+' '+p.category+' '+p.loc+' '+p.desc).toLowerCase().includes(t);
    }
    return true;
  }).forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card provider-card';
    div.innerHTML = `<img src="assets/avatar.png" alt=""><div><h3>${p.name}</h3><p class="muted">${p.category} • ${p.loc}</p><p>${p.desc}</p><p><strong>$${p.rate}/hr</strong> • ${p.rating} ★</p><p><a class="btn" href="profile.html?id=${p.id}">View profile</a></p></div>`;
    list.appendChild(div);
  });
  // update admin stats if present
  const statP = el('#statProviders'); if(statP) statP.textContent = mockProviders.length;
  const statR = el('#statReviews'); if(statR) statR.textContent = mockReviews.length;
  const statPending = el('#statPending'); if(statPending) statPending.textContent = 2;
}

// basic profile rendering
function renderProfile(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || 1;
  const p = mockProviders.find(x=>x.id===id) || mockProviders[0];
  const nameEl = el('#profileName'); if(nameEl) nameEl.textContent = p.name;
  const catEl = el('#profileCategory'); if(catEl) catEl.textContent = `${p.category} • ${p.rating} ★`;
  const bioEl = el('#profileBio'); if(bioEl) bioEl.textContent = p.desc;
  const locEl = el('#profileLocation'); if(locEl) locEl.textContent = p.loc;
  const rateEl = el('#profileRate'); if(rateEl) rateEl.textContent = `$${p.rate} / hr`;
  const contactEl = el('#profileContact'); if(contactEl){ contactEl.textContent = p.email; contactEl.href = 'mailto:'+p.email; }
  // reviews for this provider
  const rlist = el('#profileReviews'); if(rlist){
    rlist.innerHTML = '';
    mockReviews.filter(r=>r.providerId===p.id).forEach(r=>{
      const d = document.createElement('div'); d.className='card'; d.innerHTML = `<strong>${r.name}</strong> • ${r.rating} ★<p>${r.text}</p>`;
      rlist.appendChild(d);
    });
  }
}

// filter providers from input
function filterProviders(){
  const q = el('#serviceSearch') ? el('#serviceSearch').value : '';
  const cat = el('#filterCategory') ? el('#filterCategory').value : '';
  const list = el('#providersList');
  if(!list) return renderProviders();
  const term = q + (cat?(' '+cat):'');
  renderProviders(term.trim());
}

// search on homepage
function applySearch(){
  const q = el('#searchInput') ? el('#searchInput').value.trim() : '';
  const cat = el('#categorySelect') ? el('#categorySelect').value : '';
  const params = new URLSearchParams();
  if(cat) params.set('cat',cat);
  // send term as q param for services page filter
  if(q) params.set('q',q);
  location.href = 'services.html?' + params.toString();
}

// initialize reviews and home previews based on page
function init(){
  // toggle mobile nav
  const bt = el('.nav-toggle'); if(bt){ bt.addEventListener('click',()=> document.body.classList.toggle('nav-open')); }

  renderHomeServices();
  renderProviders();

  // if on services page, apply q param search
  if(location.pathname.endsWith('services.html')){
    const qs = new URLSearchParams(location.search).get('q')||'';
    if(qs) el('#serviceSearch').value = qs;
    const cats = new URLSearchParams(location.search).get('cat')||'';
    if(cats) el('#filterCategory').value = cats;
    filterProviders();
  }

  if(location.pathname.endsWith('profile.html')) renderProfile();
  if(location.pathname.endsWith('reviews.html')){
    const rcont = el('#allReviews');
    rcont.innerHTML = '';
    mockReviews.forEach(r=>{
      const d = document.createElement('div'); d.className='card'; d.innerHTML = `<strong>${r.name}</strong> • ${r.rating} ★<p>${r.text}</p>`;
      rcont.appendChild(d);
    });
  }

  // handle review submission
  window.submitReview = function(ev){
    ev.preventDefault();
    const name = el('#revName').value, rating = Number(el('#revRating').value), text = el('#revText').value;
    mockReviews.unshift({name,rating,text,providerId:1});
    alert('Thanks! Your review has been submitted (demo).');
    location.reload();
  };

  // contact form demo
  window.submitContact = function(ev){ ev.preventDefault(); alert('Message sent (demo). Thank you!'); ev.target.reset(); };

  // login/signup demos
  window.login = function(ev){ ev.preventDefault(); alert('Login simulated (demo).'); location.href='index.html'; };
  window.signup = function(ev){ ev.preventDefault(); alert('Account created (demo).'); location.href='index.html'; };

  // populate admin activity
  const act = el('#adminActivity'); if(act) act.innerHTML = '<ul><li>New provider signed up: Priya Patel</li><li>New review added: Nina</li></ul>';
}

window.addEventListener('DOMContentLoaded', init);
