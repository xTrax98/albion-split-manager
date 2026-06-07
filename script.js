
const $=id=>document.getElementById(id);

function fmt(n){return Math.round(n||0).toLocaleString('es-ES');}

function addPlayer(name='',role='Jugador'){
 const d=document.createElement('div');
 d.innerHTML=`<input class="pname" placeholder="Nombre" value="${name}">
 <select class="prole">
 <option ${role==='Jugador'?'selected':''}>Jugador</option>
 <option ${role==='Caller'?'selected':''}>Caller</option>
 <option ${role==='Looter'?'selected':''}>Looter</option>
 </select><button onclick="this.parentNode.remove();calc()">🗑️</button><hr>`;
 $('players').appendChild(d);
 d.querySelectorAll('input,select').forEach(x=>x.oninput=calc);
 calc();
}

function calc(){
 let loot=+$('loot').value||0;
 let bags=+$('bags').value||0;
 let repair=+$('repair').value||0;
 let map=+$('map').value||0;
 let sale=(+$('sale').value||0)/100;
 let cBonus=(+$('callerBonus').value||0)/100;
 let lBonus=(+$('looterBonus').value||0)/100;

 let total=(bags-repair)+((loot*sale)-map);

 let parts=0;
 let rows=[...document.querySelectorAll('#players > div')];
 let caller=0, looter=0;

 rows.forEach(r=>{
   let role=r.querySelector('.prole').value;
   if(role==='Jugador') parts+=1;
   if(role==='Caller'){parts+=(1+cBonus); caller++;}
   if(role==='Looter'){parts+=(1+lBonus); looter++;}
 });

 let base=parts?total/parts:0;

 $('dashboard').innerHTML=`
 <div class="stat">💰 Total repartir: <b>${fmt(total)}</b></div>
 <div class="stat">⚖️ Participaciones: <b>${parts.toFixed(2)}</b></div>
 <div class="stat">👤 Pago jugador: <b>${fmt(base)}</b></div>
 <div class="stat">📢 Pago caller: <b>${fmt(base*(1+cBonus))}</b></div>
 <div class="stat">📦 Pago looter: <b>${fmt(base*(1+lBonus))}</b></div>
 ${caller!==1?'<div>⚠️ Debe existir 1 Caller</div>':''}
 ${looter!==1?'<div>⚠️ Debe existir 1 Looter</div>':''}
 `;

 let tbody=$('payments');
 tbody.innerHTML='';
 rows.forEach(r=>{
  let n=r.querySelector('.pname').value||'Sin nombre';
  let role=r.querySelector('.prole').value;
  let pay=base;
  if(role==='Caller') pay=base*(1+cBonus);
  if(role==='Looter') pay=base*(1+lBonus);
  tbody.innerHTML+=`<tr><td>${n}</td><td>${role}</td><td>${fmt(pay)}</td></tr>`;
 });
}

function copyDiscord(){
 navigator.clipboard.writeText($('dashboard').innerText);
 alert('Resumen copiado');
}

function saveSplit(){
 let data={fecha:$('fecha').value,nombre:$('nombre').value};
 let arr=JSON.parse(localStorage.getItem('splits')||'[]');
 arr.push(data);
 localStorage.setItem('splits',JSON.stringify(arr));
 loadHistory();
}

function loadHistory(){
 let arr=JSON.parse(localStorage.getItem('splits')||'[]');
 $('history').innerHTML=arr.map(x=>`• ${x.fecha} - ${x.nombre}`).join('<br>');
}

document.querySelectorAll('input').forEach(i=>i.oninput=calc);
addPlayer('Caller','Caller');
addPlayer('Looter','Looter');
addPlayer('Jugador1','Jugador');
loadHistory();
calc();
