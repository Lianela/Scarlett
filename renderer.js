document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    // Oculta la pantalla de carga
    document.getElementById("loading-screen").style.display = "none";
    // Muestra el contenido principal
    document.getElementById("main-content").style.display = "block";
  }, 5000); // 5 segundos
});