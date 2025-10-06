const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitar que recargue la página

  // Usar las credenciales correctas directamente
  const email = "admin@admin.com";
  const password = "admin";

  try {
    const response = await fetch('/api/v1/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();

    if (response.ok) {
      // Guardar el token en localStorage o en una variable
      localStorage.setItem('token', data.token);
      alert('Login correcto');
      // Aquí puedes redirigir o mostrar la siguiente vista
      // window.location.href = '/pagina-protegida.html';
    } else {
      alert('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error en la conexión');
  }

  const backendUrl = "http://localhost:3000";
});