
const ids=['loot','bolsas','reparacion','mapa','venta','caller','looter','jugadores','nombre'];
const $=i=>document.getElementById(i);
function fmt(n){return Math.round(n).toLocaleString('es-ES');}
function calc(){
let loot=+$('loot').value||0;
let bolsas=+$('bolsas').value||0;
let rep=+$('reparacion').value||0;
let mapa=+$('mapa').value||0;
let venta=(+$('venta').value||0)/100;
let c=(+$('caller').value||0)/100;
let l=(+$('looter').value||0)/100;
let j=+$('jugadores').value||0;

let ventaTabla=loot*venta;
let total=(bolsas-rep)+(ventaTabla-mapa);
let parts=j+(1+c)+(1+l);
let base=parts?total/parts:0;

$('dashboard').innerHTML=`
<div class="stat">💎 Loot Tabla: <b>${fmt(loot)}</b></div>
<div class="stat">📉 Venta Tabla: <b>${fmt(ventaTabla)}</b></div>
<div class="stat">📦 Bolsas: <b>${fmt(bolsas)}</b></div>
<div class="stat">🔧 Reparación: <b>${fmt(rep)}</b></div>
<div class="stat">🗺️ Mapa: <b>${fmt(mapa)}</b></div>
<hr>
<div class="stat">💰 Total Repartir: <b>${fmt(total)}</b></div>
<div class="stat">⚖️ Participaciones: <b>${parts.toFixed(2)}</b></div>
<div class="stat">👤 Pago Jugador: <b>${fmt(base)}</b></div>
<div class="stat">📢 Pago Caller: <b>${fmt(base*(1+c))}</b></div>
<div class="stat">📦 Pago Looter: <b>${fmt(base*(1+l))}</b></div>`;
}
function copiarDiscord(){navigator.clipboard.writeText($('dashboard').innerText);}
function guardar(){let a=JSON.parse(localStorage.getItem('albionv2')||'[]');a.push({f:$('fecha').value,n:$('nombre').value});localStorage.setItem('albionv2',JSON.stringify(a));cargar();}
function cargar(){let a=JSON.parse(localStorage.getItem('albionv2')||'[]');$('historial').innerHTML=a.map(x=>'• '+x.f+' - '+x.n).join('<br>');}
ids.forEach(i=>{let e=$(i);if(e)e.oninput=calc;});
cargar();calc();
