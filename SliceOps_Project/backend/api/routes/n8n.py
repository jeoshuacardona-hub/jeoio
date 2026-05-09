from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.schemas import N8NWebhookPayload
from models.models import Order, SystemLog
from services.ai_service import ai_service
from services.whatsapp_service import whatsapp_service

router = APIRouter()

@router.post("/process-intent")
async def process_intent(payload: N8NWebhookPayload, db: Session = Depends(get_db)):
    """
    Endpoint para que n8n consulte al backend de Python sobre la intención de un mensaje usando IA.
    """
    prompt = payload.data.get("message", "")
    context = payload.data.get("context", "")
    
    # Usar el servicio de IA
    response_text = await ai_service.generate_response(prompt, context)
    
    # Registrar la acción
    log = SystemLog(action="Clasificación por IA", payload=f"Intent processed for: {prompt[:20]}...", status="success")
    db.add(log)
    db.commit()

    return {"intent_response": response_text}

@router.post("/send-message")
async def send_message_from_n8n(payload: N8NWebhookPayload, db: Session = Depends(get_db)):
    """
    Endpoint para que n8n o la BD le pidan al backend que envíe un mensaje de WhatsApp.
    """
    to = payload.data.get("phone")
    message = payload.data.get("message")
    
    if not to or not message:
        raise HTTPException(status_code=400, detail="Missing phone or message")

    response = await whatsapp_service.send_message(to, message)
    
    log = SystemLog(action="Mensaje Enviado", payload=f"To: {to}", status="success")
    db.add(log)
    db.commit()

    return response
