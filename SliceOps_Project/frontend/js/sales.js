// Logic for Sales Analysis Page
document.addEventListener("DOMContentLoaded", async () => {
    if (!supabase) return;

    const formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

    async function fetchSalesData() {
        try {
            // Fetch completed orders
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!orders) return;

            // Calculate KPIs
            let totalRevenue = 0;
            let paidCount = 0;

            const tbody = document.getElementById('recent-transactions-tbody');
            if (tbody) tbody.innerHTML = ''; // Clear existing rows

            orders.forEach(order => {
                const amountNum = Number(order.amount) || 0;
                
                // Only sum completed/paid orders for revenue
                if (order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'completed') {
                    totalRevenue += amountNum;
                    paidCount++;
                }

                // Render Table Row
                if (tbody) {
                    let statusBadge = '';
                    switch (order.status.toLowerCase()) {
                        case 'completed':
                        case 'paid':
                            statusBadge = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">Completed</span>`;
                            break;
                        case 'processing':
                            statusBadge = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20">Processing</span>`;
                            break;
                        default:
                            statusBadge = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-variant text-on-surface-variant border border-outline-variant/50">${order.status}</span>`;
                    }

                    const html = `
                    <tr class="hover:bg-surface-container-high/30 transition-colors">
                        <td class="px-6 py-4 font-mono text-sm">${order.order_id || `#ORD-${order.id}`}</td>
                        <td class="px-6 py-4">${order.customer || 'Unknown'}</td>
                        <td class="px-6 py-4 text-on-surface-variant">${order.items || 'N/A'}</td>
                        <td class="px-6 py-4 font-medium">${formatter.format(amountNum)}</td>
                        <td class="px-6 py-4">${statusBadge}</td>
                    </tr>`;
                    tbody.insertAdjacentHTML('beforeend', html);
                }
            });

            // Update KPIs in DOM
            const revenueEl = document.getElementById('kpi-total-revenue');
            if (revenueEl) revenueEl.textContent = formatter.format(totalRevenue);

            const aovEl = document.getElementById('kpi-avg-order-value');
            if (aovEl) {
                const aov = paidCount > 0 ? totalRevenue / paidCount : 0;
                aovEl.textContent = formatter.format(aov);
            }

        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    }

    fetchSalesData();

    // Subscribe to realtime orders
    supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
            fetchSalesData();
        })
        .subscribe();
});
