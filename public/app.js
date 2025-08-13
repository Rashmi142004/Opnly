import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signInAnonymously, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, serverTimestamp, addDoc, collection, onSnapshot, orderBy, query, doc, setDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const heroLogin = document.getElementById('hero-login');
const heroAnon = document.getElementById('hero-anon');
const userChip = document.getElementById('user-chip');

const postText = document.getElementById('post-text');
const postMood = document.getElementById('post-mood');
const postAnon = document.getElementById('post-anon');
const postSubmit = document.getElementById('post-submit');
const feed = document.getElementById('feed');
const search = document.getElementById('search');

const MOODS = ['Anxiety','Healing','Grief','Numb','Hopeful'];
MOODS.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m; opt.textContent = m;
  postMood.appendChild(opt);
});

// Auth helpers
const provider = new GoogleAuthProvider();
loginBtn.addEventListener('click', () => signInWithPopup(auth, provider));
heroLogin.addEventListener('click', () => signInWithPopup(auth, provider));
signupBtn.addEventListener('click', async () => {
  const email = prompt('Email:');
  const pass = prompt('Password (min 6 chars):');
  if (!email || !pass) return;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    const name = email.split('@')[0];
    await updateProfile(auth.currentUser, { displayName: name });
  } catch (e) {
    alert(e.message);
  }
});
heroAnon.addEventListener('click', () => signInAnonymously(auth));

function showUserChip(user){
  userChip.classList.remove('hidden');
  const name = user.isAnonymous ? 'Anonymous' : (user.displayName || user.email || 'User');
  userChip.textContent = name;
}

function hideUserChip(){
  userChip.classList.add('hidden');
  userChip.textContent = '';
}

// Real-time feed
const qFeed = query(collection(db,'posts'), orderBy('createdAt','desc'));
onSnapshot(qFeed, (snap) => {
  const items = [];
  snap.forEach(docSnap => {
    const p = docSnap.data();
    items.push(renderPost({ id: docSnap.id, ...p }));
  });
  const q = (search.value || '').toLowerCase();
  const filtered = items.filter(el => {
    const text = el.dataset.text;
    const mood = el.dataset.mood;
    return !q || text.includes(q) || mood.includes(q);
  });
  feed.replaceChildren(...filtered);
});

// Search handler
search.addEventListener('input', () => {
  const cards = Array.from(feed.children);
  const q = (search.value || '').toLowerCase();
  cards.forEach(card => {
    const text = card.dataset.text;
    const mood = card.dataset.mood;
    const ok = !q || text.includes(q) || mood.includes(q);
    card.style.display = ok ? '' : 'none';
  });
});

// Create post
postSubmit.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) { alert('Please log in (or continue anonymously) to post.'); return; }
  const text = (postText.value || '').trim();
  const mood = postMood.value;
  const isAnonymous = !!postAnon.checked;
  if (!text) return;

  try {
    await addDoc(collection(db,'posts'), {
      text, mood,
      userId: user.uid,
      displayName: isAnonymous ? 'Anonymous' : (user.displayName || user.email || 'User'),
      isAnonymous,
      likesCount: 0,
      createdAt: serverTimestamp(),
    });
    postText.value='';
    postMood.value=MOODS[0];
    postAnon.checked=true;
  } catch (e) {
    alert(e.message);
  }
});

// Post renderer
function renderPost(p){
  const card = document.createElement('article');
  card.className = 'post';
  card.dataset.text = (p.text || '').toLowerCase();
  card.dataset.mood = (p.mood || '').toLowerCase();

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.alt = p.displayName || 'User';
  avatar.src = p.isAnonymous
    ? 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=80&h=80&fit=crop&crop=faces'
    : 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=80&h=80&fit=crop&crop=faces';

  const body = document.createElement('div');
  body.style.flex = '1';

  const head = document.createElement('div');
  head.className = 'post-head';
  const left = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'post-name';
  name.textContent = p.displayName || 'User';
  const time = document.createElement('div');
  time.className = 'post-time';
  time.textContent = p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : 'just now';
  left.appendChild(name);
  left.appendChild(time);
  const dots = document.createElement('div');
  dots.innerHTML = '⋯';
  head.appendChild(left);
  head.appendChild(dots);

  const text = document.createElement('p');
  text.textContent = p.text;

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = p.mood;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const likeBtn = document.createElement('div');
  likeBtn.className = 'action';
  likeBtn.innerHTML = `❤️ <span>${p.likesCount || 0}</span>`;
  likeBtn.addEventListener('click', () => toggleLike(p.id, likeBtn));

  actions.appendChild(likeBtn);

  body.appendChild(head);
  body.appendChild(text);
  body.appendChild(badge);
  body.appendChild(actions);

  card.appendChild(avatar);
  card.appendChild(body);
  return card;
}

// Likes (positive-only), per-user
import { getDoc as fbGetDoc, doc as fbDoc, setDoc as fbSetDoc, deleteDoc as fbDeleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

async function toggleLike(postId, likeBtn){
  const user = auth.currentUser;
  if (!user) { alert('Please log in (or continue anonymously) to react.'); return; }
  const likeRef = fbDoc(db, 'posts', postId, 'likes', user.uid);
  const snap = await fbGetDoc(likeRef);
  if (snap.exists()){
    // Unlike
    await fbDeleteDoc(likeRef);
  } else {
    // Like
    await fbSetDoc(likeRef, { userId: user.uid });
  }
  const span = likeBtn.querySelector('span');
  const n = parseInt(span.textContent||'0',10);
  span.textContent = snap.exists()? Math.max(0,n-1) : n+1;
}

// Auth state UI
onAuthStateChanged(auth, (user) => {
  if (user) {
    showUserChip(user);
  } else {
    hideUserChip();
  }
});
