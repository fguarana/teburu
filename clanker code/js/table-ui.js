import {
    getTableById,
    getAllTables,
    getTablesByStatus
} from './tables.js';

/* UTILITÁRIOS*/
export function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function getStatusLabel(status) {
    const labels = {
        free: 'Livre',
        occupied: 'Ocupada',
        reserved: 'Reservada',
        cleaning: 'Limpeza'
    };

    return labels[status] ?? status;
}

/* ÍCONES*/
function getTableIcon(status) {
    const icons = {
        free: `
            <i
                data-lucide="circle-check"
                class="w-5 h-5 text-[#767C53]"
            ></i>
        `,

        occupied: `
            <i
                data-lucide="users"
                class="w-5 h-5 text-[#D7D7D0]/70"
            ></i>
        `,

        reserved: `
            <i
                data-lucide="calendar-clock"
                class="w-5 h-5 text-[#CCAB7A]"
            ></i>
        `,

        cleaning: `
            <i
                data-lucide="brush-cleaning"
                class="w-5 h-5 text-[#CCAB7A]/70"
            ></i>
        `
    };

    return icons[status] ?? '';
}

/* ESTILOS DOS CARDS*/
function applyStatusStyles(card, status) {
    const statusBadge = card.querySelector('.status-badge');
    const guestLabel = card.querySelector('.guest-label');
    const timeLabel = card.querySelector('.time-label');

    if (!statusBadge || !guestLabel || !timeLabel) {
        return;
    }

    /* Classes base*/
    card.className =
        'table-card relative p-5 rounded-2xl bg-[#1b231b]/80 border transition-all cursor-pointer group shadow-sm hover:shadow-lg';


    /* LIVRE*/
    if (status === 'free') {
        card.classList.add(
            'border-[#767C53]/45',
            'hover:border-[#767C53]',
            'hover:shadow-black/40'
        );

        statusBadge.className =
            'status-badge text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#767C53]/20 text-[#a2ab72] border border-[#767C53]/50';

        statusBadge.innerText = 'Livre';

        guestLabel.className =
            'text-xs font-medium text-[#D7D7D0]/60 mt-2 guest-label';

        timeLabel.className =
            'text-[11px] text-[#767C53] mt-0.5 time-label';

        return;
    }

    /* OCUPADA*/
    if (status === 'occupied') {
        card.classList.add(
            'border-[#D7D7D0]/30',
            'hover:border-[#D7D7D0]/70',
            'hover:shadow-black/40'
        );

        statusBadge.className =
            'status-badge text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#D7D7D0]/15 text-[#D7D7D0] border border-[#D7D7D0]/40';

        statusBadge.innerText = 'Ocupada';

        guestLabel.className =
            'text-xs font-medium text-[#D7D7D0] mt-2 truncate guest-label';

        timeLabel.className =
            'text-[11px] text-[#D7D7D0]/55 mt-0.5 time-label';

        return;
    }

    /* RESERVADA*/
    if (status === 'reserved') {
        card.classList.add(
            'border-[#CCAB7A]/60',
            'hover:border-[#CCAB7A]',
            'hover:shadow-[#CCAB7A]/10'
        );

        statusBadge.className =
            'status-badge text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#CCAB7A]/20 text-[#CCAB7A] border border-[#CCAB7A]/50';

        statusBadge.innerText = 'Reservada';

        guestLabel.className =
            'text-xs font-medium text-[#D7D7D0] mt-2 truncate guest-label';

        timeLabel.className =
            'text-[11px] text-[#CCAB7A] mt-0.5 time-label';

        return;
    }

    /* LIMPEZA*/
    if (status === 'cleaning') {
        card.classList.add(
            'border-[#404125]',
            'hover:border-[#CCAB7A]/50',
            'hover:shadow-black/40'
        );

        statusBadge.className =
            'status-badge text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#404125]/60 text-[#D7D7D0] border border-[#404125]';

        statusBadge.innerText = 'Limpeza';

        guestLabel.className =
            'text-xs font-medium text-[#D7D7D0]/60 mt-2 guest-label';

        timeLabel.className =
            'text-[11px] text-[#CCAB7A]/75 mt-0.5 time-label';
    }
}

/* CONTEÚDO DO CARD*/
function updateTableCardContent(card, table) {
    const guestLabel = card.querySelector('.guest-label');
    const timeLabel = card.querySelector('.time-label');
    const statusBadge = card.querySelector('.status-badge');
    const billLabel = card.querySelector('.bill-label');
    const iconContainer = card.querySelector('.table-icon');

    if (!guestLabel || !timeLabel || !statusBadge || !billLabel) {
        return;
    }

    /* Status*/
    statusBadge.innerText =
        getStatusLabel(table.status);

    /* Cliente*/
    if (table.status === 'free') {
        guestLabel.innerText = 'Disponível';
        timeLabel.innerText = 'Pronta para check-in';
    }

    else if (table.status === 'occupied') {
        guestLabel.innerText = table.guest;
        timeLabel.innerText =
            `${table.time} • Em atendimento`;
    }

    else if (table.status === 'reserved') {
        guestLabel.innerText = table.guest;
        timeLabel.innerText =
            `Reserva: ${table.time}`;
    }

    else if (table.status === 'cleaning') {
        guestLabel.innerText = 'Limpeza pendente';
        timeLabel.innerText = 'Garçom acionado';
    }

    /* Consumo*/
    billLabel.innerText =
        formatCurrency(table.bill);

    /* Ícone*/
    if (iconContainer) {
        iconContainer.innerHTML =
            getTableIcon(table.status);
    }

    /* Status visual*/
    applyStatusStyles(card, table.status);
}

