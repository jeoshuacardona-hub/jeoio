// Logic for Dashboard Page
document.addEventListener("DOMContentLoaded", async () => {
    if (!supabase) return;

    // Fetch and update KPIs
    async function updateKPIs() {
        try {
            // 1. Chats en Vivo (Count from chats table where status = 'active')
            const { count: activeChats } = await supabase
                .from('chats')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            
            if (activeChats !== null) {
                document.getElementById('kpi-chats-vivo').textContent = activeChats;
            }

            // 2. Chats Respondidos (Count from messages where sender = 'bot')
            const { count: answeredChats } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('sender', 'bot');

            if (answeredChats !== null) {
                document.getElementById('kpi-chats-respondidos').textContent = answeredChats.toLocaleString();
            }

            // 3. Ventas Totales (Sum of amount from orders)
            // Using a simple fetch and reduce since sum() is supported in PostgREST but complex to type quickly here
            const { data: orders } = await supabase
                .from('orders')
                .select('amount')
                .eq('status', 'paid');
            
            if (orders) {
                const totalSales = orders.reduce((acc, order) => acc + (Number(order.amount) || 0), 0);
                // Format as currency
                const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalSales);
                document.getElementById('kpi-ventas-totales').textContent = formatted;
            }

            // 4. Chats Abandonados
            const { count: abandonedChats } = await supabase
                .from('chats')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'abandoned');
            
            if (abandonedChats !== null) {
                document.getElementById('kpi-chats-abandonados').textContent = abandonedChats;
            }

        } catch (error) {
            console.error("Error updating KPIs:", error);
        }
    }

    // Fetch Latest Chats
    async function updateLatestChats() {
        try {
            const { data: chats, error } = await supabase
                .from('chats')
                .select('*')
                .order('last_updated', { ascending: false })
                .limit(4);
            
            if (error) throw error;
            
            const container = document.getElementById('latest-chats-container');
            if (!container || !chats) return;

            container.innerHTML = ''; // Clear skeleton

            chats.forEach(chat => {
                const isBot = chat.last_sender === 'bot';
                const statusBadge = isBot ? 
                    '<span class="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-label-sm text-[10px] uppercase tracking-wider">Bot</span>' : 
                    '<span class="px-2 py-1 rounded-md bg-secondary-container/20 border border-secondary-container/30 text-secondary font-label-sm text-[10px] uppercase tracking-wider flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>Human</span>';

                const html = `
                <div class="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-surface-variant ${!isBot ? 'bg-surface-container/30' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                            <span class="material-symbols-outlined text-on-surface-variant">person</span>
                        </div>
                        <div>
                            <p class="font-label-md text-label-md text-on-surface">${chat.phone}</p>
                            <p class="font-label-sm text-label-sm text-on-surface-variant truncate w-32">${chat.last_message || '...'}</p>
                        </div>
                    </div>
                    ${statusBadge}
                </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    }

    // Initialize
    updateKPIs();
    updateLatestChats();

    // Subscribe to realtime changes
    const chatsSubscription = supabase
        .channel('public:chats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, payload => {
            updateKPIs();
            updateLatestChats();
        })
        .subscribe();
});
