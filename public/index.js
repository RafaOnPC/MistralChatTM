document.addEventListener('DOMContentLoaded', () => {
  const formButton = document.getElementById('generate');
  const userPrompt = document.getElementById('prompt');
  const outputDiv = document.getElementById('output');

  formButton.addEventListener('click', async () => {
    const userInput = userPrompt.value.trim();
    if (!userInput) return;

    const response = await fetch(`/api/query?input=${encodeURIComponent(userInput)}`);
    if (!response.ok) {
      console.error('Error fetching data:', response.statusText);
      return;
    }

    const data = await response.json();

    // Mostrar el mensaje del usuario en el chat
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.innerHTML = `<p>${userInput}</p>`;
    outputDiv.appendChild(userMessage);
    userPrompt.value = '';

    // Mostrar la respuesta del bot en el chat
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>${data.answer}</p>`;
    outputDiv.appendChild(botMessage);

    // Desplazar hacia abajo para ver el nuevo mensaje
    outputDiv.scrollTop = outputDiv.scrollHeight;
  });
});
