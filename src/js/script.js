function acheterTicket(prize = '') {
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
}

let video = null;

function initialiserVideo() {
    video = document.getElementById('promoVideo');
    if (video) {
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
    }
}

function togglePlayPause() {
    if (video) {
        if (video.paused) {
            video.play().catch(error => {
                console.log('Erreur de lecture:', error);
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
}

function partagerVideo() {
    if (navigator.share) {
        navigator.share({
            title: 'Tirage Cetinfo 2025 - Publicité',
            text: 'Découvrez le grand tirage au sort Cetinfo 2025 !',
            url: window.location.href
        });
    } else {
        alert('Copiez le lien de la page pour partager : ' + window.location.href);
    }
}

function gererCompteurTickets() {
    const ticketCountElement = document.querySelector('.ticket-count');
    if (!ticketCountElement) return;
    
    const aujourdHui = new Date();
    const dateDebut = new Date('2025-10-11');
    const dateLimite = new Date('2025-11-23');
    
    if (aujourdHui < dateDebut) {
        ticketCountElement.textContent = 'Tickets restants : 100';
        return;
    }
    
    if (aujourdHui > dateLimite) {
        ticketCountElement.textContent = 'Tirage terminé !';
        return;
    }
    
    const differenceTemps = aujourdHui - dateDebut;
    const joursEcoules = Math.floor(differenceTemps / (1000 * 60 * 60 * 24));
    let ticketsRestants = 100 - (joursEcoules * 5);
    
    if (ticketsRestants <= 0) {
        ticketsRestants = 100 - (Math.abs(ticketsRestants) % 100);
        if (ticketsRestants === 0) ticketsRestants = 100;
    }
    
    ticketsRestants = Math.max(1, Math.min(100, ticketsRestants));
    ticketCountElement.textContent = `Tickets restants : ${ticketsRestants}`;
}

function initialiserDefilementBandePassante() {
    const bandeScroll = document.querySelector('.bottom-images-scroll');
    if (!bandeScroll) {
        console.log('Bande passante non trouvée');
        return;
    }
    
    // Dupliquer le contenu pour effet infini
    const contenuOriginal = bandeScroll.innerHTML;
    bandeScroll.innerHTML += contenuOriginal;
    
    console.log('Bande passante initialisée');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Application Cetinfo chargée');
    
    gererCompteurTickets();
    initialiserDefilementBandePassante();
    
    setTimeout(() => {
        initialiserVideo();
    }, 1000);
    
    // Animations
    const buyButton = document.querySelector('.buy-ticket-btn');
    if (buyButton) {
        buyButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        buyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
});