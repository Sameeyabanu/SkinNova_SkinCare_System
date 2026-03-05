// SkinNova Chatbot - Interactive Customer Support
document.addEventListener('DOMContentLoaded', function () {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');

    // Chatbot responses database
    const responses = {
        greetings: [
            "Hello! My Name is Sameeya Welcome to SkinNova System! 🦄 How can I help you today?",
            "Hi there! I'm your SkinNova assistant. What can I do for you?",
            "Hey! Great to see you! Looking for skincare advice?"
        ],
        products: {
            general: "We have an amazing range of skincare products! 🧴 Our collection includes:\n\n• **Cleansers** - Gentle formulas for all skin types\n• **Serums** - Vitamin C & specialized treatments\n• **Moisturizers** - Hydrating & nourishing creams\n• **Night Creams** - Repair while you sleep\n• **Face Masks** - Deep treatment masks\n\nWould you like to know more about any specific product?",
            cleanser: "Our **Gentle Cleanser** is perfect for daily use! 🫧 It removes impurities without stripping natural oils. Made with natural ingredients and suitable for all skin types. Check it out in our Products section!",
            serum: "Our **Vitamin C Serum** is a customer favorite! ✨ It brightens skin, reduces dark spots, and provides powerful antioxidant protection. Perfect for morning routines!",
            moisturizer: "Our **Hydrating Moisturizer** provides all-day hydration! 💧 Formulated with hyaluronic acid and natural botanicals to keep your skin soft and supple.",
            nightcream: "Our **Night Repair Cream** works while you sleep! 🌙 It helps repair skin damage, reduces fine lines, and promotes cell regeneration.",
            mask: "Our **Magic Mask** is a weekly treat for your skin! 🎭 Deep cleansing and nourishing formula that leaves your skin glowing."
        },
        bestsellers: "Our bestsellers right now are:\n\n🏆 **#1 Vitamin C Serum** - For brightening\n🏆 **#2 Hydrating Moisturizer** - For hydration\n🏆 **#3 Gentle Cleanser** - For daily cleansing\n\nAll of these are loved by our customers for their effectiveness!",
        skincare: {
            routine: "A great skincare routine includes:\n\n☀️ **Morning:**\n1. Cleanser\n2. Serum (Vitamin C)\n3. Moisturizer\n4. Sunscreen\n\n🌙 **Night:**\n1. Cleanser\n2. Treatment Serum\n3. Night Cream\n\nWould you like product recommendations for any step?",
            dryskin: "For dry skin, I recommend:\n• Our **Gentle Cleanser** - Non-drying formula\n• **Hydrating Moisturizer** - Deep hydration\n• **Night Repair Cream** - Intensive overnight repair\n\nThese will help restore your skin's moisture balance! 💦",
            oilyskin: "For oily skin, try:\n• Our **Gentle Cleanser** - Balances oil production\n• **Vitamin C Serum** - Lightweight & effective\n• **Hydrating Moisturizer** - Oil-free hydration\n\nRemember, even oily skin needs hydration! 🌿",
            acne: "For acne-prone skin, I suggest:\n• **Gentle Cleanser** - Won't irritate\n• **Magic Mask** - Deep cleansing (2x weekly)\n• Light moisturizer\n\nAll our products are non-comedogenic! 🌸"
        },
        contact: "You can reach our support team through:\n\n📧 **Email:** sameeyabanu986@gmail.com\n📞 **Phone:** +91 (8147285730)\n📍 **Address:** Maleeha Skincare Lane, Beauty Place, India\n\nWe're here to help! 💕",
        shipping: "We offer shipping across India! 📦\n\n• **Standard Delivery:** 5-7 business days\n• **Express Delivery:** 2-3 business days\n• **Free shipping** on orders over ₹999!\n\nAll orders are carefully packaged to ensure your products arrive safely.",
        returns: "We have a hassle-free return policy! ↩️\n\n• 30-day return window\n• Products must be unused and sealed\n• Full refund or exchange available\n\nContact us at sameeyabanu986@gmail.com for returns.",
        ingredients: "All SkinNova products feature:\n\n🌿 **Natural Ingredients** - Ethically sourced\n🚫 **No Harmful Chemicals** - Paraben & sulfate free\n🐰 **Cruelty-Free** - Never tested on animals\n💚 **Eco-Friendly** - Sustainable packaging\n\nWe believe in clean beauty! 🌍",
        default: "I'm not quite sure about that, but I'd love to help! 🤔\n\nHere are some things I can assist with:\n• Product recommendations\n• Skincare routines\n• Order & shipping info\n• Contact information\n\nOr feel free to reach out to our team at sameeyabanu986@gmail.com"
    };

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function () {
        chatbotContainer.classList.toggle('open');
        if (chatbotContainer.classList.contains('open')) {
            chatbotInput.focus();
        }
    });

    // Minimize chatbot
    chatbotMinimize.addEventListener('click', function () {
        chatbotContainer.classList.remove('open');
    });

    // Handle form submission
    chatbotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatbotInput.value = '';

            // Simulate typing delay
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                const response = getResponse(message);
                addBotMessage(response);
            }, 1000 + Math.random() * 500);
        }
    });

    // Quick reply buttons
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const message = this.getAttribute('data-message');
            addUserMessage(message);

            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                const response = getResponse(message);
                addBotMessage(response);
            }, 1000 + Math.random() * 500);
        });
    });

    // Add user message to chat
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.innerHTML = `<div class="message-content"><p>${escapeHtml(message)}</p></div>`;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot-message';
        // Convert markdown-like formatting to HTML
        const formattedMessage = formatMessage(message);
        messageDiv.innerHTML = `<div class="message-content">${formattedMessage}</div>`;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format message with basic markdown
    function formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '&bull; ');
    }

    // Get response based on user message
    function getResponse(message) {
        const msg = message.toLowerCase();

        // Greetings
        if (msg.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
            return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        }

        // Products
        if (msg.includes('product') || msg.includes('recommend') || msg.includes('what do you sell') || msg.includes('what do you have')) {
            return responses.products.general;
        }

        if (msg.includes('cleanser') || msg.includes('clean')) {
            return responses.products.cleanser;
        }

        if (msg.includes('serum') || msg.includes('vitamin c')) {
            return responses.products.serum;
        }

        if (msg.includes('moistur')) {
            return responses.products.moisturizer;
        }

        if (msg.includes('night') || msg.includes('repair')) {
            return responses.products.nightcream;
        }

        if (msg.includes('mask')) {
            return responses.products.mask;
        }

        // Bestsellers
        if (msg.includes('bestseller') || msg.includes('best seller') || msg.includes('popular') || msg.includes('top product')) {
            return responses.bestsellers;
        }

        // Skincare routines
        if (msg.includes('routine') || msg.includes('how to use') || msg.includes('steps')) {
            return responses.skincare.routine;
        }

        if (msg.includes('dry skin') || msg.includes('dry')) {
            return responses.skincare.dryskin;
        }

        if (msg.includes('oily skin') || msg.includes('oily')) {
            return responses.skincare.oilyskin;
        }

        if (msg.includes('acne') || msg.includes('pimple') || msg.includes('breakout')) {
            return responses.skincare.acne;
        }

        // Contact
        if (msg.includes('contact') || msg.includes('support') || msg.includes('email') || msg.includes('phone') || msg.includes('reach')) {
            return responses.contact;
        }

        // Shipping
        if (msg.includes('ship') || msg.includes('delivery') || msg.includes('deliver')) {
            return responses.shipping;
        }

        // Returns
        if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
            return responses.returns;
        }

        // Ingredients
        if (msg.includes('ingredient') || msg.includes('natural') || msg.includes('organic') || msg.includes('chemical')) {
            return responses.ingredients;
        }

        // Thank you
        if (msg.match(/thank|thanks/)) {
            return "You're welcome! 💕 Is there anything else I can help you with?";
        }

        // Goodbye
        if (msg.match(/bye|goodbye|see you|take care/)) {
            return "Goodbye! 🌸 Thanks for chatting with SkinNova! Come back anytime for skincare advice. Take care of your beautiful skin! 💕";
        }

        // Price inquiry
        if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
            return "For the latest prices, please check our Products section on the website! 💰 All our products are competitively priced and we often have special offers. Sign up for our newsletter to get discount codes!";
        }

        // Default response
        return responses.default;
    }
});
