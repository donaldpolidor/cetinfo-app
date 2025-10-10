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

// Variables globales pour la vidéo
let video = null;

// Fonction pour initialiser la vidéo
function initialiserVideo() {
    video = document.querySelector('.promo-video');
    if (video) {
        // Forcer la lecture automatique sans mute
        video.play().catch(error => {
            console.log('Lecture automatique bloquée:', error);
            // Si la lecture automatique est bloquée, afficher un message
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                const message = document.createElement('div');
                message.style.background = '#ffeb3b';
                message.style.color = '#333';
                message.style.padding = '10px';
                message.style.borderRadius = '5px';
                message.style.marginTop = '10px';
                message.style.textAlign = 'center';
                message.innerHTML = 'Cliquez sur la vidéo pour la lire';
                videoContainer.appendChild(message);
            }
        });
        
        // Mettre à jour le bouton pause/play
        video.addEventListener('play', function() {
            document.getElementById('playPauseBtn').innerHTML = '⏸️ Pause';
        });
        
        video.addEventListener('pause', function() {
            document.getElementById('playPauseBtn').innerHTML = '▶️ Lecture';
        });
        
        // Mettre à jour le bouton mute
        video.addEventListener('volumechange', function() {
            document.getElementById('muteBtn').innerHTML = video.muted ? '🔇 Son' : '🔊 Muet';
        });
    }
}

// Fonction pour play/pause
function togglePlayPause() {
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

// Fonction pour mute/unmute
function toggleMute() {
    if (video) {
        video.muted = !video.muted;
    }
}

// Fonction pour télécharger la vidéo
function telechargerVideo() {
    const videoUrl = 'video/videopub.mp4';
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'publicite-tirage-cetinfo-2025.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Téléchargement de la vidéo démarré');
}

// Fonction pour partager la vidéo
function partagerVideo() {
    if (navigator.share) {
        navigator.share({
            title: 'Tirage Cetinfo 2025 - Publicité',
            text: 'Découvrez le grand tirage au sort Cetinfo 2025 !',
            url: window.location.href
        })
        .then(() => console.log('Partage réussi'))
        .catch((error) => console.log('Erreur de partage:', error));
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Share
        alert('Copiez le lien de la page pour partager : ' + window.location.href);
    }
}

// Animations au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application Cetinfo chargée');
    
    // Initialiser la vidéo
    initialiserVideo();
    
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
    
    // Animation pour les boutons de contrôle vidéo
    const videoButtons = document.querySelectorAll('.video-control-btn, .download-btn, .share-btn');
    videoButtons.forEach(button => {
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
    
    // Animation pour la section vidéo
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        videoSection.style.opacity = '0';
        videoSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            videoSection.style.transition = 'all 0.8s ease';
            videoSection.style.opacity = '1';
            videoSection.style.transform = 'translateY(0)';
        }, 600);
    }
});