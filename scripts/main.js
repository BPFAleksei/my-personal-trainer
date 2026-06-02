const DATA_PATH = 'data/exercises.json';
const STORAGE_KEY = 'miRutinaDelDia';

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function loadRutina() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error('No se pudo leer la rutina de sesión', err);
        return [];
    }
}

function saveRutina(list) {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
        console.error('No se pudo guardar la rutina de sesión', err);
    }
}

function getRutinaIds() {
    return window.rutinaHoy || [];
}

function setRutinaIds(ids) {
    window.rutinaHoy = ids;
    saveRutina(ids);
    updateRutinaPanel();
}

function addToRutina(id) {
    const rutina = getRutinaIds();
    if (rutina.includes(id)) return;
    setRutinaIds([...rutina, id]);
    reAplicarFiltroActual();
}

function removeFromRutina(id) {
    const rutina = getRutinaIds().filter(item => item !== id);
    setRutinaIds(rutina);
    reAplicarFiltroActual();
}

function reAplicarFiltroActual() {
    if (window.currentFilter && window.currentFilter.value && window.currentFilter.type) {
        filtrar(window.currentFilter.value, window.currentFilter.type);
    } else {
        renderExercises(window.exercises || []);
    }
}

function getExerciseById(id) {
    return (window.exercises || []).find(e => e.id === id);
}

function renderRutinaList() {
    const listContainer = document.getElementById('rutina-list');
    const resumen = document.getElementById('rutina-resumen');
    if (!listContainer || !resumen) return;

    const rutina = getRutinaIds();
    if (rutina.length === 0) {
        listContainer.innerHTML = '<p class="rutina-vacia">Aún no añadiste ejercicios a tu rutina de hoy.</p>';
        resumen.innerText = 'Agrega ejercicios a tu rutina de hoy desde las tarjetas.';
        return;
    }

    resumen.innerText = `Tienes ${rutina.length} ejercicio${rutina.length === 1 ? '' : 's'} en tu rutina.`;
    listContainer.innerHTML = rutina.map(id => {
        const ejercicio = getExerciseById(id);
        if (!ejercicio) return '';
        return `
            <div class="rutina-item">
                <div>
                    <strong>${ejercicio.title}</strong>
                    <div class="rutina-meta">${capitalize(ejercicio.musculo)} · ${capitalize(ejercicio.equipo)}</div>
                </div>
                <button class="btn-remove" onclick="removeFromRutina('${id}')">Quitar</button>
            </div>
        `;
    }).join('');
}

function updateRutinaPanel() {
    renderRutinaList();
}

function toggleRutinaDetalle() {
    const list = document.getElementById('rutina-list');
    if (!list) return;
    list.classList.toggle('rutina-list-open');
}

function renderExercises(list) {
    const grid = document.querySelector('.ejercicios-grid');
    if (!grid) return;
    if (!Array.isArray(list) || list.length === 0) {
        grid.innerHTML = '<div class="ejercicio-card"><p style="color:#ccc; padding:12px;">No hay ejercicios.</p></div>';
        return;
    }
    const rutinaIds = getRutinaIds();
    grid.innerHTML = list.map(e => {
        const added = rutinaIds.includes(e.id);
        return `
        <div class="ejercicio-card" data-musculo="${e.musculo}" data-equipo="${e.equipo}">
            <h3>${e.title}</h3>
            <img src="${e.image}" alt="${e.alt}" onerror="this.src='https://placehold.co/400x250/1e1e1e/00adb5?text=Imagen+no+disponible'">
            <div class="tags">
                <span class="tag tag-musculo">${capitalize(e.musculo)}</span>
                <span class="tag tag-equipo">${capitalize(e.equipo)}</span>
            </div>
            <button class="btn-add-today ${added ? 'added' : ''}" onclick="addToRutina('${e.id}')" ${added ? 'disabled' : ''}>
                <span class="btn-add-icon">${added ? '✓' : '+'}</span>
                <span>${added ? 'Añadido' : 'Añadir hoy'}</span>
            </button>
        </div>
    `;
    }).join('');
}

function normalizeFilterValue(value) {
    return (value || '').toString().trim().toLowerCase();
}

function filtrar(valor, tipo, boton) {
    const valorNormalized = normalizeFilterValue(valor);
    window.currentFilter = { value: valorNormalized, type: tipo };

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
    window.rutinaHoy = loadRutina();
    fetch(DATA_PATH)
        .then(r => {
            if (!r.ok) throw new Error('No se pudo cargar data');
            return r.json();
        })
        .then(data => {
            window.exercises = data;
            renderExercises(data);
            updateRutinaPanel();
            const titulo = document.getElementById('resultados-titulo');
            if (titulo) titulo.innerText = `Ejercicios disponibles (${data.length})`;
        })
        .catch(err => {
            console.error(err);
        });
});
