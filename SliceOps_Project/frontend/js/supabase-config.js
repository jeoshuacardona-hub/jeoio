// ============================================================
// SliceOps AI - Supabase Configuration (Encrypted / Obfuscated)
// ============================================================
// Las credenciales se almacenan codificadas en Base64 para
// ofuscarlas del código fuente. Reemplaza estos valores con los
// tuyos codificados: btoa("TU_URL") y btoa("TU_KEY") en la
// consola del navegador.
//
// Cuando NO hay credenciales válidas configuradas, el sistema
// entra automáticamente en MODO DEMO con datos de prueba.
// ============================================================

const ENCRYPTED_SUPABASE_URL = "SU5TRVJUQVJfVVJMX0JBU0U2NF9BUVVJ";
const ENCRYPTED_SUPABASE_KEY = "SU5TRVJUQVJfS0VZX0JBU0U2NF9BUVVJ";

// Save the CDN reference before var declaration overrides window.supabase
const _supabaseCDN = window.supabase;

// We use var so it's globally accessible across all script files
var supabase = null;
var DEMO_MODE = true;

(function initSupabase() {
    try {
        const url = atob(ENCRYPTED_SUPABASE_URL);
        const key = atob(ENCRYPTED_SUPABASE_KEY);
        // Only connect to real Supabase if we have valid credentials
        if (url.includes("supabase.co") && key.length > 50 && _supabaseCDN && _supabaseCDN.createClient) {
            supabase = _supabaseCDN.createClient(url, key);
            DEMO_MODE = false;
            console.log("✅ Supabase conectado.");
            return;
        }
    } catch (e) { /* Expected when using placeholder keys */ }

    DEMO_MODE = true;
    console.log("🎭 MODO DEMO activo — usando datos de prueba.");
})();

// ============================================================
// MOCK DATA — Datos de prueba realistas para QA sin Supabase
// ============================================================
const MOCK_CHATS = [
    { id: 1, phone: "+52 55 1234 5678", status: "active", last_message: "Quiero una pizza grande de pepperoni", last_sender: "human", last_updated: new Date().toISOString() },
    { id: 2, phone: "+1 305 987 6543", status: "active", last_message: "Hola, mi pedido está retrasado...", last_sender: "human", last_updated: new Date(Date.now() - 300000).toISOString() },
    { id: 3, phone: "+54 11 4321 8765", status: "active", last_message: "¡Gracias, todo perfecto!", last_sender: "bot", last_updated: new Date(Date.now() - 600000).toISOString() },
    { id: 4, phone: "+34 600 123 456", status: "active", last_message: "¿Aceptan tarjeta de crédito?", last_sender: "human", last_updated: new Date(Date.now() - 900000).toISOString() },
    { id: 5, phone: "+57 310 555 7890", status: "abandoned", last_message: "...", last_sender: "human", last_updated: new Date(Date.now() - 1800000).toISOString() },
    { id: 6, phone: "+52 33 9876 1234", status: "active", last_message: "¿Tienen hawaiana?", last_sender: "human", last_updated: new Date(Date.now() - 2400000).toISOString() },
    { id: 7, phone: "+1 786 222 3344", status: "closed", last_message: "Order delivered. Thank you!", last_sender: "bot", last_updated: new Date(Date.now() - 3600000).toISOString() },
    { id: 8, phone: "+52 81 5555 0001", status: "abandoned", last_message: "", last_sender: "human", last_updated: new Date(Date.now() - 7200000).toISOString() },
];

const MOCK_MESSAGES = {
    1: [
        { id: 1, chat_id: 1, sender: "bot", content: "¡Hola! 🍕 Bienvenido a Stitch Pizza. Soy tu asistente virtual. ¿Qué te puedo ofrecer hoy?", created_at: new Date(Date.now() - 120000).toISOString() },
        { id: 2, chat_id: 1, sender: "human", content: "Quiero una pizza grande de pepperoni", created_at: new Date(Date.now() - 60000).toISOString() },
        { id: 3, chat_id: 1, sender: "bot", content: "¡Excelente elección! 🍕 Una Pizza Grande de Pepperoni ($28.000). ¿Deseas agregar algún extra o bebida?", created_at: new Date(Date.now() - 30000).toISOString() },
    ],
    2: [
        { id: 4, chat_id: 2, sender: "bot", content: "¡Hola! Bienvenido a Stitch Pizza. ¿En qué puedo ayudarte?", created_at: new Date(Date.now() - 600000).toISOString() },
        { id: 5, chat_id: 2, sender: "human", content: "Hola, hice un pedido hace 45 minutos y no ha llegado", created_at: new Date(Date.now() - 540000).toISOString() },
        { id: 6, chat_id: 2, sender: "bot", content: "Lamento la demora. Déjame verificar el estado de tu pedido. ¿Me puedes dar tu número de orden?", created_at: new Date(Date.now() - 500000).toISOString() },
        { id: 7, chat_id: 2, sender: "human", content: "Es el pedido #ORD-9918", created_at: new Date(Date.now() - 400000).toISOString() },
        { id: 8, chat_id: 2, sender: "bot", content: "Tu pedido #ORD-9918 salió hace 10 minutos. El repartidor llegará en aproximadamente 15 minutos. 🛵", created_at: new Date(Date.now() - 350000).toISOString() },
        { id: 9, chat_id: 2, sender: "human", content: "Hola, mi pedido está retrasado...", created_at: new Date(Date.now() - 300000).toISOString() },
    ],
    3: [
        { id: 10, chat_id: 3, sender: "bot", content: "Tu pedido #ORD-9915 ha sido entregado. ¡Esperamos que lo disfrutes! 🎉", created_at: new Date(Date.now() - 700000).toISOString() },
        { id: 11, chat_id: 3, sender: "human", content: "¡Gracias, todo perfecto!", created_at: new Date(Date.now() - 600000).toISOString() },
    ],
    4: [
        { id: 12, chat_id: 4, sender: "human", content: "¿Aceptan tarjeta de crédito?", created_at: new Date(Date.now() - 900000).toISOString() },
        { id: 13, chat_id: 4, sender: "bot", content: "¡Sí! Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex). También aceptamos pagos con Nequi y Daviplata. 💳", created_at: new Date(Date.now() - 850000).toISOString() },
    ],
};

