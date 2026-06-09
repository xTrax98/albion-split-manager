const ids=[
'loot',
'bolsas',
'reparacion',
'mapa',
'venta',
'caller',
'looter',
'jugadores',
'nombre',
'fecha'
];

const $ = id => document.getElementById(id);

function fmt(n){
return Math.round(n).toString();
}

function calc(){

let loot = +$('loot').value || 0;
let bolsas = +$('bolsas').value || 0;
let rep = +$('reparacion').value || 0;
let mapa = +$('mapa').value || 0;

let venta = (+$('venta').value || 0)/100;
let caller = (+$('caller').value || 0)/100;
let looter = (+$('looter').value || 0)/100;

let jugadores = +$('jugadores').value || 0;

let ventaTabla = loot * venta;

let total =
(bolsas - rep) +
(ventaTabla - mapa);

let participaciones =
jugadores +
(1 + caller) +
(1 + looter);

let base =
participaciones > 0
? total / participaciones
: 0;

let pagoCaller = base * (1 + caller);
let pagoLooter = base * (1 + looter);

$('dashboard').innerHTML=`

<div class="stat">
<span>Total Repartir</span>
<strong>${fmt(total)}</strong>
</div>

<div class="stat">
<span>Participaciones</span>
<strong>${participaciones.toFixed(2)}</strong>
</div>

<div class="stat">
<span>Pago Jugador</span>
<strong>${fmt(base)}</strong>
</div>

<div class="stat">
<span>Pago Caller</span>
<strong>${fmt(pagoCaller)}</strong>
</div>

<div class="stat">
<span>Pago Looter</span>
<strong>${fmt(pagoLooter)}</strong>
</div>

<div class="stat">
<span>Venta Tabla</span>
<strong>${fmt(ventaTabla)}</strong>
</div>

`;

$('discordPreview').value =

`🏆 SPLIT ${$('nombre').value}

💎 Loot Tabla: ${fmt(loot)}
📦 Bolsas: ${fmt(bolsas)}
🔧 Reparación: ${fmt(rep)}
🗺️ Mapa: ${fmt(mapa)}

💰 Total: ${fmt(total)}

👤 Jugador: ${fmt(base)}
📢 Caller: ${fmt(pagoCaller)}
📦 Looter: ${fmt(pagoLooter)}

👥 Participaciones: ${participaciones.toFixed(2)}
`;

guardarConfig();
}

function copiarDiscord(){

navigator.clipboard.writeText(
$('discordPreview').value
);

alert("Copiado");
}

function guardar(){

let historial =
JSON.parse(
localStorage.getItem('albionv3')
|| '[]'
);

historial.unshift({
fecha:$('fecha').value,
nombre:$('nombre').value
});

localStorage.setItem(
'albionv3',
JSON.stringify(historial)
);

cargarHistorial();
}

function cargarHistorial(){

let historial =
JSON.parse(
localStorage.getItem('albionv3')
|| '[]'
);

$('historial').innerHTML =
historial.map(x=>`
<div>
📅 ${x.fecha}
- ${x.nombre}
</div>
`).join('');
}

function guardarConfig(){

let config={};

ids.forEach(id=>{
config[id]=$(id).value;
});

localStorage.setItem(
'albionConfigV3',
JSON.stringify(config)
);
}

function cargarConfig(){

let config =
JSON.parse(
localStorage.getItem('albionConfigV3')
|| '{}'
);

ids.forEach(id=>{

if($(id) && config[id]!==undefined){

$(id).value=config[id];

}

});

}

ids.forEach(id=>{

if($(id)){
$(id).addEventListener('input',calc);
}

});

cargarConfig();
cargarHistorial();
calc();