/* CRIAÇÃO DE UM CARD*/
function createTableCard(table) {
    const card = document.createElement('div');

    card.id = `card-${table.id}`;

    card.dataset.table = table.id;
    card.dataset.status = table.status;

    card.className =
        'table-card relative p-5 rounded-2xl bg-[#1b231b]/80 border transition-all cursor-pointer group shadow-sm hover:shadow-lg';

    card.innerHTML = `
        <div class="flex items-start justify-between">
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-[#D7D7D0]">
                        ${table.label}
                    </span>

                    <span class="status-badge"></span>
                </div>

                <p
                    class="text-xs font-medium text-[#D7D7D0]/60 mt-2 guest-label"
                >
                    ${table.guest}
                </p>

                <p
                    class="text-[11px] mt-0.5 time-label"
                ></p>
            </div>

            <div class="table-icon">
                ${getTableIcon(table.status)}
            </div>
        </div>

        <div class="mt-5 flex items-end justify-between">

            <div>
                <p class="text-[11px] text-[#D7D7D0]/40">
                    Capacidade
                </p>

                <p class="text-xs text-[#D7D7D0]/70">
                    ${table.capacity} pessoas
                </p>
            </div>

            <div class="text-right">
                <p class="text-[11px] text-[#D7D7D0]/40">
                    Consumo
                </p>
                <p
                    class="text-sm font-semibold text-[#D7D7D0] bill-label"
                >
                    ${formatCurrency(table.bill)}
                </p>
            </div>
        </div>
    `;

    updateTableCardContent(card, table);

    return card;
}

/* RENDERIZAR TODAS AS MESAS*/
export function renderAllTables() {
    const container =
        document.getElementById('tablesContainer');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    const tables = getAllTables();

    tables.forEach(table => {
        const card = createTableCard(table);

        container.appendChild(card);
    });

    /* O Lucide transforma os <i> em SVG.*/
    if (window.lucide) {
        lucide.createIcons();
    }
}

/* ATUALIZAR UMA MESA*/
export function renderTableCard(id) {
    const table = getTableById(id);

    if (!table) {
        return;
    }

    const card =
        document.getElementById(`card-${id}`);

    if (!card) {
        return;
    }

    card.dataset.status = table.status;

    updateTableCardContent(card, table);

    /* Atualiza os ícones caso o status tenha mudado.*/
    if (window.lucide) {
        lucide.createIcons();
    }
}

/* MÉTRICAS DO TOPO*/
export function updateTopMetrics() {
    const free =
        getTablesByStatus('free').length;

    const occupied =
        getTablesByStatus('occupied').length;

    const reserved =
        getTablesByStatus('reserved').length;

    const cleaning =
        getTablesByStatus('cleaning').length;

    const freeElement =
        document.getElementById('top-free');

    const occupiedElement =
        document.getElementById('top-occupied');

    const reservedElement =
        document.getElementById('top-reserved');

    const cleaningElement =
        document.getElementById('top-cleaning');

    if (freeElement) {
        freeElement.innerText = free;
    }

    if (occupiedElement) {
        occupiedElement.innerText = occupied;
    }

    if (reservedElement) {
        reservedElement.innerText = reserved;
    }

    if (cleaningElement) {
        cleaningElement.innerText = cleaning;
    }

    const totalTables =
        getAllTables().length;

    if (totalTables === 0) {
        return;
    }

    const occupancy =
        Math.round(
            ((occupied + reserved) / totalTables) * 100
        );

    const occupancyElement =
        document.getElementById('quick-occupancy-txt');

    if (occupancyElement) {
        occupancyElement.innerText =
            `Ocupação Atual: ${occupancy}%`;
    }
}

/* BADGE DO DRAWER*/
export function updateDrawerStatusBadge(status) {
    const badge =
        document.getElementById('drawerStatusBadge');

    if (!badge) {
        return;
    }

    if (status === 'free') {
        badge.className =
            'text-xs font-semibold px-2.5 py-1 rounded-full bg-[#767C53]/20 text-[#a2ab72] border border-[#767C53]/50';

        badge.innerText = 'Livre';
    }

    else if (status === 'occupied') {
        badge.className =
            'text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D7D7D0]/15 text-[#D7D7D0] border border-[#D7D7D0]/40';

        badge.innerText = 'Ocupada';
    }

    else if (status === 'reserved') {
        badge.className =
            'text-xs font-semibold px-2.5 py-1 rounded-full bg-[#CCAB7A]/20 text-[#CCAB7A] border border-[#CCAB7A]/50';

        badge.innerText = 'Reservada';
    }

    else if (status === 'cleaning') {
        badge.className =
            'text-xs font-semibold px-2.5 py-1 rounded-full bg-[#404125]/60 text-[#D7D7D0] border border-[#404125]';

        badge.innerText = 'Em Limpeza';
    }
}

/* FILTRO DAS MESAS*/
export function applyTableFilter(status) {
    document
        .querySelectorAll('.table-card')
        .forEach(card => {

            const cardStatus =
                card.dataset.status;

            if (
                status === 'all' ||
                cardStatus === status
            ) {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }

            else {
                card.style.opacity = '0.2';
                card.style.pointerEvents = 'none';
            }

        });
}

/* BOTÕES DE FILTRO*/
export function updateFilterButtons(status) {
    document
        .querySelectorAll('.filter-btn')
        .forEach(button => {

            button.className =
                'filter-btn px-2.5 py-1 text-xs rounded-lg font-medium text-[#D7D7D0]/70 hover:text-[#D7D7D0] transition';

        });

    const activeButton =
        document.getElementById(
            `btn-filter-${status}`
        );

    if (activeButton) {

        activeButton.className =
            'filter-btn px-2.5 py-1 text-xs rounded-lg font-medium transition bg-[#767C53]/30 text-[#D7D7D0] border border-[#767C53]/50';

    }
}