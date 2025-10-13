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
    
    // Méthode 1: mailto standard (fonctionne partout)
    const mailtoLink = `mailto:donaldpolidor30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Méthode 2: Lien Gmail direct (pour les utilisateurs Gmail)
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=donaldpolidor30@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Détection du dispositif et choix de la méthode
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobile - utiliser mailto standard
        window.location.href = mailtoLink;
    } else {
        // Desktop - proposer les deux options
        const utiliserGmail = confirm(
            `Voulez-vous ouvrir Gmail pour envoyer l'email ?\n\n` +
            `• Cliquez sur "OK" pour ouvrir Gmail\n` +
            `• Cliquez sur "Annuler" pour utiliser votre client email par défaut`
        );
        
        if (utiliserGmail) {
            // Ouvrir Gmail dans un nouvel onglet
            window.open(gmailLink, '_blank');
        } else {
            // Utiliser le client email par défaut
            window.location.href = mailtoLink;
        }
    }
}

function afficherInstructionsEmail() {
    const instructions = `
📧 INSTRUCTIONS POUR ENVOYER L'EMAIL :

1. Votre client email va s'ouvrir avec un email pré-rempli
2. VÉRIFIEZ que toutes vos informations sont correctes
3. CLIQUEZ sur "Envoyer" pour finaliser votre achat
4. Attendez la confirmation de notre part

⚠️ IMPORTANT : Votre achat n'est validé que lorsque vous avez envoyé l'email et reçu une confirmation !
    `;
    
    return confirm(instructions + "\n\nCliquez sur OK pour continuer");
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
        
        // Afficher les instructions pour l'email
        const continuer = afficherInstructionsEmail();
        if (!continuer) {
            return;
        }
        
        // Envoyer les données par email
        envoyerEmail(formData);
        
        // Message de confirmation final
        alert(`🎉 Formulaire préparé avec succès!\n\n` +
              `Un email a été préparé avec vos informations.\n` +
              `VÉRIFIEZ et ENVOYEZ l'email pour finaliser votre achat.\n\n` +
              `Vous serez redirigé vers la page d'accueil dans 5 secondes.`);
        
        // Rediriger après 5 secondes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    });
});