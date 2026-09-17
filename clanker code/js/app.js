import {
    getTableById,
    setTableStatus,
    assignTable
} from './tables.js';

import {
    renderAllTables,
    renderTableCard,
    updateTopMetrics,
    updateDrawerStatusBadge,
    applyTableFilter,
    updateFilterButtons,
    formatCurrency
} from './table-ui.js';

import {
    openTableDrawer,
    closeTableDrawer,
    openNewOrderModal,
    closeNewOrderModal,
    openConfigModal,
    closeConfigModal,
    openReservationsListModal,
    closeReservationsListModal
} from './modals.js';


/*
|--------------------------------------------------------------------------
| Estado da aplicação
|--------------------------------------------------------------------------
*/

let activeTableId = null;
let currentFilter = 'all';


/*
|--------------------------------------------------------------------------
| Mesa
|--------------------------------------------------------------------------
*/

function openTableDetails(id) {
    const table = getTableById(id);

    if (!table) return;

    activeTableId = id;

    document.getElementById('drawerTableTitle').innerText =
        table.label;

    document.getElementById('drawerTableSubtitle').innerText =
        `Capacidade: ${table.capacity} pessoas`;

    document.getElementById('drawerGuestName').innerText =
        table.guest;

    document.getElementById('drawerTimeIn').innerText =
        table.time;

    document.getElementById('drawerTotalBill').innerText =
        formatCurrency(table.bill);

    updateDrawerStatusBadge(table.status);

    openTableDrawer();
}


function changeTableStatus(status) {
    if (!activeTableId) return;

    const success = setTableStatus(
        activeTableId,
        status
    );

    if (!success) return;

    /*
     * Atualiza o card da mesa
     */
    renderTableCard(activeTableId);

    /*
     * Atualiza o drawer
     */
    updateDrawerStatusBadge(status);

    /*
     * Atualiza os números do topo
     */
    updateTopMetrics();

    /*
     * Mantém o filtro atual
     */
    applyTableFilter(currentFilter);

    /*
     * Atualiza os dados exibidos no drawer
     */
    openTableDetails(activeTableId);
}


/*
|--------------------------------------------------------------------------
| Filtros
|--------------------------------------------------------------------------
*/

function filterTablesByStatus(status) {
    currentFilter = status;

    updateFilterButtons(status);

    applyTableFilter(status);
}


/*
|--------------------------------------------------------------------------
| Nova reserva / novo atendimento
|--------------------------------------------------------------------------
*/

function handleNewReservation(event) {
    event.preventDefault();

    const guest =
        document.getElementById('newGuestName').value.trim();

    const tableId =
        document.getElementById('newGuestTable').value;

    const type =
        document.querySelector(
            'input[name="resType"]:checked'
        )?.value;

    /*
     * Validação básica
     */
    if (!guest) {
        return;
    }

    if (!tableId) {
        return;
    }

    if (!type) {
        return;
    }

    /*
     * Atualiza os dados da mesa
     */
    const success = assignTable(
        tableId,
        guest,
        type
    );

    if (!success) return;

    /*
     * Atualiza a interface
     */
    renderTableCard(tableId);

    updateTopMetrics();

    /*
     * Fecha modal
     */
    closeNewOrderModal();

    /*
     * Limpa formulário
     */
    document.getElementById('newReservationForm').reset();

    /*
     * Reaplica filtro atual
     */
    applyTableFilter(currentFilter);
}


/*
|--------------------------------------------------------------------------
| Eventos das mesas
|--------------------------------------------------------------------------
|
| Como as mesas são criadas dinamicamente por JavaScript,
| não podemos fazer:
|
| document.querySelectorAll('.table-card')
|
| no carregamento inicial.
|
| Em vez disso usamos EVENT DELEGATION.
|
*/

function initializeTableEvents() {
    const tablesContainer =
        document.getElementById('tablesContainer');

    if (!tablesContainer) return;

    tablesContainer.addEventListener('click', event => {
        const card =
            event.target.closest('.table-card');

        if (!card) return;

        const tableId =
            card.dataset.table;

        if (!tableId) return;

        openTableDetails(tableId);
    });
}


/*
|--------------------------------------------------------------------------
| Eventos dos filtros
|--------------------------------------------------------------------------
*/

function initializeFilterEvents() {
    const filterButtons =
        document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const status =
                button.id.replace(
                    'btn-filter-',
                    ''
                );

            filterTablesByStatus(status);
        });
    });
}


/*
|--------------------------------------------------------------------------
| Eventos do Drawer
|--------------------------------------------------------------------------
*/

function initializeDrawerEvents() {
    const statusButtons =
        document.querySelectorAll(
            '.drawer-status-btn'
        );

    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const status =
                button.dataset.status;

            if (!status) return;

            changeTableStatus(status);
        });
    });
}


/*
|--------------------------------------------------------------------------
| Eventos dos Modais
|--------------------------------------------------------------------------
*/

function initializeModalEvents() {

    /*
     * Nova reserva
     */

    document
        .getElementById('openReservationButton')
        ?.addEventListener(
            'click',
            openNewOrderModal
        );

    document
        .getElementById('closeNewReservationButton')
        ?.addEventListener(
            'click',
            closeNewOrderModal
        );

    document
        .getElementById('cancelNewReservationButton')
        ?.addEventListener(
            'click',
            closeNewOrderModal
        );


    /*
     * Configurações
     */

    document
        .getElementById('closeConfigButton')
        ?.addEventListener(
            'click',
            closeConfigModal
        );

    document
        .getElementById('cancelConfigButton')
        ?.addEventListener(
            'click',
            closeConfigModal
        );

    document
        .getElementById('saveConfigButton')
        ?.addEventListener(
            'click',
            closeConfigModal
        );


    /*
     * Lista de reservas
     */

    document
        .getElementById('closeReservationsButton')
        ?.addEventListener(
            'click',
            closeReservationsListModal
        );

    document
        .getElementById('closeReservationsFooterButton')
        ?.addEventListener(
            'click',
            closeReservationsListModal
        );
}


/*
|--------------------------------------------------------------------------
| Formulário de reserva
|--------------------------------------------------------------------------
*/

function initializeReservationForm() {
    const form =
        document.getElementById(
            'newReservationForm'
        );

    if (!form) return;

    form.addEventListener(
        'submit',
        handleNewReservation
    );
}


/*
|--------------------------------------------------------------------------
| Relógio
|--------------------------------------------------------------------------
*/

function initializeClock() {

    function updateClock() {
        const now = new Date();

        const syncElement =
            document.getElementById('syncTime');

        if (!syncElement) return;

        syncElement.innerText =
            now.toLocaleTimeString(
                'pt-BR',
                {
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );
    }

    updateClock();

    setInterval(
        updateClock,
        1000
    );
}


/*
|--------------------------------------------------------------------------
| Inicialização
|--------------------------------------------------------------------------
*/

function initialize() {

    /*
     * 1. Gera as mesas no HTML
     */
    renderAllTables();

    /*
     * 2. Inicializa eventos
     */
    initializeTableEvents();
    initializeFilterEvents();
    initializeDrawerEvents();
    initializeModalEvents();
    initializeReservationForm();

    /*
     * 3. Atualiza informações
     */
    updateTopMetrics();

    /*
     * 4. Inicializa relógio
     */
    initializeClock();
}


/*
|--------------------------------------------------------------------------
| Start
|--------------------------------------------------------------------------
*/

document.addEventListener(
    'DOMContentLoaded',
    initialize
);