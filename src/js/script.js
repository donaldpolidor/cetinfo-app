function acheterTicket(prize = '') {
    if (prize) {
        alert(`Achat de ticket pour: ${prize}\n\nFonctionnalité d'achat de ticket bientôt disponible !`);
        console.log(`Ticket acheté pour: ${prize}`);
    } else {
        alert('Fonctionnalité d\'achat de ticket bientôt disponible !');
        console.log('Achat de ticket pour le tirage général');
    }
}

// Fonction pour retourner à l'accueil
function retourAccueil() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Fonction pour preview d'image
function previewImage(imageSrc, title) {
    const modal = document.getElementById('imagePreviewModal');
    const modalImg = document.getElementById('previewImage');
    const caption = document.getElementById('imageCaption');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    caption.textContent = title;
    
    // Fermer la modal en cliquant en dehors de l'image
    modal.onclick = function(event) {
        if (event.target === modal) {
            closePreview();
        }
    }
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
}

function closePreview() {
    const modal = document.getElementById('imagePreviewModal');
    modal.style.display = 'none';
    
    // Retirer l'écouteur d'événement
    document.removeEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
}

// Animations au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application Cetinfo chargée');
    
    // Animation pour le bouton principal
    const buyButton = document.querySelector('.buy-ticket-btn');
    
    if (buyButton) {
        buyButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        buyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Animation pour les boutons d'achat des prix
    const prizeButtons = document.querySelectorAll('.prize-buy-btn');
    prizeButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation d'apparition des cartes de caractéristiques
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    // Animation d'apparition des cartes de prix
    const prizeCards = document.querySelectorAll('.prize-card');
    prizeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
    
    // Animation pour le titre de la section des prix
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.style.opacity = '0';
        sectionTitle.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            sectionTitle.style.transition = 'all 0.8s ease';
            sectionTitle.style.opacity = '1';
            sectionTitle.style.transform = 'translateY(0)';
        }, 400);
    }
});