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
        
        // UNIQUEMENT la confirmation d'achat
        const confirmation = confirm(
            `Confirmez-vous l'achat de ${formData.tickets.length} ticket(s) pour un total de ${formData.total.toLocaleString()} Gdes ?`
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