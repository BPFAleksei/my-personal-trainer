const DATA_PATH = 'data/exercises.json';

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function renderExercises(list) {
    const grid = document.querySelector('.ejercicios-grid');
    if (!grid) return;
    if (!Array.isArray(list) || list.length === 0) {
        grid.innerHTML = '<div class="ejercicio-card"><p style="color:#ccc; padding:12px;">No hay ejercicios.</p></div>';
        return;
    }
    grid.innerHTML = list.map(e => `
        <div class="ejercicio-card" data-musculo="${e.musculo}" data-equipo="${e.equipo}">
            <h3>${e.title}</h3>
            <img src="${e.image}" alt="${e.alt}" onerror="this.src='https://placehold.co/400x250/1e1e1e/00adb5?text=Imagen+no+disponible'">
            <div class="tags">
                <span class="tag tag-musculo">${capitalize(e.musculo)}</span>
                <span class="tag tag-equipo">${capitalize(e.equipo)}</span>
            </div>
        </div>
    `).join('');
}

function normalizeFilterValue(value) {
    return (value || '').toString().trim().toLowerCase();
}

function filtrar(valor, tipo, boton) {
    const valorNormalized = normalizeFilterValue(valor);

    if (boton) {
        let grupo = boton.parentElement;
        let botones = grupo.getElementsByClassName('btn-filter');
        for (let b of botones) b.classList.remove('active');
        boton.classList.add('active');

        resetearOtroGrupo(tipo);
    }

    const lista = window.exercises || [];
    let filtered;

    if (valorNormalized === 'todos') filtered = lista;
    else filtered = lista.filter(e => normalizeFilterValue(e[tipo]) === valorNormalized);

    renderExercises(filtered);

    const titulo = document.getElementById('resultados-titulo');
    if (titulo) titulo.innerText = `Ejercicios encontrados (${filtered.length})`;
}

function resetearOtroGrupo(tipoActual) {
    let idDestino = (tipoActual === 'musculo') ? 'filtro-equipo' : 'filtro-musculo';
    let botones = document.getElementById(idDestino).getElementsByClassName('btn-filter');
    for (let b of botones) {
        b.classList.remove('active');
        if (b.innerText === 'Todos') b.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(DATA_PATH)
        .then(r => {
            if (!r.ok) throw new Error('No se pudo cargar data');
            return r.json();
        })
        .then(data => {
            window.exercises = data;
            renderExercises(data);
            const titulo = document.getElementById('resultados-titulo');
            if (titulo) titulo.innerText = `Ejercicios disponibles (${data.length})`;
        })
        .catch(err => {
            console.error(err);
        });
});
