from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from core.config import settings

# Si no hay URL de Supabase configurada, usa SQLite local como fallback de prueba
SQLALCHEMY_DATABASE_URL = settings.SUPABASE_DB_URL or "sqlite:///./stitch_pizza.db"

# Para SQLite necesitamos un connect_arg extra
connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
