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
    
    // Méthode 1: mailto standard
    const mailtoLink = `mailto:donaldpolidor30@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Méthode 2: Lien Gmail direct
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=donaldpolidor30@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Détection du dispositif
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobile - utiliser mailto standard
        window.location.href = mailtoLink;
    } else {
        // Desktop - Ouvrir Gmail directement dans un nouvel onglet
        // Sans confirmation pour éviter les blocages
        const nouvelleFenetre = window.open(gmailLink, '_blank');
        
        // Si l'ouverture est bloquée, donner les instructions manuelles
        if (!nouvelleFenetre || nouvelleFenetre.closed || typeof nouvelleFenetre.closed == 'undefined') {
            // Popup bloquée - donner les instructions manuelles
            const instructionsManuelles = `
📧 EMAIL BLOQUÉ - INSTRUCTIONS MANUELLES :

Voici le contenu de votre email. Copiez-collez le dans Gmail :

DESTINATAIRE: donaldpolidor30@gmail.com
SUJET: ${subject}

CORPS DU MESSAGE:
${body}

ÉTAPES:
1. Allez sur Gmail (gmail.com)
2. Cliquez sur "Composer"
3. Copiez les informations ci-dessus
4. Envoyez l'email

Cliquez sur OK pour copier le contenu automatiquement.
            `;
            
            if (confirm(instructionsManuelles)) {
                // Copier le contenu dans le presse-papier
                const textArea = document.createElement('textarea');
                textArea.value = `Destinataire: donaldpolidor30@gmail.com\nSujet: ${subject}\n\n${body}`;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                alert('✅ Contenu copié ! Allez sur Gmail et collez-le dans un nouvel email.');
                
                // Ouvrir Gmail dans le même onglet
                window.location.href = 'https://mail.google.com/mail/u/0/#inbox?compose=new';
            }
        } else {
            // Popup ouverte avec succès
            console.log('Gmail ouvert dans un nouvel onglet');
        }
    }
}

function afficherInstructionsEmail() {
    const instructions = `
📧 INSTRUCTIONS POUR ENVOYER L'EMAIL :

1. Une fenêtre Gmail va s'ouvrir avec votre email pré-rempli
2. VÉRIFIEZ que toutes vos informations sont correctes
3. CLIQUEZ sur "Envoyer" pour finaliser votre achat
4. Revenez sur cette page après envoi

⚠️ IMPORTANT : Si une fenêtre popup s'ouvre, autorisez-la.
Votre achat n'est validé que lorsque l'email est envoyé !
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
              `Vérifiez que Gmail s'est ouvert avec votre email pré-rempli.\n` +
              `Si ce n'est pas le cas, suivez les instructions affichées.\n\n` +
              `Vous serez redirigé vers la page d'accueil dans 5 secondes.`);
        
        // Rediriger après 5 secondes
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    });
});