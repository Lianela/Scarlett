document.getElementById('back').addEventListener('click', () => {
    // Código para retroceder en la página web
  });
  
  document.getElementById('forward').addEventListener('click', () => {
    // Código para avanzar en la página web
  });
  
  document.getElementById('search').addEventListener('click', () => {
    const titleElement = document.getElementById('title');
    titleElement.innerHTML = '<input type="text" id="search-bar" placeholder="Escribe para buscar...">';
  });
  