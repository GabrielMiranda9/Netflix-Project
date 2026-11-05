/* Netflix Project - Iteração 2 (dados persistidos em localStorage) */
const K = {u:"np2_users", m:"np2_movies", r:"np2_reviews", f:"np2_favorites", c:"np2_current"};
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };

const defaultUsers = () => [
  {name:"Administrador", email:"admin@netflix.com", password:"1234", admin:true},
  {name:"Usuário Demo", email:"user@netflix.com", password:"1234", admin:false}];
const defaultMovies = () => [
  {id:1, title:"A Origem", type:"Filme", year:2010, genre:"Ficção", synopsis:"Um especialista em sonhos participa de uma missão para inserir uma ideia na mente de uma pessoa."},
  {id:2, title:"Stranger Things", type:"Série", year:2016, genre:"Mistério", synopsis:"Um grupo de jovens investiga acontecimentos misteriosos envolvendo sua cidade."},
  {id:3, title:"Interestelar", type:"Filme", year:2014, genre:"Ficção", synopsis:"Uma equipe viaja pelo espaço em busca de novas possibilidades para a humanidade."},
  {id:4, title:"The Last of Us", type:"Série", year:2023, genre:"Drama", synopsis:"Uma jornada atravessa um mundo transformado por uma ameaça global."},
  {id:5, title:"Batman", type:"Filme", year:2022, genre:"Ação", synopsis:"Um investigador enfrenta crimes e mistérios em Gotham."},
  {id:6, title:"Breaking Bad", type:"Série", year:2008, genre:"Drama", synopsis:"Um professor de química passa a produzir uma substância ilegal."}];
const defaultReviews = () => ({1:[r(5)], 2:[r(4)], 3:[r(5)], 4:[r(4)], 5:[r(4)], 6:[r(5)]});
function r(note) { return {email:"user@netflix.com", user:"Usuário Demo", note, comment:"Avaliação de demonstração."}; }

let users = load(K.u, null) || defaultUsers();
let movies = load(K.m, null) || defaultMovies();
let reviews = load(K.r, null) || defaultReviews();
let favorites = load(K.f, {});
let currentEmail = load(K.c, null);

function save() {
  localStorage.setItem(K.u, JSON.stringify(users)); localStorage.setItem(K.m, JSON.stringify(movies));
  localStorage.setItem(K.r, JSON.stringify(reviews)); localStorage.setItem(K.f, JSON.stringify(favorites));
  localStorage.setItem(K.c, JSON.stringify(currentEmail));
}
const cur = () => users.find(u => u.email === currentEmail) || null;
const msg = (id, text, ok = true) => { $(id).innerHTML = '<div class="msg ' + (ok ? "success" : "error") + '">' + esc(text) + "</div>"; };
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
const SECTIONS = ["auth","home","details","favorites","profile","admin"];
function show(id) { SECTIONS.forEach(x => $(x).classList.add("hidden")); $(id).classList.remove("hidden"); updateNav(); }
function updateNav() {
  const u = cur();
  ["homeBtn","favBtn","profileBtn","logoutBtn"].forEach(i => $(i).style.display = u ? "inline-block" : "none");
  $("adminBtn").style.display = u && u.admin ? "inline-block" : "none";
}
function requireLogin() {
  if (!cur()) { show("auth"); msg("loginMsg", "Faça login para acessar essa função.", false); return false; }
  return true;
}

/* Avaliações e nota média */
function avg(id) {
  const rs = reviews[id] || [];
  return rs.length ? Math.round(rs.reduce((s, x) => s + x.note, 0) / rs.length * 10) / 10 : null;
}
const ratingHtml = id => { const a = avg(id); return a === null ? '<span class="small">Sem avaliações</span>' : '<div class="rating">' + stars(Math.round(a)) + ' <span class="small">' + a.toFixed(1) + " (" + reviews[id].length + ")</span></div>"; };

