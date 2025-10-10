function acheterTicket(prize = '') {
    if (prize) {
        alert(`Achat de ticket pour: ${prize}\n\nFonctionnalité d'achat de ticket bientôt disponible !`);
        console.log(`Ticket acheté pour: ${prize}`);
    } else {
        alert('Fonctionnalité d\'achat de ticket bientôt disponible !');
        console.log('Achat de ticket pour le tirage général');
    }
}

function retourAccueil() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function previewImage(imageSrc, title) {
    const modal = document.getElementById('imagePreviewModal');
    const modalImg = document.getElementById('previewImage');
    const caption = document.getElementById('imageCaption');
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    caption.textContent = title;
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            closePreview();
        }
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
}

function closePreview() {
    const modal = document.getElementById('imagePreviewModal');
    modal.style.display = 'none';
    document.removeEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
}

let video = null;

function initialiserVideo() {
    video = document.getElementById('promoVideo');
    if (video) {
        // Empêcher la lecture automatique problématique
        video.removeAttribute('autoplay');
        
        video.addEventListener('play', function() {
            document.getElementById('playPauseBtn').innerHTML = '⏸️ Pause';
        });
        
        video.addEventListener('pause', function() {
            document.getElementById('playPauseBtn').innerHTML = '▶️ Lecture';
        });
        
        video.addEventListener('volumechange', function() {
            document.getElementById('muteBtn').innerHTML = video.muted ? '🔇 Son' : '🔊 Muet';
        });

        // Gestion propre des erreurs de lecture
        video.addEventListener('error', function(e) {
            console.error('Erreur vidéo:', e);
        });
    }
}

function togglePlayPause() {
    if (video) {
        if (video.paused) {
            // Lecture avec gestion d'erreur
            video.play().catch(error => {
                console.log('Erreur de lecture:', error);
                alert('Impossible de lire la vidéo. Vérifiez votre connexion ou le format de la vidéo.');
            });
        } else {
            video.pause();
        }
    }
}

function toggleMute() {
    if (video) {
        video.muted = !video.muted;
    }
}

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
        alert('Copiez le lien de la page pour partager : ' + window.location.href);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Application Cetinfo chargée');
    
    // Initialiser la vidéo après le chargement complet
    setTimeout(() => {
        initialiserVideo();
    }, 1000);
    
    const buyButton = document.querySelector('.buy-ticket-btn');
    if (buyButton) {
        buyButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        buyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    const prizeButtons = document.querySelectorAll('.prize-buy-btn');
    prizeButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const videoButtons = document.querySelectorAll('.video-control-btn, .download-btn, .share-btn');
    videoButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
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