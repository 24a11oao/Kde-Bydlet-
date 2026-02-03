// support.js - Support chat widget functionality

let selectedCategory = null;
const operators = ['Pavel', 'Tereza', 'Martin', 'Alžběta'];
let currentOperator = null;

document.addEventListener('DOMContentLoaded', () => {
  const supportBtn = document.getElementById('supportBtn');
  const closeBtn = document.getElementById('closeBtn');
  const chatWindow = document.getElementById('chatWindow');
  const categoriesView = document.getElementById('categoriesView');
  const chatView = document.getElementById('chatView');
  const categoryBtns = document.querySelectorAll('.categoryBtn');
  const backBtn = document.getElementById('backBtn');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Open/Close chat
  supportBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });

  // Category selection
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedCategory = btn.querySelector('p').textContent;
      currentOperator = operators[Math.floor(Math.random() * operators.length)];
      
      // Switch views
      categoriesView.classList.add('hidden');
      chatView.classList.remove('hidden');

      // Clear previous messages and add welcome message
      chatMessages.innerHTML = '';
      addBotMessage(`Jsi v komunikaci s ${currentOperator}. Jak ti mohu pomoci s "${selectedCategory.split(' ')[1]}"?`);
      
      // Focus input
      setTimeout(() => messageInput.focus(), 100);
    });
  });

  // Back to categories
  backBtn.addEventListener('click', () => {
    chatView.classList.add('hidden');
    categoriesView.classList.remove('hidden');
    selectedCategory = null;
    currentOperator = null;
    messageInput.value = '';
  });

  // Send message
  const sendMessage = () => {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    addUserMessage(message);
    messageInput.value = '';

    // Simulate operator response after a delay
    setTimeout(() => {
      addBotMessage(getRandomResponse());
    }, 800 + Math.random() * 400);
  };

  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});

function addUserMessage(text) {
  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex justify-end';
  msgDiv.innerHTML = `
    <div class="bg-blue-600 text-white px-4 py-2 rounded-lg rounded-tr-none max-w-xs">
      <p class="text-sm">${escapeHtml(text)}</p>
    </div>
  `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex justify-start';
  msgDiv.innerHTML = `
    <div class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg rounded-tl-none max-w-xs">
      <p class="text-sm"><strong>${currentOperator}:</strong> ${escapeHtml(text)}</p>
    </div>
  `;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getRandomResponse() {
  const responses = {
    default: [
      'Chápu. Jak se mohu dál pomoci?',
      'Zajímavé. Mohu ti s něčím dalším pomoci?',
      'Děkuji za informaci. Co dalšího ti mohu sdělit?',
      'Rozumím. Mám nějaké další otázky?',
      'Super! Je tam něco ještě?'
    ],
    contract: [
      'Smlouvu si přečti pozorně. Pokud máš specifickou otázku, jsem tu.',
      'U smlouvy je důležitý termín vypovězení. Hledáš něco konkrétního?',
      'Všechny naše smlouvy jsou sjednány podle zákona. Co tě zajímá?',
      'Rád ti vysvětlím jakoukoli část smlouvy. Která část není jasná?'
    ],
    calculator: [
      'Kalkulačka ti pomůže spočítat, jakou část příjmu tvoří nájem.',
      'Doporučuji, aby nájem nepřesáhl 40% tvého příjmu.',
      'Pokud máš dotazy k výpočtu, jsem tu pomoci.',
      'Kalkulačka je jednoduchá - zadej příjem, nájem a ostatní náklady.'
    ],
    offer: [
      'Pokud vidíš chybu v nabídce, dej mi vědět podrobnosti.',
      'Nabídky jsou aktualizovány denně. Můžeš mi sdělit kterou nabídku?',
      'Je to běžně způsoba nasazení. Zkus aktualizovat stránku.',
      'Sorry za problém! Kolik informací v nabídce není správně?'
    ],
    map: [
      'Mapa ti umožňuje vidět disponibilní bydlení po celém státu.',
      'Filtry na mapě ti pomohou najít přesně co hledáš.',
      'Kliknutím na značku na mapě se ti otevře detail nabídky.',
      'Mapa se aktualizuje v reálném čase s novými nabídkami.'
    ],
    other: [
      'Pověz mi víc, ať ti mohu správně pomoci.',
      'Zajímavé! Jak bych ti mohl být užitečný?',
      'Jsem všeho schopen. Ptej se!',
      'Řekni mi více o problému a budu ti moct lépe pomoci.'
    ]
  };

  const category = selectedCategory?.toLowerCase() || 'default';
  let responseList = responses.default;

  if (category.includes('smlouv')) responseList = responses.contract;
  if (category.includes('kalkul')) responseList = responses.calculator;
  if (category.includes('nabídka') || category.includes('nabidka')) responseList = responses.offer;
  if (category.includes('mapa')) responseList = responses.map;
  if (category.includes('ostatní') || category.includes('ostatni')) responseList = responses.other;

  return responseList[Math.floor(Math.random() * responseList.length)];
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
