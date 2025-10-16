function acheterTicket(prize = '') {
    // Rediriger vers la page de formulaire d'achat
    window.location.href = 'achat-ticket.html';
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

// COMPTEUR DE TICKETS - Calcul depuis le 11 octobre 2025 avec cycle
function gererCompteurTickets() {
    const ticketCountElement = document.querySelector('.ticket-count');
    if (!ticketCountElement) return;
    
    const aujourdHui = new Date();
    const dateDebut = new Date('2025-10-11'); // 11 octobre 2025
    const dateLimite = new Date('2025-11-23'); // 23 novembre 2025
    
    // Vérifier si nous sommes avant le début
    if (aujourdHui < dateDebut) {
        ticketCountElement.textContent = 'Tickets restants : 100';
        ticketCountElement.style.color = '#f11b1b';
        return;
    }
    
    // Vérifier si nous sommes après la date limite
    if (aujourdHui > dateLimite) {
        ticketCountElement.textContent = 'Tirage terminé !';
        ticketCountElement.style.color = '#ff0000';
        return;
    }
    
    // Calculer les jours écoulés depuis le 11 octobre 2025
    const differenceTemps = aujourdHui - dateDebut;
    const joursEcoules = Math.floor(differenceTemps / (1000 * 60 * 60 * 24));
    
    // Calculer les tickets restants (diminue de 5 par jour)
    let ticketsRestants = 100 - (joursEcoules * 5);
    
    // Gérer le cycle - recommencer à 100 quand on arrive à 0 ou en dessous
    if (ticketsRestants <= 0) {
        // Calculer combien de cycles complets se sont passés
        const cycles = Math.floor(Math.abs(ticketsRestants) / 100) + 1;
        ticketsRestants = 100 - (Math.abs(ticketsRestants) % 100);
        
        // Si ticketsRestants est 0 après calcul, remettre à 100
        if (ticketsRestants === 0) {
            ticketsRestants = 100;
        }
    }
    
    // Assurer que c'est entre 1 et 100
    ticketsRestants = Math.max(1, Math.min(100, ticketsRestants));
    
    // Changer la couleur selon le nombre de tickets
    if (ticketsRestants <= 10) {
        ticketCountElement.style.color = '#ff0000'; // Rouge vif
    } else if (ticketsRestants <= 30) {
        ticketCountElement.style.color = '#ff6b00'; // Orange
    } else {
        ticketCountElement.style.color = '#f11b1b'; // Rouge original
    }
    
    // Mettre à jour l'affichage
    ticketCountElement.textContent = `Tickets restants : ${ticketsRestants}`;
    
    console.log(`Tickets calculés: ${ticketsRestants} (jours écoulés depuis 11/10/2025: ${joursEcoules})`);
}

// FONCTION POUR INITIALISER LE DÉFILEMENT EN BANDE PASSANTE
function initialiserDefilementBandePassante() {
    const bandeContainer = document.querySelector('.bottom-images-container');
    const bandeScroll = document.querySelector('.bottom-images-scroll');
    
    if (!bandeContainer || !bandeScroll) {
        console.log('Éléments de bande passante non trouvés');
        return;
    }
    
    // Dupliquer le contenu pour un effet infini
    const items = bandeScroll.querySelectorAll('.bottom-image-item');
    const nombreItems = items.length;
    
    if (nombreItems === 0) {
        console.log('Aucun élément à défiler');
        return;
    }
    
    // Cloner chaque élément et l'ajouter à la fin
    items.forEach(item => {
        const clone = item.cloneNode(true);
        bandeScroll.appendChild(clone);
    });
    
    console.log(`Bande passante initialisée: ${nombreItems} éléments dupliqués`);
    
    // Démarrer l'animation
    bandeScroll.style.animation = 'scrollAffiches 30s linear infinite';
    
    // Gérer le survol pour arrêter/reprendre
    bandeContainer.addEventListener('mouseenter', () => {
        bandeScroll.style.animationPlayState = 'paused';
    });
    
    bandeContainer.addEventListener('mouseleave', () => {
        bandeScroll.style.animationPlayState = 'running';
    });
    
    // Pour mobile
    bandeContainer.addEventListener('touchstart', () => {
        bandeScroll.style.animationPlayState = 'paused';
    });
    
    bandeContainer.addEventListener('touchend', () => {
        setTimeout(() => {
            bandeScroll.style.animationPlayState = 'running';
        }, 2000);
    });
}

// FORCER LE REDÉMARRAGE DE L'ANIMATION
function forcerRedemarrageAnimation() {
    const bandeScroll = document.querySelector('.bottom-images-scroll');
    if (bandeScroll) {
        // Arrêter l'animation
        bandeScroll.style.animation = 'none';
        
        // Forcer le reflow
        void bandeScroll.offsetWidth;
        
        // Redémarrer l'animation
        bandeScroll.style.animation = 'scrollAffiches 30s linear infinite';
        bandeScroll.style.animationPlayState = 'running';
        
        console.log('Animation de la bande passante redémarrée');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Application Cetinfo chargée');
    
    // Initialiser le compteur de tickets
    gererCompteurTickets();
    
    // Initialiser la bande passante des affiches
    initialiserDefilementBandePassante();
    
    // Initialiser la vidéo après le chargement complet
    setTimeout(() => {
        initialiserVideo();
    }, 1000);
    
    // Redémarrer l'animation après un délai pour s'assurer qu'elle fonctionne
    setTimeout(forcerRedemarrageAnimation, 2000);
    
    // Effets d'animation au chargement
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
    
    // Animations d'apparition des sections
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
    
    // Animation pour la section des affiches
    const bottomImagesSection = document.querySelector('.bottom-images-section');
    if (bottomImagesSection) {
        bottomImagesSection.style.opacity = '0';
        bottomImagesSection.style.transform = 'translateY(20px)';
        setTimeout(() => {
            bottomImagesSection.style.transition = 'all 0.8s ease';
            bottomImagesSection.style.opacity = '1';
            bottomImagesSection.style.transform = 'translateY(0)';
        }, 800);
    }
    
    // Gestion du redimensionnement
    window.addEventListener('resize', function() {
        setTimeout(forcerRedemarrageAnimation, 100);
    });
    
    // Gestion de la visibilité
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(forcerRedemarrageAnimation, 100);
        }
    });
});

// Fonction de débogage
function debugBandePassante() {
    const bandeScroll = document.querySelector('.bottom-images-scroll');
    if (bandeScroll) {
        const style = getComputedStyle(bandeScroll);
        console.log('DEBUG BANDE PASSANTE:', {
            element: bandeScroll,
            animation: style.animation,
            animationPlayState: style.animationPlayState,
            childrenCount: bandeScroll.children.length,
            width: bandeScroll.scrollWidth,
            visibleWidth: bandeScroll.clientWidth
        });
    }
}

// Exposer les fonctions globalement
window.debugBandePassante = debugBandePassante;
window.forcerRedemarrageAnimation = forcerRedemarrageAnimation;