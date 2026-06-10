let job="";
let admin=false;

const ADMIN_ID="r";
const ADMIN_MDP="rr";

/* LOGIN */
function loginAdmin(){
const id=document.getElementById("adminId").value;
const mdp=document.getElementById("adminMdP").value;

if(id===ADMIN_ID && mdp===ADMIN_MDP){
document.getElementById("loginPanel").style.display="none";
document.getElementById("adminPanel").style.display="block";
admin=true;
load();
stats();
}
else alert("Erreur");
}

/* OPEN FORM */
function openForm(j){
job=j;
document.getElementById("form").style.display="flex";
}

/* SEND */
function send(e){
e.preventDefault();

let data=JSON.parse(localStorage.getItem("cvs")||"[]");

const cv={
job,
rp:rp.value,
exp:exp.value,
dispo:dispo.value,
discord:discord.value,
status:"WAIT",
date:new Date().toLocaleString()
};

data.push(cv);
localStorage.setItem("cvs",JSON.stringify(data));

fetch("DISCORD_WEBHOOK",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
embeds:[{
title:"📩 Nouvelle candidature",
color:5793266,
description:`**${job}**\n${cv.rp}\n${cv.discord}`
}]
})
});

form.style.display="none";
}

/* LOAD */
function load(filter="ALL"){
let data=JSON.parse(localStorage.getItem("cvs")||"");
if(!data.length) return;

let html="";

data.forEach((c,i)=>{

if(filter!=="ALL" && c.status!==filter) return;

let color=c.status==="WAIT"?"🟡":c.status==="OK"?"🟢":"🔴";

html+=`
<div class="cv">
<b>${c.job}</b> ${color}<br>
${c.rp}<br>
${c.discord}<br>

<button onclick="setStatus(${i},'OK')">✔</button>
<button onclick="setStatus(${i},'NO')">✖</button>
<button onclick="del(${i})">🗑</button>
</div>`;
});

candidatures.innerHTML=html;
}

/* STATUS */
function setStatus(i,s){
let data=JSON.parse(localStorage.getItem("cvs"));
data[i].status=s;
localStorage.setItem("cvs",JSON.stringify(data));
load();
stats();
}

/* DELETE */
function del(i){
let data=JSON.parse(localStorage.getItem("cvs"));
data.splice(i,1);
localStorage.setItem("cvs",JSON.stringify(data));
load();
stats();
}

/* FILTER */
function filter(f){load(f);}

/* STATS */
function stats(){
let data=JSON.parse(localStorage.getItem("cvs")||"[]");

stats.innerHTML=`
<div class="stat">CV: ${data.length}</div>
<div class="stat">🟡 ${data.filter(x=>x.status==="WAIT").length}</div>
<div class="stat">🟢 ${data.filter(x=>x.status==="OK").length}</div>
<div class="stat">🔴 ${data.filter(x=>x.status==="NO").length}</div>
`;
}