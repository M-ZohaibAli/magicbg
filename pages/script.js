  // Function to fetch and display the navbar
  function loadNavbar() {
    fetch('/components/pagesnav.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar').innerHTML = data;

        // Wait for the DOM to update before attaching event listener
        const toggleBtn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');

        if (toggleBtn && menu) {
          toggleBtn.addEventListener('click', function () {
            menu.classList.toggle('hidden');
            console.log("Menu toggle clicked");
          });
        } else {
          console.warn("Toggle button or mobile menu not found in loaded navbar");
        }
      })
      .catch(error => console.error('Error loading navbar:', error));
  }

  // Function to fetch and display the footer
  function loadFooter() {
    fetch('/components/footer.html') // Use consistent relative path
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      })
      .catch(error => console.error('Error loading footer:', error));
  }

  // Call functions on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
  });

