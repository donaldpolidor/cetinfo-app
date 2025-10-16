// Stockage des quantités
let ticketQuantities = {
    'Motocyclette': 0,
    'Laptop': 0,
    'Freezer': 0,
    'Smart TV': 0,
    'Caméra': 0,
    'Téléphone': 0
};

function retourAccueil() {
    window.location.href = 'index.html';
}

// Fonction pour changer la quantité d'un ticket
function changeQuantity(ticketName, change) {
    const currentQuantity = ticketQuantities[ticketName] || 0;
    let newQuantity = currentQuantity + change;
    
    // Empêcher les quantités négatives
    if (newQuantity < 0) newQuantity = 0;
    
    // Mettre à jour la quantité
    ticketQuantities[ticketName] = newQuantity;
    
    // Mettre à jour le checkbox
    const checkbox = document.querySelector(`.ticket-option[data-ticket="${ticketName}"] .ticket-checkbox`);
    const ticketOption = document.querySelector(`.ticket-option[data-ticket="${ticketName}"]`);
    
    if (newQuantity > 0) {
        checkbox.checked = true;
        ticketOption.classList.add('selected');
    } else {
        checkbox.checked = false;
        ticketOption.classList.remove('selected');
    }
    
    // Mettre à jour l'affichage des tickets sélectionnés
    updateSelectedTickets();
}

function updateSelectedTickets() {
    const selectedTicketsDiv = document.getElementById('selectedTickets');
    const ticketsListDiv = document.getElementById('ticketsList');
    const totalAmountDiv = document.getElementById('totalAmount');
    
    // Filtrer les tickets avec quantité > 0
    const selectedTickets = Object.entries(ticketQuantities)
        .filter(([ticket, quantity]) => quantity > 0)
        .map(([ticket, quantity]) => ({ ticket, quantity }));
    
    if (selectedTickets.length === 0) {
        selectedTicketsDiv.style.display = 'none';
        return null;
    }
    
    selectedTicketsDiv.style.display = 'block';
    ticketsListDiv.innerHTML = '';
    
    let total = 0;
    const ticketsSummary = [];
    
    selectedTickets.forEach(({ ticket, quantity }) => {
        const price = getTicketPrice(ticket);
        const subtotal = price * quantity;
        total += subtotal;
        
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'selected-ticket-item new-ticket';
        ticketDiv.innerHTML = `
            <div class="ticket-info">
                <span class="ticket-name">${ticket}</span>
                <span class="ticket-price">${price.toLocaleString()} Gdes × ${quantity}</span>
            </div>
            <div class="selected-ticket-quantity">
                <button type="button" class="selected-quantity-btn minus" data-ticket="${ticket}">-</button>
                <span class="quantity-value">${quantity}</span>
                <button type="button" class="selected-quantity-btn plus" data-ticket="${ticket}">+</button>
            </div>
            <div class="ticket-subtotal">${subtotal.toLocaleString()} Gdes</div>
        `;
        ticketsListDiv.appendChild(ticketDiv);
        
        // Retirer l'animation après l'affichage
        setTimeout(() => {
            ticketDiv.classList.remove('new-ticket');
        }, 600);
        
        ticketsSummary.push(`${ticket} (${quantity} × ${price.toLocaleString()} Gdes)`);
    });
    
    totalAmountDiv.innerHTML = `<span>${total.toLocaleString()} Gdes</span>`;
    
    // Ajouter les écouteurs d'événements pour les boutons de quantité
    document.querySelectorAll('.selected-quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const ticketName = this.dataset.ticket;
            const isPlus = this.classList.contains('plus');
            changeQuantity(ticketName, isPlus ? 1 : -1);
        });
    });
    
    return {
        tickets: ticketsSummary,
        total: total,
        detailedTickets: selectedTickets
    };
}

// Fonction pour obtenir le prix d'un ticket
function getTicketPrice(ticketName) {
    const prices = {
        'Motocyclette': 1500,
        'Laptop': 1000,
        'Freezer': 1000,
        'Smart TV': 1000,
        'Caméra': 750,
        'Téléphone': 500
    };
    return prices[ticketName] || 0;
}

