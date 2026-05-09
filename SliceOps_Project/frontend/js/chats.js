// Logic for Live Chats Page
document.addEventListener("DOMContentLoaded", async () => {
    if (!supabase) return;

    let currentChatId = null;

    async function loadChatsList() {
        try {
            const { data: chats, error } = await supabase
                .from('chats')
                .select('*')
                .order('last_updated', { ascending: false });

            if (error) throw error;
            
            const listContainer = document.getElementById('chat-list-container');
            if (!listContainer) return;
            
            listContainer.innerHTML = ''; // clear

            chats.forEach(chat => {
                const isActive = currentChatId === chat.id;
                
                // Badges
                let badge = '';
                if (chat.status === 'active') {
                    badge = `<span class="px-2 py-0.5 rounded-md bg-surface-container-high border border-surface-variant text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider">Active</span>`;
                } else if (chat.last_sender === 'bot') {
                    badge = `<span class="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-label-sm text-[10px] uppercase tracking-wider">Bot</span>`;
                } else {
                    badge = `<span class="px-2 py-0.5 rounded-md bg-secondary-container/20 border border-secondary-container/30 text-secondary font-label-sm text-[10px] uppercase tracking-wider flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>Human</span>`;
                }

                const html = `
                <div class="flex items-center justify-between p-4 border-b border-surface-variant/30 hover:bg-surface-container-highest/20 transition-colors cursor-pointer ${isActive ? 'bg-surface-container-highest/30 border-l-2 border-l-primary' : ''}" data-chat-id="${chat.id}">
                    <div class="flex items-center gap-3 w-full overflow-hidden">
                        <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
                            <span class="material-symbols-outlined text-on-surface-variant">person</span>
                        </div>
                        <div class="flex flex-col flex-1 min-w-0 pr-2">
                            <div class="flex justify-between items-baseline mb-0.5">
                                <span class="font-label-md text-label-md font-semibold text-on-surface truncate">${chat.phone}</span>
                                <span class="font-label-sm text-[10px] text-on-surface-variant whitespace-nowrap">Just now</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <p class="font-body-md text-body-md text-on-surface-variant truncate text-sm w-3/4">${chat.last_message || '...'}</p>
                                ${badge}
                            </div>
                        </div>
                    </div>
                </div>`;
                
                listContainer.insertAdjacentHTML('beforeend', html);
            });

            // Add click listeners
            listContainer.querySelectorAll('[data-chat-id]').forEach(el => {
                el.addEventListener('click', () => {
                    currentChatId = el.getAttribute('data-chat-id');
                    loadMessages(currentChatId);
                    loadChatsList(); // Re-render to update active state
                });
            });

            // Auto-load first chat if none selected
            if (!currentChatId && chats.length > 0) {
                currentChatId = chats[0].id;
                loadMessages(currentChatId);
                loadChatsList();
            }

        } catch (error) {
            console.error("Error loading chat list:", error);
        }
    }

    async function loadMessages(chatId) {
        if (!chatId) return;
        try {
            // Update Header
            const { data: chatData } = await supabase.from('chats').select('phone').eq('id', chatId).single();
            if (chatData) {
                const headerName = document.getElementById('chat-header-name');
                if (headerName) headerName.textContent = chatData.phone;
            }

            const { data: messages, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const chatWindow = document.getElementById('chat-window-container');
            if (!chatWindow) return;

            chatWindow.innerHTML = '';

            messages.forEach(msg => {
                const isBot = msg.sender === 'bot';
                
                let html = '';
                if (isBot) {
                    html = `
                    <div class="flex flex-col items-start max-w-[80%]">
                        <div class="flex items-center gap-2 mb-1 pl-1">
                            <span class="material-symbols-outlined text-[14px] text-primary">robot_2</span>
                            <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">AI Assistant</span>
                            <span class="font-label-sm text-[11px] text-on-surface-variant/50">${new Date(msg.created_at).toLocaleTimeString()}</span>
                        </div>
                        <div class="bg-surface-container-high text-on-surface px-5 py-3 rounded-2xl rounded-tl-sm border border-surface-variant/50 shadow-sm font-body-md text-body-md">
                            ${msg.content}
                        </div>
                    </div>`;
                } else {
                    html = `
                    <div class="flex flex-col items-end max-w-[80%] self-end">
                        <div class="flex items-center gap-2 mb-1 pr-1">
                            <span class="font-label-sm text-[11px] text-on-surface-variant/50">${new Date(msg.created_at).toLocaleTimeString()}</span>
                            <span class="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Customer</span>
                            <span class="material-symbols-outlined text-[14px] text-secondary">person</span>
                        </div>
                        <div class="bg-primary/20 text-on-surface px-5 py-3 rounded-2xl rounded-tr-sm border border-primary/30 shadow-sm font-body-md text-body-md">
                            ${msg.content}
                        </div>
                    </div>`;
                }
                chatWindow.insertAdjacentHTML('beforeend', html);
            });
            
            // Scroll to bottom
            chatWindow.scrollTop = chatWindow.scrollHeight;

        } catch (error) {
            console.error("Error loading messages:", error);
        }
    }

    // Input Handling
    const inputField = document.getElementById('chat-input-field');
    const sendBtn = document.getElementById('chat-send-btn');

    async function sendMessage() {
        if (!inputField || !currentChatId) return;
        const text = inputField.value.trim();
        if (!text) return;

        inputField.value = '';

        try {
            // In a real scenario, this writes to Supabase, which triggers n8n, or viceversa.
            await supabase.from('messages').insert([
                { chat_id: currentChatId, sender: 'bot', content: text } // Simulating human taking over via the dashboard
            ]);
            
            // Update last message in chat
            await supabase.from('chats').update({ last_message: text, last_sender: 'bot', last_updated: new Date() }).eq('id', currentChatId);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (inputField) inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initialize
    loadChatsList();

    // Subscribe to realtime changes
    supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            if (payload.new.chat_id === currentChatId) {
                loadMessages(currentChatId);
            }
            loadChatsList(); // To update last message preview
        })
        .subscribe();
});
