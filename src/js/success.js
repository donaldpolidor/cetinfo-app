document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les paramètres d'URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });
        
        return params;
    }

    // Récupérer les données depuis l'URL
    const urlParams = getUrlParams();
    
    if (Object.keys(urlParams).length > 0) {
        console.log('📊 Données reçues:', urlParams);
        
        // Générer un numéro de ticket unique
        const ticketNumber = 'CET-' + Date.now().toString().slice(-8);
        document.getElementById('ticketNumber').textContent = `Ticket #${ticketNumber}`;
        
        // Créer l'affichage des détails
        const detailsHTML = `
            <div class="order-details">
                <h3>📦 Détails de votre commande</h3>
                <div class="detail-item">
                    <span class="detail-label">🏆 Prime :</span>
                    <span class="detail-value">${urlParams.prime || 'Non spécifié'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">👤 Client :</span>
                    <span class="detail-value">${urlParams.nom || ''} ${urlParams.prenom || ''}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📧 Email :</span>
                    <span class="detail-value">${urlParams.email || 'Non spécifié'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📞 Téléphone :</span>
                    <span class="detail-value">${urlParams.telephone || 'Non spécifié'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🏠 Adresse :</span>
                    <span class="detail-value">${urlParams.adresse || 'Non spécifié'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">💰 ID Transaction :</span>
                    <span class="detail-value">${urlParams.idTransaction || 'Non spécifié'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📅 Date :</span>
                    <span class="detail-value">${urlParams.date || new Date().toLocaleString('fr-FR')}</span>
                </div>
            </div>
        `;
        
        document.getElementById('orderDetailsContainer').innerHTML = detailsHTML;
        
        // Mettre à jour le lien WhatsApp avec les infos
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const whatsappText = `Bonjour, j'ai acheté un ticket (#${ticketNumber}) pour ${urlParams.prime}. Client: ${urlParams.nom} ${urlParams.prenom}. ID Transaction: ${urlParams.idTransaction}`;
        whatsappBtn.href = `https://wa.me/50937245036?text=${encodeURIComponent(whatsappText)}`;
        
    } else {
        // Aucune donnée dans l'URL
        document.getElementById('orderDetailsContainer').innerHTML = `
            <div class="order-details">
                <h3>📦 Commande enregistrée</h3>
                <p>Votre commande a été traitée avec succès. Vous recevrez les détails par email.</p>
            </div>
        `;
    }
});