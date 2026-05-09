import os

class Settings:
    PROJECT_NAME: str = "Stitch Pizza Automation API"
    VERSION: str = "1.0.0"
    
    # Supabase Connection
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_DB_URL: str = os.getenv("SUPABASE_DB_URL", "")  # SQLAlchemy Database URL
    
    # Meta / WhatsApp API
    META_ACCESS_TOKEN: str = os.getenv("META_ACCESS_TOKEN", "")
    META_WEBHOOK_VERIFY_TOKEN: str = os.getenv("META_WEBHOOK_VERIFY_TOKEN", "")
    WHATSAPP_PHONE_NUMBER_ID: str = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    
    # AI Services
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()
