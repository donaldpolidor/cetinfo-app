document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAchat');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formMessage = document.getElementById('formMessage');

    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoadingState(true);
        showMessage('⏳ Traitement en cours...', 'info');

        // Récupérer les données
        const formData = {
            prime: document.getElementById('prime').value,
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            telephone: document.getElementById('telephone').value,
            adresse: document.getElementById('adresse').value,
            idTransaction: document.getElementById('idTransaction').value,
            date: new Date().toLocaleString('fr-FR')
        };

        console.log('📝 Données du formulaire:', formData);

        // ENVOYER À FORMSPARK (solution principale)
        submitToFormspark(formData);

        // ESSAYER EMAILJS (solution secondaire)
        attemptEmailJSSend(formData);

        // Rediriger vers le succès
        setTimeout(() => {
            redirectToSuccessPage(formData);
        }, 1500);
    });

    function submitToFormspark(formData) {
        const tempForm = document.createElement('form');
        tempForm.action = 'https://submit-form.com/whOmv63u1';
        tempForm.method = 'POST';
        tempForm.style.display = 'none';

        const fields = {
            'prime': formData.prime,
            'nom': formData.nom,
            'prenom': formData.prenom,
            'email': formData.email,
            'telephone': formData.telephone,
            'adresse': formData.adresse,
            'idTransaction': formData.idTransaction,
            'date': formData.date,
            '_subject': `🎫 NOUVEAU TICKET - ${formData.nom} ${formData.prenom}`,
            '_replyto': formData.email,
            '_from': 'Cetinfo Tickets <noreply@cetinfo.com>'
        };

        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();
        
        setTimeout(() => {
            if (tempForm.parentNode) {
                document.body.removeChild(tempForm);
            }
        }, 3000);
    }

    function attemptEmailJSSend(formData) {
        if (typeof emailjs === 'undefined') {
            console.log('⚠️ EmailJS non disponible');
            return;
        }

        try {
            // Initialiser EmailJS
            emailjs.init("Z0IJnm4Z6YDaat71K");
            
            // Paramètres simples pour EmailJS
            var emailParams = {
                to_name: "Cetinfo Administration",
                from_name: formData.nom + " " + formData.prenom,
                from_email: formData.email,
                prime: formData.prime,
                telephone: formData.telephone,
                transaction: formData.idTransaction,
                date: formData.date
            };

            console.log('📧 Tentative EmailJS:', emailParams);
            
            // Envoyer sans async/await pour éviter les problèmes
            emailjs.send('service_c2unzuc', 'template_ap4n5zt', emailParams)
                .then(function(response) {
                    console.log('✅ EmailJS réussi:', response);
                })
                .catch(function(error) {
                    console.log('⚠️ EmailJS échoué (non critique):', error);
                });
                
        } catch (error) {
            console.log('⚠️ Erreur EmailJS:', error);
        }
    }

    function redirectToSuccessPage(formData) {
        const params = new URLSearchParams();
        params.append('prime', formData.prime);
        params.append('nom', formData.nom);
        params.append('prenom', formData.prenom);
        params.append('email', formData.email);
        params.append('telephone', formData.telephone);
        params.append('adresse', formData.adresse);
        params.append('idTransaction', formData.idTransaction);
        params.append('date', formData.date);

        const successUrl = `success.html?${params.toString()}`;
        window.location.href = successUrl;
    }

    function validateForm() {
        const telephone = document.getElementById('telephone').value;
        const idTransaction = document.getElementById('idTransaction').value;
        const email = document.getElementById('email').value;

        if (!/^[0-9+\-\s]{8,15}$/.test(telephone)) {
            showMessage('❌ Format de téléphone invalide', 'error');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('❌ Format d\'email invalide', 'error');
            return false;
        }

        if (!idTransaction.trim()) {
            showMessage('❌ ID Transaction requis', 'error');
            return false;
        }

        return true;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitText.style.display = 'none';
            loadingSpinner.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        } else {
            submitText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Validation en temps réel
    document.getElementById('telephone').addEventListener('blur', function(e) {
        const value = e.target.value.trim();
        const isValid = /^[0-9+\-\s]{8,15}$/.test(value);
        
        if (value && !isValid) {
            e.target.style.borderColor = '#e74c3c';
        } else {
            e.target.style.borderColor = '#27ae60';
        }
    });

    document.getElementById('email').addEventListener('blur', function(e) {
        const value = e.target.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        
        if (value && !isValid) {
            e.target.style.borderColor = '#e74c3c';
        } else {
            e.target.style.borderColor = '#27ae60';
        }
    });

    console.log('🚀 Formulaire Cetinfo - Version optimisée activée');
});