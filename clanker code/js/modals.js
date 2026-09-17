export function openModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.remove('hidden');
}


export function closeModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        return;
    }

    modal.classList.add('hidden');
}


/* Nova reserva / mesa*/

export function openNewOrderModal() {
    openModal('newReservationModal');
}

export function closeNewOrderModal() {
    closeModal('newReservationModal');
}


/* Configuração*/

export function openConfigModal() {
    openModal('configModal');
}

export function closeConfigModal() {
    closeModal('configModal');
}


/*Lista de reservas*/

export function openReservationsListModal() {
    openModal('reservationsListModal');
}

export function closeReservationsListModal() {
    closeModal('reservationsListModal');
}


/*Drawer da mesa*/

export function openTableDrawer() {
    openModal('tableDrawerModal');
}

export function closeTableDrawer() {
    closeModal('tableDrawerModal');
}