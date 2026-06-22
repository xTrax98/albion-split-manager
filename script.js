const ids = [
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

function fmtStats(n){
    return Math.round(n).toLocaleString('es-ES');
}

function calc(){

let loot = +$('loot').value || 0;
let bolsas = +$('bolsas').value || 0;
let rep = +$('reparacion').value || 0;
let mapa = +$('mapa').value || 0;

let venta = (+$('venta').value || 0) / 100;
let caller = (+$('caller').value || 0) / 100;
let looter = (+$('looter').value || 0) / 100;

let jugadores = +$('jugadores').value || 0;

// TAB vendida
let ventaTabla = loot * venta;

// Bolsas netas
let bolsasNetas =
    bolsas - rep - mapa;

// Total generado
let total =
    ventaTabla + bolsasNetas;

// Looter (% del TOTAL)
let profitLooter =
    total * looter;

// Caller (% de la TAB vendida)
let profitCaller =
    total * caller;

// Total a repartir
let totalSplit =
    total -
    profitLooter -
    profitCaller;

// Unidad base
let base =
    jugadores > 0
    ? totalSplit / jugadores
    : 0;

// Pagos finales
let pagoJugador = base;
let pagoCaller = base + profitCaller;
let pagoLooter = profitLooter;

$('dashboard').innerHTML = `
    <div class="stat">
        <span>Venta TAB</span>
        <strong>${fmt(ventaTabla)}</strong>
    </div>

    <div class="stat">
        <span>Bolsas Netas</span>
        <strong>${fmt(bolsasNetas)}</strong>
    </div>

    <div class="stat">
        <span>Total</span>
        <strong>${fmt(total)}</strong>
    </div>

    <div class="stat">
        <span>Total a Repartir</span>
        <strong>${fmt(totalSplit)}</strong>
    </div>

    <div class="stat">
        <span>Unidad Base</span>
        <strong>${fmt(base)}</strong>
    </div>

    <div class="stat">
        <span>Profit Caller</span>
        <strong>${fmt(profitCaller)}</strong>
    </div>

    <div class="stat">
        <span>Profit Looter</span>
        <strong>${fmt(profitLooter)}</strong>
    </div>

    <div class="stat">
        <span>Caller Total</span>
        <strong>${fmt(pagoCaller)}</strong>
    </div>
`;

$('discordPreview').value = `🏆 SPLIT ${$('nombre').value}

💎 Loot: ${fmt(loot)}
📦 Bolsas: ${fmt(bolsas)}
🔧 Reparación: ${fmt(rep)}
🗺️ Mapa: ${fmt(mapa)}

💰 Venta TAB: ${fmt(ventaTabla)}
💰 Bolsas Netas: ${fmt(bolsasNetas)}
💰 Total: ${fmt(total)}

📢 Caller: ${fmt(pagoCaller)}
📦 Looter: ${fmt(pagoLooter)}
👤 Jugador: ${fmt(pagoJugador)}

👥 Jugadores: ${jugadores}
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
    nombre:$('nombre').value,

    loot:$('loot').value,
    bolsas:$('bolsas').value,
    reparacion:$('reparacion').value,
    mapa:$('mapa').value,

    venta:$('venta').value,
    caller:$('caller').value,
    looter:$('looter').value,
    jugadores:$('jugadores').value
});

historial = historial.slice(0,50);

localStorage.setItem(
    'albionv3',
    JSON.stringify(historial)
);

cargarConfig();
cargarHistorial();
actualizarStats();
calc();

}

function cargarSplit(index){

let historial =
JSON.parse(
    localStorage.getItem('albionv3')
    || '[]'
);

let split = historial[index];

if(!split) return;

$('fecha').value = split.fecha || '';
$('nombre').value = split.nombre || '';

$('loot').value = split.loot || '';
$('bolsas').value = split.bolsas || '';
$('reparacion').value = split.reparacion || '';
$('mapa').value = split.mapa || '';

$('venta').value = split.venta || '';
$('caller').value = split.caller || '';
$('looter').value = split.looter || '';
$('jugadores').value = split.jugadores || '';

calc();

}

function borrarSplit(index){

let historial =
JSON.parse(
    localStorage.getItem('albionv3')
    || '[]'
);

historial.splice(index,1);

localStorage.setItem(
    'albionv3',
    JSON.stringify(historial)
);

cargarConfig();
cargarHistorial();
actualizarStats();
calc();

}

function cargarHistorial(){

let historial =
JSON.parse(
    localStorage.getItem('albionv3')
    || '[]'
);

$('historial').innerHTML =
historial.map((x,index)=>`

<div class="save-item">

    <span class="save-name">
        📅 ${x.fecha} - ${x.nombre}
    </span>

    <div class="save-actions">

	<button onclick="cargarSplit(${index})">📂</button>
	<button onclick="borrarSplit(${index})">🗑️</button>

	</div>

</div>

`).join('');

}

function guardarConfig(){

let config = {};

ids.forEach(id=>{
    config[id] = $(id).value;
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

    if($(id) && config[id] !== undefined){

        $(id).value = config[id];

    }

});

}

function exportarHistorial(){

    let historial =
    JSON.parse(
        localStorage.getItem('albionv3')
        || '[]'
    );

    const blob = new Blob(
        [JSON.stringify(historial, null, 2)],
        { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'albion-splits.json';

    a.click();

    URL.revokeObjectURL(url);
}

function importarHistorial(event){

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const historial =
            JSON.parse(e.target.result);

            localStorage.setItem(
                'albionv3',
                JSON.stringify(historial)
            );

            cargarHistorial();

            alert('Historial importado');

        }catch{

            alert('Archivo no válido');

        }

    };

    reader.readAsText(file);
}

function actualizarStats(){

let historial =
JSON.parse(
localStorage.getItem('albionv3')
|| '[]'
);

if(historial.length === 0){

$('stats').innerHTML = `
No hay datos todavía.
`;

return;
}

let totalRepartido = 0;
let mayorSplit = 0;

historial.forEach(split=>{

let loot = Number(split.loot) || 0;
let bolsas = Number(split.bolsas) || 0;
let rep = Number(split.reparacion) || 0;
let mapa = Number(split.mapa) || 0;
let venta = (Number(split.venta) || 0) / 100;

let total =
(bolsas - rep) +
((loot * venta) - mapa);

totalRepartido += total;

if(total > mayorSplit){
mayorSplit = total;
}

});

let promedio =
totalRepartido / historial.length;

let ultimo =
historial[0]?.nombre || '-';

$('stats').innerHTML = `

<div>
<strong>Splits guardados:</strong>
${historial.length}
</div>

<div>
<strong>Total repartido:</strong>
${fmtStats(totalRepartido)}
</div>

<div>
<strong>Mayor split:</strong>
${fmtStats(mayorSplit)}
</div>

<div>
<strong>Promedio:</strong>
${fmtStats(promedio)}
</div>

<div>
<strong>Último split:</strong>
${ultimo}
</div>

`;
}

ids.forEach(id=>{

if($(id)){
    $(id).addEventListener('input', calc);
}

});

cargarConfig();
cargarHistorial();
actualizarStats();
calc();
