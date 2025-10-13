function retourAccueil() {
    window.location.href = 'index.html';
}

function updateSelectedTickets() {
    const checkboxes = document.querySelectorAll('.ticket-checkbox:checked');
    const selectedTicketsDiv = document.getElementById('selectedTickets');
    const ticketsListDiv = document.getElementById('ticketsList');
    const totalAmountDiv = document.getElementById('totalAmount');
    
    if (checkboxes.length === 0) {
        selectedTicketsDiv.style.display = 'none';
        return null;
    }
    
    selectedTicketsDiv.style.display = 'block';
    ticketsListDiv.innerHTML = '';
    
    let total = 0;
    const ticketsSummary = [];
    
    checkboxes.forEach(checkbox => {
        const [ticketName, priceStr] = checkbox.value.split('-');
        const price = parseInt(priceStr);
        total += price;
        
        const ticketDiv = document.createElement('div');
        ticketDiv.className = 'selected-ticket-item';
        ticketDiv.innerHTML = `
            <span class="ticket-name">${ticketName}</span>
            <span class="ticket-price">${price.toLocaleString()} Gdes</span>
        `;
        ticketsListDiv.appendChild(ticketDiv);
        
        ticketsSummary.push(`${ticketName} (${price.toLocaleString()} Gdes)`);
    });
    
    totalAmountDiv.textContent = `💰 Total: ${total.toLocaleString()} Gdes`;
    
    return {
        tickets: ticketsSummary,
        total: total
    };
}

function envoyerEmail(formData) {
    const ticketsList = formData.tickets.join('\n• ');
    const subject = `Nouvel achat de ${formData.tickets.length} ticket(s) - ${formData.prenom} ${formData.nom}`;
    const body = `
NOUVEL ACHAT DE TICKET(S) CETINFO 2025

👤 INFORMATIONS PERSONNELLES:
• Nom: ${formData.nom}
• Prénom: ${formData.prenom}
• Adresse: ${formData.adresse}
• Téléphone: ${formData.telephone}
• Email: ${formData.email}

🎫 TICKETS ACHETÉS (${formData.tickets.length} ticket(s)):
• ${ticketsList}

💰 MONTANT TOTAL: ${formData.total.toLocaleString()} Gdes

💳 INFORMATIONS DE TRANSACTION:
• ID Transaction: ${formData.transactionId}
• Date: ${formData.date}
• Heure: ${formData.heure}

---
Cet email a été envoyé automatiquement depuis le formulaire d'achat Cetinfo.
    `.trim();
    
    const mailtoLink = `mailto:donaldpolidor30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('achatForm');
    const checkboxes = document.querySelectorAll('.ticket-checkbox');
    
    // Mettre à jour l'affichage quand un checkbox est cliqué
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedTickets);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les tickets sélectionnés
        const ticketsData = updateSelectedTickets();
        if (!ticketsData || ticketsData.tickets.length === 0) {
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
            date: maintenant.toLocaleDateString('fr-FR'),
            heure: maintenant.toLocaleTimeString('fr-FR')
        };
        
        // Validation basique
        if (!formData.transactionId) {
            alert('Veuillez saisir le ID Transaction');
            return;
        }
        
        // Confirmation avant envoi
        const confirmation = confirm(
            `Confirmez-vous l'achat de ${formData.tickets.length} ticket(s) pour un total de ${formData.total.toLocaleString()} Gdes ?`
        );
        
        if (!confirmation) {
            return;
        }
        
        // Envoyer les données par email
        envoyerEmail(formData);
        
        // Message de confirmation
        alert(`🎉 Formulaire soumis avec succès!\n\nVous avez acheté ${formData.tickets.length} ticket(s) pour ${formData.total.toLocaleString()} Gdes\n\nUn email a été préparé avec vos informations.\nVeuillez l'envoyer pour finaliser votre achat.\n\nMerci pour votre participation!`);
        
        // Rediriger après 3 secondes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
});