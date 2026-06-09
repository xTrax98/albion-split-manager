
const $=i=>document.getElementById(i);
function fmt(n){return Math.round(n).toString();}
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
<p>💎 Loot Tabla: <b>${fmt(loot)}</b></p>
<p>📉 Venta Tabla: <b>${fmt(ventaTabla)}</b></p>
<p>📦 Bolsas: <b>${fmt(bolsas)}</b></p>
<p>🔧 Reparación: <b>${fmt(rep)}</b></p>
<p>🗺️ Mapa: <b>${fmt(mapa)}</b></p>
<hr>
<p>💰 Total Repartir: <b>${fmt(total)}</b></p>
<p>⚖️ Participaciones: <b>${parts.toFixed(2)}</b></p>
<p>👤 Pago Jugador: <b>${fmt(base)}</b></p>
<p>📢 Pago Caller: <b>${fmt(base*(1+c))}</b></p>
<p>📦 Pago Looter: <b>${fmt(base*(1+l))}</b></p>`;
}
document.querySelectorAll('input').forEach(i=>i.oninput=calc);
calc();
