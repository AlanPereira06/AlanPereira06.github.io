const subjects=[
 {name:"Matemática",icon:"∑",desc:"Funciones, álgebra y cálculo",progress:68,ex:12},
 {name:"Programación",icon:"</>",desc:"Algoritmos, lógica y código",progress:82,ex:18},
 {name:"Inglés",icon:"A",desc:"Gramática y comprensión",progress:54,ex:8},
 {name:"Física",icon:"⚛",desc:"Mecánica y energía",progress:41,ex:6},
 {name:"Historia",icon:"🏛",desc:"Procesos y acontecimientos",progress:73,ex:14},
 {name:"Base de Datos",icon:"▤",desc:"SQL, modelos y consultas",progress:61,ex:10}
];

let courses=JSON.parse(localStorage.getItem("aula_courses"))||subjects.slice(0,3);
let currentQuestion=0, selected=null;
const questions=[
 {q:"¿Cuál es el resultado de f(2) si f(x) = 3x + 1?",a:["5","6","7","8"],c:2},
 {q:"¿Cuánto es 1011₂ en decimal?",a:["9","10","11","12"],c:2},
 {q:"Si x + 5 = 12, ¿cuánto vale x?",a:["5","6","7","8"],c:2},
 {q:"¿Cuál es la derivada de x²?",a:["x","2x","x²","2"],c:1},
 {q:"¿Cuánto es 15 en hexadecimal?",a:["E","F","10","D"],c:1}
];

function showSection(id){
 document.querySelectorAll(".section").forEach(s=>s.classList.toggle("active",s.id===id));
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.section===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-section]").forEach(el=>el.addEventListener("click",()=>showSection(el.dataset.section)));

function renderCourses(){
 const box=document.getElementById("courseList");
 box.innerHTML=courses.map(s=>`<div class="course"><div class="course-icon">${s.icon}</div><div><b>${s.name}</b><small>${s.progress}% completado</small><div class="progress"><i style="width:${s.progress}%"></i></div></div><div class="percent">${s.progress}%</div></div>`).join("");
}
function renderSubjects(){
 document.getElementById("subjectGrid").innerHTML=subjects.map((s,i)=>`<article class="subject" data-subject="${i}"><div class="big-icon">${s.icon}</div><h2>${s.name}</h2><p>${s.desc}</p><div class="progress"><i style="width:${s.progress}%"></i></div><div class="subject-footer"><span>${s.ex} ejercicios</span><b>${s.progress}%</b></div></article>`).join("");
 document.querySelectorAll(".subject").forEach(el=>el.onclick=()=>{showToast("Materia seleccionada");showSection("practica")});
}
function renderQuestion(){
 const x=questions[currentQuestion];
 document.getElementById("question").textContent=x.q;
 document.getElementById("questionCounter").textContent=`Pregunta ${currentQuestion+1} de ${questions.length}`;
 document.getElementById("feedback").textContent="";
 document.getElementById("nextQuestion").textContent="Comprobar";
 selected=null;
 document.getElementById("answers").innerHTML=x.a.map((a,i)=>`<button class="answer" data-i="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("");
 document.querySelectorAll(".answer").forEach(b=>b.onclick=()=>{document.querySelectorAll(".answer").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=Number(b.dataset.i)});
}
document.getElementById("nextQuestion").onclick=()=>{
 if(selected===null){showToast("Selecciona una respuesta");return}
 const q=questions[currentQuestion], buttons=document.querySelectorAll(".answer");
 buttons[q.c].classList.add("correct");
 if(selected===q.c){
   document.getElementById("feedback").textContent="✓ ¡Correcto! +20 XP";
   let p=Number(localStorage.getItem("aula_points")||740)+20;
   localStorage.setItem("aula_points",p);document.getElementById("pointsStat").textContent=p;
 }else{
   buttons[selected].classList.add("wrong");document.getElementById("feedback").textContent="Revisa el concepto e inténtalo de nuevo.";
 }
 document.getElementById("nextQuestion").textContent=currentQuestion===questions.length-1?"Reiniciar":"Siguiente";
 if(currentQuestion<questions.length-1) document.getElementById("nextQuestion").dataset.next="true";
};
document.getElementById("nextQuestion").addEventListener("click",function(){
 if(this.dataset.next==="true" && selected!==null){currentQuestion++;delete this.dataset.next;renderQuestion()}
 else if(currentQuestion===questions.length-1 && selected!==null){currentQuestion=0;renderQuestion()}
});

document.getElementById("addSubject").onclick=()=>{
 const name=prompt("Nombre de la materia:");
 if(!name)return;
 subjects.push({name,icon:"✦",desc:"Nueva materia",progress:0,ex:0});
 renderSubjects();showToast("Materia agregada");
};
document.getElementById("searchInput").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 document.querySelectorAll(".subject").forEach(el=>el.style.display=el.textContent.toLowerCase().includes(q)?"block":"none");
});
document.getElementById("darkMode").onchange=e=>document.body.classList.toggle("dark",e.target.checked);
document.getElementById("saveSettings").onclick=()=>{
 const name=document.getElementById("nameInput").value||"Estudiante";
 document.querySelector(".profile b").textContent=name;
 localStorage.setItem("aula_name",name);
 localStorage.setItem("aula_dark",document.getElementById("darkMode").checked);
 showToast("Cambios guardados");
};
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function load(){
 const name=localStorage.getItem("aula_name");if(name){document.getElementById("nameInput").value=name;document.querySelector(".profile b").textContent=name}
 const dark=localStorage.getItem("aula_dark")==="true";document.getElementById("darkMode").checked=dark;document.body.classList.toggle("dark",dark);
 document.getElementById("pointsStat").textContent=localStorage.getItem("aula_points")||740;
 renderCourses();renderSubjects();renderQuestion();
}
load();