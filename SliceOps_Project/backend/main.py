from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from models.database import engine, Base
from api.routes import whatsapp, n8n, orders

# Inicializar Base de Datos (Crear tablas si no existen)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend para el sistema avanzado de pizzería de Stitch Pizza Flow Analytics.",
    version=settings.VERSION
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes por ahora
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar Rutas
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["WhatsApp"])
app.include_router(n8n.router, prefix="/api/n8n", tags=["n8n Integrations"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])

@app.get("/health", tags=["System"])
def health_check():
    """
    Endpoint básico de Health Check para comprobar si la API está funcionando.
    """
    return {"status": "ok", "message": "Stitch Pizza API is running and connected."}