/* Catálogo: busca, filtros e ordenação */
function fillGenres() {
  const sel = $("fGenre"), old = sel.value;
  const gs = [...new Set(movies.map(m => m.genre))].sort();
  sel.innerHTML = '<option value="">Todos os gêneros</option>' + gs.map(g => '<option>' + esc(g) + "</option>").join("");
  sel.value = gs.includes(old) ? old : "";
}
function renderResults() {
  const q = $("search").value.toLowerCase(), t = $("fType").value, g = $("fGenre").value, s = $("fSort").value;
  const list = movies.filter(m => (!q || m.title.toLowerCase().includes(q)) && (!t || m.type === t) && (!g || m.genre === g));
  list.sort((a, b) => s === "year" ? b.year - a.year : s === "rating" ? (avg(b.id) || 0) - (avg(a.id) || 0) : a.title.localeCompare(b.title));
  $("results").innerHTML = list.map(movieCard).join("") || "<p>Nenhum resultado encontrado.</p>";
}
const isFav = id => (favorites[currentEmail] || []).includes(id);
function movieCard(m) {
  return `<div class="movie"><span class="tag">${esc(m.type)}</span><span class="tag">${esc(m.genre)}</span><h3>${esc(m.title)}</h3><p class="small">${m.year}</p>${ratingHtml(m.id)}<p>${esc(m.synopsis)}</p><div class="actions"><button onclick="openDetails(${m.id})">Ver detalhes</button><button class="secondary" onclick="toggleFavorite(${m.id})">${isFav(m.id) ? "Remover favorito" : "Favoritar"}</button></div></div>`;
}
function openDetails(id) {
  if (!requireLogin()) return;
  const m = movies.find(x => x.id === id); if (!m) return;
  const rs = reviews[id] || [], mine = rs.find(x => x.email === currentEmail);
  $("detailsContent").innerHTML = `<button class="secondary" onclick="show('home')">← Voltar</button><h1>${esc(m.title)}</h1><span class="tag">${esc(m.type)} • ${m.year}</span><span class="tag">${esc(m.genre)}</span><p>${esc(m.synopsis)}</p>${ratingHtml(id)}<p><button onclick="toggleFavorite(${id})">${isFav(id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}</button></p><hr><h2>Avaliações</h2>${rs.length ? rs.map(x => `<div class="msg"><b>${esc(x.user)}</b> — ${x.note}/5<br>${esc(x.comment)}</div>`).join("") : "<p class='small'>Ainda não há avaliações.</p>"}<h3>${mine ? "Editar sua avaliação" : "Sua avaliação"}</h3><select id="note">${[5,4,3,2,1].map(n => `<option value="${n}"${mine && mine.note === n ? " selected" : ""}>${n}</option>`).join("")}</select><textarea id="comment" placeholder="Escreva sua avaliação...">${mine ? esc(mine.comment) : ""}</textarea><button onclick="addReview(${id})">Enviar avaliação</button>`;
  show("details");
}
function addReview(id) {
  const note = Number($("note").value), comment = $("comment").value.trim(), u = cur();
  if (!comment) { alert("Digite um comentário."); return; }
  reviews[id] = reviews[id] || [];
  const mine = reviews[id].find(x => x.email === u.email);
  if (mine) { mine.note = note; mine.comment = comment; mine.user = u.name; }
  else reviews[id].push({email:u.email, user:u.name, note, comment});
  save(); openDetails(id);
}
function toggleFavorite(id) {
  if (!requireLogin()) return;
  const a = favorites[currentEmail] = favorites[currentEmail] || [], i = a.indexOf(id);
  i >= 0 ? a.splice(i, 1) : a.push(id); save();
  if (!$("details").classList.contains("hidden")) openDetails(id);
  else if (!$("favorites").classList.contains("hidden")) renderFavorites(); else renderResults();
}
function renderFavorites() {
  if (!requireLogin()) return;
  const list = (favorites[currentEmail] || []).map(id => movies.find(m => m.id === id)).filter(Boolean);
  $("favoriteList").innerHTML = list.length ? list.map(movieCard).join("") : "<p>Você ainda não adicionou títulos aos favoritos.</p>";
  show("favorites");
}

/* Perfil */
function renderProfile() {
  if (!requireLogin()) return;
  const u = cur(); $("pName").value = u.name; $("pEmail").value = u.email; $("pPass").value = ""; $("profileMsg").innerHTML = "";
  show("profile");
}
function saveProfile(e) {
  e.preventDefault();
  const u = cur(), name = $("pName").value.trim(), pass = $("pPass").value;
  if (!name) { msg("profileMsg", "Informe o nome.", false); return; }
  if (pass && pass.length < 4) { msg("profileMsg", "A senha deve ter ao menos 4 caracteres.", false); return; }
  u.name = name; if (pass) u.password = pass;
  save(); msg("profileMsg", "Perfil atualizado."); $("pPass").value = "";
}

