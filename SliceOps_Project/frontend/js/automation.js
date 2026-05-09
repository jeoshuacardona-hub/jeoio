// Logic for Automation/n8n Settings Page
document.addEventListener("DOMContentLoaded", async () => {
    if (!supabase) return;

    async function loadLogs() {
        try {
            const { data: logs, error } = await supabase
                .from('system_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            const logContainer = document.getElementById('execution-log-container');
            if (!logContainer) return;

            logContainer.innerHTML = ''; // clear

            logs.forEach(log => {
                const timeStr = new Date(log.created_at).toLocaleTimeString();
                
                let icon = 'check_circle';
                let colorClass = 'text-primary';
                let bgClass = 'hover:bg-surface-container-highest/20';
                
                if (log.status === 'error') {
                    icon = 'error';
                    colorClass = 'text-error';
                    bgClass = 'bg-error/5 border border-error/10 hover:bg-error-container/10';
                }

                const html = `
                <li class="flex flex-col p-3 rounded-xl transition-colors ${bgClass} mt-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-label-sm text-label-sm ${log.status === 'error' ? 'text-error/80' : 'text-on-surface-variant'}">${timeStr}</span>
                        <span class="material-symbols-outlined text-[16px] ${colorClass}">${icon}</span>
                    </div>
                    <span class="font-body-md text-body-md font-medium text-on-surface">${log.action}</span>
                    <span class="font-body-md text-body-md ${log.status === 'error' ? 'text-error/80' : 'text-on-surface-variant'} truncate mt-0.5">${log.payload}</span>
                </li>`;
                
                logContainer.insertAdjacentHTML('beforeend', html);
            });

        } catch (error) {
            console.error("Error loading logs:", error);
        }
    }

    // Toggle behavior logic can be added here
    const toggles = document.querySelectorAll('[role="switch"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isChecked = toggle.getAttribute('aria-checked') === 'true';
            toggle.setAttribute('aria-checked', !isChecked);
            
            // Visual update
            const circle = toggle.querySelector('span');
            if (!isChecked) {
                toggle.classList.remove('bg-surface-variant');
                toggle.classList.add('bg-primary');
                circle.classList.add('translate-x-6');
            } else {
                toggle.classList.remove('bg-primary');
                toggle.classList.add('bg-surface-variant');
                circle.classList.remove('translate-x-6');
            }

            // Here you would save the configuration to Supabase or trigger an n8n webhook to update settings
        });
    });

    loadLogs();

    // Realtime logs
    supabase
        .channel('public:system_logs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, payload => {
            loadLogs();
        })
        .subscribe();
});