function envoyerEmail(formData) {
    const ticketsList = formData.tickets.join('\n• ');
    const subject = `Nouvel achat de ${formData.detailedTickets.reduce((sum, t) => sum + t.quantity, 0)} ticket(s) - ${formData.prenom} ${formData.nom}`;
    const body = `
NOUVEL ACHAT DE TICKET(S) CETINFO 2025

👤 INFORMATIONS PERSONNELLES:
• Nom: ${formData.nom}
• Prénom: ${formData.prenom}
• Adresse: ${formData.adresse}
• Téléphone: ${formData.telephone}
• Email: ${formData.email}

🎫 TICKETS ACHETÉS (${formData.detailedTickets.reduce((sum, t) => sum + t.quantity, 0)} ticket(s)):
• ${ticketsList}

💰 MONTANT TOTAL: ${formData.total.toLocaleString()} Gdes

💳 INFORMATIONS DE TRANSACTION:
• ID Transaction: ${formData.transactionId}
• Date: ${formData.date}
• Heure: ${formData.heure}

---
Cet email a été envoyé automatiquement depuis le formulaire d'achat CETINFO.
    `.trim();
    
    // Détection mobile vs desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // MOBILE : Utiliser mailto pour lancer l'app Gmail automatiquement
        const mailtoLink = `mailto:donaldpolidor30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    } else {
        // DESKTOP : Ouvrir Gmail dans un nouvel onglet
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=donaldpolidor30@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const nouvelleFenetre = window.open(gmailLink, '_blank');
        
        // Si popup bloquée, ouvrir dans le même onglet
        if (!nouvelleFenetre || nouvelleFenetre.closed || typeof nouvelleFenetre.closed == 'undefined') {
            window.location.href = 'https://mail.google.com/mail/u/0/#inbox?compose=new';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('achatForm');
    
    // Initialiser les écouteurs d'événements pour les options de ticket
    const ticketOptions = document.querySelectorAll('.ticket-option');
    ticketOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            const ticketName = this.dataset.ticket;
            
            if (ticketQuantities[ticketName] === 0) {
                // Premier clic : cocher et mettre la quantité à 1
                const checkbox = this.querySelector('.ticket-checkbox');
                checkbox.checked = true;
                this.classList.add('selected');
                changeQuantity(ticketName, 1);
            } else {
                // Clic suivant : décocher et réinitialiser
                const checkbox = this.querySelector('.ticket-checkbox');
                checkbox.checked = false;
                this.classList.remove('selected');
                changeQuantity(ticketName, -ticketQuantities[ticketName]);
            }
        });
    });
    
    // Initialiser les écouteurs d'événements pour les checkboxes
    const checkboxes = document.querySelectorAll('.ticket-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const ticketOption = this.closest('.ticket-option');
            const ticketName = ticketOption.dataset.ticket;
            
            if (this.checked) {
                ticketOption.classList.add('selected');
                // Initialiser la quantité à 1 si c'est la première sélection
                if (ticketQuantities[ticketName] === 0) {
                    changeQuantity(ticketName, 1);
                }
            } else {
                ticketOption.classList.remove('selected');
                // Réinitialiser la quantité à 0
                changeQuantity(ticketName, -ticketQuantities[ticketName]);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les tickets sélectionnés
        const ticketsData = updateSelectedTickets();
        if (!ticketsData || ticketsData.detailedTickets.length === 0) {
            alert('Veuillez sélectionner au moins un ticket');
            return;
        }
        
        // Récupérer les données du formulaire
        const maintenant = new Date();
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            adresse: document.getElementById('adresse').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            email: document.getElementById('email').value.trim(),
            transactionId: document.getElementById('transactionId').value.trim(),
            tickets: ticketsData.tickets,
            total: ticketsData.total,
            detailedTickets: ticketsData.detailedTickets,
            date: maintenant.toLocaleDateString('fr-FR'),
            heure: maintenant.toLocaleTimeString('fr-FR')
        };
        
        // Validation basique
        if (!formData.transactionId) {
            alert('Veuillez saisir le ID Transaction');
            return;
        }
        
        // Confirmation d'achat
        const totalTickets = formData.detailedTickets.reduce((sum, t) => sum + t.quantity, 0);
        const confirmation = confirm(
            `Confirmez-vous l'achat de ${totalTickets} ticket(s) pour un total de ${formData.total.toLocaleString()} Gdes ?`
        );
        
        if (!confirmation) {
            return;
        }
        
        // Envoyer les données par email IMMÉDIATEMENT
        envoyerEmail(formData);
        
        // Rediriger après 3 secondes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
});

// Empêcher le zoom sur les inputs sur iOS
document.addEventListener('touchstart', function() {}, { passive: true });