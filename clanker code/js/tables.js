export const tablesData = [
    {
        id: 'T01',
        label: 'Mesa 01',
        capacity: 4,
        status: 'occupied',
        guest: 'John Doe',
        time: '19:30',
        bill: 240,
    },

    {
        id: 'T02',
        label: 'Mesa 02',
        capacity: 4,
        status: 'occupied',
        guest: 'Emma Clark',
        time: '19:45',
        bill: 185,
    },

    {
        id: 'T03',
        label: 'Mesa 03',
        capacity: 4,
        status: 'free',
        guest: 'Disponível',
        time: '--:--',
        bill: 0,
    },

    {
        id: 'T04',
        label: 'Mesa 04',
        capacity: 2,
        status: 'free',
        guest: 'Disponível',
        time: '--:--',
        bill: 0,
    },

    {
        id: 'T05',
        label: 'Mesa 05',
        capacity: 2,
        status: 'cleaning',
        guest: 'Em Limpeza',
        time: '--:--',
        bill: 0,
    },

    {
        id: 'T06',
        label: 'Mesa 06',
        capacity: 4,
        status: 'reserved',
        guest: 'Sarah K. (4p)',
        time: '20:15',
        bill: 0,
    },

    {
        id: 'T07',
        label: 'Mesa 07',
        capacity: 2,
        status: 'free',
        guest: 'Disponível',
        time: '--:--',
        bill: 0,
    },

    {
        id: 'T08',
        label: 'Mesa 08',
        capacity: 6,
        status: 'occupied',
        guest: 'David Johnson',
        time: '20:00',
        bill: 420,
    }
];

/*** Retorna mesa pelo ID.*/
export function getTableById(id) {
    return tablesData.find(table => table.id === id);
}

/*** Retorna todas as mesas.*/
export function getAllTables() {
    return tablesData;
}

/*** Retorna todas as mesas de um determinado status.*/
export function getTablesByStatus(status) {
    return tablesData.filter(table => table.status === status);
}

/*** Altera o status de uma mesa.*/
export function setTableStatus(id, status) {
    const table = getTableById(id);

    if (!table) {
        return false;
    }

    table.status = status;

    if (status === 'free') {
        table.guest = 'Disponível';
        table.time = '--:--';
        table.bill = 0;
    }

    if (status === 'cleaning') {
        table.guest = 'Em Limpeza';
        table.time = '--:--';
        table.bill = 0;
    }

    return true;
}

/*** Cria uma nova reserva.*/
export function assignTable(id, guest, status) {
    const table = getTableById(id);

    if (!table) {
        return false;
    }

    table.status = status;
    table.guest = guest;
    table.time = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (status === 'reserved') {
        table.bill = 0;
    }

    return true;
}

