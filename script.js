const defaultNews=[
{id:1,cat:"Política",title:"El debate nacional marca la agenda de hoy",summary:"Las principales noticias y acontecimientos del día, con información clara y contexto para nuestros lectores.",image:"https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",featured:true},
{id:2,cat:"Sociedad",title:"Comunidades se preparan para una nueva jornada",summary:"Organizaciones y ciudadanos dieron a conocer las actividades previstas para los próximos días.",image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80"},
{id:3,cat:"Economía",title:"Mercados siguen atentos a los nuevos indicadores",summary:"Los analistas observan los datos publicados durante la jornada.",image:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80"},
{id:4,cat:"Mundo",title:"Las noticias internacionales que debe conocer",summary:"Un repaso por los acontecimientos más relevantes de las últimas horas.",image:"https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80"},
{id:5,cat:"Deportes",title:"La jornada deportiva deja nuevos protagonistas",summary:"Resultados, declaraciones y las historias que están marcando la actualidad.",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80"},
{id:6,cat:"Cultura",title:"Arte y cultura ocupan un lugar destacado",summary:"Eventos, propuestas y personajes de la escena cultural.",image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80"}
];
let news=JSON.parse(localStorage.getItem("lapalabra_news")||"null")||defaultNews;

document.getElementById("today").textContent=new Intl.DateTimeFormat("es-ES",{dateStyle:"full"}).format(new Date());

function render(filter="Todas"){
 const items=filter==="Todas"?news:news.filter(n=>n.cat===filter);
 const featured=items.find(n=>n.featured)||items[0];
 const hero=document.getElementById("featured");
 if(!featured){hero.innerHTML="<div class='hero-content'><h1>No hay noticias en esta sección.</h1></div>";return}
 hero.innerHTML=`<img src="${featured.image}" alt=""><div class="hero-content"><div class="category">${featured.cat}</div><h1>${featured.title}</h1><p>${featured.summary}</p><div class="meta">LA PALABRA HOY · ${new Date().toLocaleDateString("es-ES")}</div></div>`;
 const rest=items.filter(n=>n.id!==featured.id);
 document.getElementById("sideNews").innerHTML=rest.slice(0,2).map(card=>`<article class="side-card"><img src="${card.image}" alt=""><div><div class="category">${card.cat}</div><h3>${card.title}</h3></div></article>`).join("");
 document.getElementById("newsGrid").innerHTML=rest.slice(2).map(card=>`<article class="news-card"><img src="${card.image}" alt=""><div class="body"><div class="category">${card.cat}</div><h3>${card.title}</h3><p>${card.summary}</p><div class="meta">La Palabra Hoy</div></div></article>`).join("");
 document.getElementById("ticker").textContent=featured.title;
}
function filterNews(cat,btn){document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");render(cat)}
function openAdmin(){renderAdmin();document.getElementById("adminModal").style.display="block"}
function closeAdmin(){document.getElementById("adminModal").style.display="none"}
function renderAdmin(){
 document.getElementById("adminList").innerHTML=news.map((n,i)=>`
 <div class="admin-item">
   <label>Título</label><input data-i="${i}" data-k="title" value="${esc(n.title)}">
   <label>Sección</label><select data-i="${i}" data-k="cat">${["Política","Economía","Mundo","Sociedad","Deportes","Cultura"].map(c=>`<option ${c===n.cat?"selected":""}>${c}</option>`).join("")}</select>
   <label>Resumen</label><textarea data-i="${i}" data-k="summary">${esc(n.summary)}</textarea>
   <label>Imagen (URL)</label><input data-i="${i}" data-k="image" value="${esc(n.image)}">
   <label><input type="checkbox" data-i="${i}" data-k="featured" ${n.featured?"checked":""} > Noticia principal</label>
   <br><button class="delete-btn" onclick="deleteNews(${i})">Eliminar</button>
 </div>`).join("");
}
function syncAdmin(){
 document.querySelectorAll("[data-i][data-k]").forEach(el=>{
   const i=Number(el.dataset.i),k=el.dataset.k;
   news[i][k]=el.type==="checkbox"?el.checked:el.value;
 });
}
function addNews(){syncAdmin();news.push({id:Date.now(),cat:"Sociedad",title:"Nueva noticia",summary:"Escribe aquí el resumen de la noticia.",image:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",featured:false});renderAdmin()}
function deleteNews(i){syncAdmin();news.splice(i,1);renderAdmin()}
function saveAll(){syncAdmin();localStorage.setItem("lapalabra_news",JSON.stringify(news));render();closeAdmin();alert("Noticias guardadas correctamente.")}
function esc(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"','&quot;')}
render();