/* Administração */
function renderAdmin() {
  const me = cur();
  if (!me || !me.admin) { alert("Acesso restrito ao administrador."); return; }
  $("usersTable").innerHTML = `<table><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Ações</th></tr>${users.map((u, i) => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.admin ? "Administrador" : "Usuário"}</td><td>${u.email === me.email ? "—" : `<div class="actions"><button class="secondary" onclick="toggleAdmin(${i})">${u.admin ? "Tornar usuário" : "Tornar admin"}</button><button class="secondary" onclick="deleteUser(${i})">Excluir</button></div>`}</td></tr>`).join("")}</table>`;
  $("adminMovies").innerHTML = movies.map(m => `<div class="movie"><span class="tag">${esc(m.type)}</span><span class="tag">${esc(m.genre)}</span><h3>${esc(m.title)}</h3><p>${m.year}</p><div class="actions"><button class="secondary" onclick="editMovie(${m.id})">Editar</button><button class="secondary" onclick="deleteMovie(${m.id})">Excluir</button></div></div>`).join("");
  show("admin");
}
function toggleAdmin(i) { users[i].admin = !users[i].admin; save(); renderAdmin(); }
function deleteUser(i) {
  if (!confirm("Excluir este usuário?")) return;
  const em = users[i].email; users.splice(i, 1); delete favorites[em];
  Object.keys(reviews).forEach(k => reviews[k] = reviews[k].filter(x => x.email !== em));
  save(); renderAdmin();
}
function resetMovieForm() { $("movieForm").reset(); $("mId").value = ""; $("formTitle").textContent = "Adicionar conteúdo"; }
function editMovie(id) {
  const m = movies.find(x => x.id === id);
  $("mId").value = m.id; $("mTitle").value = m.title; $("mType").value = m.type; $("mYear").value = m.year; $("mGenre").value = m.genre; $("mSyn").value = m.synopsis;
  $("formTitle").textContent = "Editar conteúdo"; $("movieForm").scrollIntoView();
}
function saveMovie(e) {
  e.preventDefault();
  const data = {title:$("mTitle").value.trim(), type:$("mType").value, year:Number($("mYear").value), genre:$("mGenre").value.trim(), synopsis:$("mSyn").value.trim()};
  if (!data.title || !data.genre || !data.synopsis || !(data.year >= 1900 && data.year <= 2100)) { msg("adminMsg", "Preencha todos os campos corretamente.", false); return; }
  const id = Number($("mId").value);
  if (id) Object.assign(movies.find(m => m.id === id), data);
  else movies.push({id:Math.max(0, ...movies.map(m => m.id)) + 1, ...data});
  save(); resetMovieForm(); renderAdmin(); fillGenres(); msg("adminMsg", "Conteúdo salvo.");
}
function deleteMovie(id) {
  if (!confirm("Excluir este conteúdo?")) return;
  movies = movies.filter(m => m.id !== id); delete reviews[id];
  Object.keys(favorites).forEach(k => favorites[k] = favorites[k].filter(x => x !== id));
  save(); fillGenres(); renderAdmin();
}
function resetDemo() {
  if (!confirm("Restaurar todos os dados de demonstração?")) return;
  users = defaultUsers(); movies = defaultMovies(); reviews = defaultReviews(); favorites = {}; currentEmail = null;
  save(); fillGenres(); show("auth");
}

/* Autenticação */
function login(e) {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase(), pass = $("loginPassword").value;
  const u = users.find(x => x.email.toLowerCase() === email && x.password === pass);
  if (!u) { msg("loginMsg", "E-mail ou senha inválidos.", false); return; }
  currentEmail = u.email; save(); fillGenres(); show("home"); renderResults();
}
function register(e) {
  e.preventDefault();
  const name = $("regName").value.trim(), email = $("regEmail").value.trim().toLowerCase(), password = $("regPassword").value;
  if (!name || password.length < 4) { msg("registerMsg", "Informe o nome e uma senha com ao menos 4 caracteres.", false); return; }
  if (users.some(u => u.email.toLowerCase() === email)) { msg("registerMsg", "Este e-mail já está cadastrado.", false); return; }
  users.push({name, email, password, admin:false}); save();
  msg("registerMsg", "Cadastro realizado. Agora faça login."); $("registerForm").reset();
}
function logout() { currentEmail = null; save(); $("loginForm").reset(); $("loginMsg").innerHTML = ""; show("auth"); }

$("loginForm").addEventListener("submit", login);
$("registerForm").addEventListener("submit", register);
$("profileForm").addEventListener("submit", saveProfile);
$("movieForm").addEventListener("submit", saveMovie);
$("mCancel").addEventListener("click", resetMovieForm);
$("resetBtn").addEventListener("click", resetDemo);
["search","fType","fGenre","fSort"].forEach(i => $(i).addEventListener("input", renderResults));
$("homeBtn").addEventListener("click", () => { if (requireLogin()) { show("home"); renderResults(); } });
$("favBtn").addEventListener("click", renderFavorites);
$("profileBtn").addEventListener("click", renderProfile);
$("adminBtn").addEventListener("click", renderAdmin);
$("logoutBtn").addEventListener("click", logout);

fillGenres();
if (cur()) { show("home"); renderResults(); } else { currentEmail = null; show("auth"); }