const MOCK_ORDERS = [
    { id: 1, order_id: "#ORD-9921", customer: "Maria Gonzalez", phone: "+52 55 1234 5678", items: "2x Pepperoni, 1x Soda", amount: 42500, status: "completed", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, order_id: "#ORD-9922", customer: "James Smith", phone: "+1 305 987 6543", items: "1x Margherita, 1x Garlic Bread", amount: 28000, status: "processing", created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 3, order_id: "#ORD-9923", customer: "Delivery App P.", phone: "+54 11 4321 8765", items: "3x Meat Lovers, 2x Wings", amount: 85000, status: "paid", created_at: new Date(Date.now() - 900000).toISOString() },
    { id: 4, order_id: "#ORD-9924", customer: "Carlos R.", phone: "+34 600 123 456", items: "1x Veggie Supreme", amount: 22000, status: "completed", created_at: new Date(Date.now() - 600000).toISOString() },
    { id: 5, order_id: "#ORD-9925", customer: "Ana Martínez", phone: "+57 310 555 7890", items: "1x Hawaiian, 2x Soda", amount: 35000, status: "paid", created_at: new Date(Date.now() - 300000).toISOString() },
    { id: 6, order_id: "#ORD-9926", customer: "Roberto López", phone: "+52 33 9876 1234", items: "2x Four Cheese, 1x Caesar Salad", amount: 58000, status: "processing", created_at: new Date(Date.now() - 120000).toISOString() },
];

const MOCK_LOGS = [
    { id: 1, action: "Webhook Recibido", payload: 'Payload: {"type": "message", "from": "+52 55 1234..."}', status: "success", created_at: new Date(Date.now() - 60000).toISOString() },
    { id: 2, action: "Clasificación de Intención por IA", payload: "Intent: 'new_order' (Confidence: 0.97)", status: "success", created_at: new Date(Date.now() - 55000).toISOString() },
    { id: 3, action: "Consulta de Base de Datos", payload: "SELECT * FROM menu WHERE category = 'pizza'...", status: "success", created_at: new Date(Date.now() - 50000).toISOString() },
    { id: 4, action: "Respuesta Generada por IA", payload: "Template: 'order_menu_v3' rendered in 120ms", status: "success", created_at: new Date(Date.now() - 45000).toISOString() },
    { id: 5, action: "Mensaje Enviado", payload: "To: +52 55 1234 5678 via WhatsApp API", status: "success", created_at: new Date(Date.now() - 40000).toISOString() },
    { id: 6, action: "Límite de API Excedido", payload: "WhatsApp API returned 429 Too Many Requests. Retrying in 5s...", status: "error", created_at: new Date(Date.now() - 30000).toISOString() },
    { id: 7, action: "Reintento Exitoso", payload: "Message delivered after retry #1", status: "success", created_at: new Date(Date.now() - 25000).toISOString() },
    { id: 8, action: "Orden Creada", payload: "Order #ORD-9926 - $58.000 COP - 2x Four Cheese", status: "success", created_at: new Date(Date.now() - 10000).toISOString() },
];

// ============================================================
// Mock Supabase-like API for Demo Mode
// ============================================================
class MockQuery {
    constructor(table) {
        this._table = table;
        this._filters = [];
        this._orderCol = null;
        this._orderAsc = true;
        this._limitN = null;
        this._selectFields = '*';
        this._countOnly = false;
        this._headOnly = false;
        this._singleResult = false;
    }

    _getData() {
        switch (this._table) {
            case 'chats': return [...MOCK_CHATS];
            case 'messages': return Object.values(MOCK_MESSAGES).flat();
            case 'orders': return [...MOCK_ORDERS];
            case 'system_logs': return [...MOCK_LOGS];
            default: return [];
        }
    }

    select(fields, opts) {
        this._selectFields = fields || '*';
        if (opts && opts.count === 'exact') this._countOnly = true;
        if (opts && opts.head) this._headOnly = true;
        return this;
    }

    eq(col, val) { this._filters.push({ col, op: 'eq', val }); return this; }
    order(col, opts) { this._orderCol = col; this._orderAsc = opts?.ascending ?? true; return this; }
    limit(n) { this._limitN = n; return this; }
    single() { this._singleResult = true; return this; }

    then(resolve) {
        let data = this._getData();
        for (const f of this._filters) {
            data = data.filter(r => r[f.col] === f.val);
        }
        if (this._orderCol) {
            data.sort((a, b) => {
                const va = a[this._orderCol], vb = b[this._orderCol];
                return this._orderAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
            });
        }
        if (this._limitN) data = data.slice(0, this._limitN);
        if (this._headOnly && this._countOnly) {
            return resolve({ count: data.length, data: null, error: null });
        }
        if (this._singleResult) {
            return resolve({ data: data[0] || null, error: null });
        }
        return resolve({ data, count: data.length, error: null });
    }
}

class MockChannel {
    on() { return this; }
    subscribe() { return this; }
}

const mockSupabase = {
    from(table) { return new MockQuery(table); },
    channel() { return new MockChannel(); },
};

// Si estamos en modo demo, usamos el mock
if (DEMO_MODE) {
    supabase = mockSupabase;
}
