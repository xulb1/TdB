document.addEventListener("DOMContentLoaded", function() {
  // Récupérer la div avec l'id "nav-content"
  const navContent = document.getElementById("nav-content");
  
  // deconnect when the button with id docBtn is clicked
  const docBtn = document.getElementById("decoBtn");
  docBtn.addEventListener("click", function () {
    // ajax request to deconnect
    fetch("/api/v1/auth/logout", {
      method: "GET",
      credentials: "same-origin", // include cookies in the request
    })
    .then(response => {
      if (response.ok) {
        // if the response is ok, we redirect to the login page
        window.location.href = "/";
      } else {
        console.error("Failed to log out");
      }
    })
    .catch(error => {
      console.error("An error occurred during logout:", error);
    });
  });

  // Recuperer les Données des services
  const services = [
    { nom: "Service Calendrier", url: "https://www-ensibs.univ-ubs.fr/fr/index.html", droit: "everyone" },
    { nom: "Service Absences", url: "https://www.univ-ubs.fr/fr/index.html", droit: "everyone" },
    { nom: "Service Scolarité", url: "http://gdscol.ensibs.fr:3000/GdScol/liste_etudiant", droit: "everyone" },
    { nom: "Service Soutenance", url: "https://www-ensibs.univ-ubs.fr/fr/index.html", droit: "everyone" },
    { nom: "Service Intervenant", url: "https://www-ensibs.univ-ubs.fr/fr/index.html", droit: "everyone"},
    { nom: "Service Alternances", url: "https://www.univ-ubs.fr/fr/index.html", droit: "everyone" },
    { nom: "Service Stages", url: "https://www-ensibs.univ-ubs.fr/fr/index.html", droit: "everyone" },
    { nom: "Service Mobilité internationale", url: "http://gdmi.ensibs.fr:3000/", droit: "everyone" },
    { nom: "Service Maquettes", url: "http://gdmaq.ensibs.fr:3000/", droit: "everyone" },
    { nom: "Service Processus Internes", url: "http://gdprocint.ensibs.fr:3000/", droit: "everyone" }
  ];

  function genererElements() {
    services.forEach(item => {
      const div = document.createElement("div");
      div.className = "nav-button";
      const icon = document.createElement("i");
      icon.className = "fas fa-chart-line";
      const lien = document.createElement("a");
      lien.href = item.url;
      lien.target = "iframe";
      lien.innerText = item.nom;

      div.appendChild(icon);
      div.appendChild(lien);
      navContent.appendChild(div);
    });
  }

  genererElements();

  const navButtons = document.querySelectorAll(".nav-button");

  // Ajoutez un écouteur d'événement pour chaque bouton de navigation
  navButtons.forEach(button => {
    button.addEventListener("mouseenter", function() {
      this.style.color = "var(--navbar-dark-primary)"; // Change la couleur du texte au survol
  
      const index = Array.from(this.parentElement.children).indexOf(this); // Obtient l'index du bouton survolé
      const highlight = document.getElementById("nav-content-highlight");
  
      // Calcule la hauteur de chaque bouton de manière dynamique
      const buttonHeight = this.clientHeight; // Hauteur du bouton actuellement survolé
      const phi = (1+Math.sqrt(5))/2;
      highlight.style.top = `${(index-(phi-1)) * buttonHeight}px`; // Utilise la hauteur dynamique pour calculer la position
    });


    button.addEventListener("mouseleave", function() {
      // Code à exécuter lorsqu'on quitte le bouton
      this.style.color = "var(--navbar-light-secondary)"; // Restaure la couleur du texte
    });
  });

  // ----------------------------
  // Script gestion du darkmode
  const toggleButton = document.getElementById('theme-toggle');
  const body = document.body;

  // Vérifiez si l'utilisateur a déjà un thème préféré
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = 'Mode clair';
  }

  // Ajouter un gestionnaire d'événement pour le bouton
  toggleButton.addEventListener('click', function() {
    body.classList.toggle('dark-mode');

    // Mettre à jour le texte du bouton
    if (body.classList.contains('dark-mode')) {
      toggleButton.textContent = 'Mode clair';
      localStorage.setItem('theme', 'dark'); // Sauvegarder le thème en mode sombre
    } else {
      toggleButton.textContent = 'Mode sombre';
      localStorage.setItem('theme', 'light'); // Sauvegarder le thème en mode clair
    }
  });
});