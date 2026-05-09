from fastapi import APIRouter, Request, HTTPException, Depends, Query
from core.config import settings
from sqlalchemy.orm import Session
from models.database import get_db
from models.models import Chat, Message, SystemLog
from services.whatsapp_service import whatsapp_service
import json

router = APIRouter()

@router.get("/webhook")
def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """
    Webhook verification for Meta (WhatsApp API).
    """
    if hub_mode == "subscribe" and hub_verify_token == settings.META_WEBHOOK_VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification token mismatch")

@router.post("/webhook")
async def receive_message(request: Request, db: Session = Depends(get_db)):
    """
    Receive incoming messages from WhatsApp.
    """
    payload = await request.json()
    
    try:
        # Standard WhatsApp Webhook Parsing
        if payload.get("object") == "whatsapp_business_account":
            for entry in payload.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    
                    for msg in messages:
                        phone = msg.get("from")
                        text = msg.get("text", {}).get("body", "")
                        
                        # 1. Update or create Chat
                        chat = db.query(Chat).filter(Chat.phone == phone).first()
                        if not chat:
                            chat = Chat(phone=phone, status="active", last_message=text, last_sender="human")
                            db.add(chat)
                            db.commit()
                            db.refresh(chat)
                        else:
                            chat.last_message = text
                            chat.last_sender = "human"
                            chat.status = "active"
                            db.commit()

                        # 2. Add Message
                        new_msg = Message(chat_id=chat.id, sender="human", content=text)
                        db.add(new_msg)
                        db.commit()
                        
                        # Here we could call n8n webhook or AI Service
                        # For now we just log it
                        log = SystemLog(action="Webhook Recibido", payload=f"De: {phone}", status="success")
                        db.add(log)
                        db.commit()

        return {"status": "ok"}
    except Exception as e:
        log = SystemLog(action="Error procesando webhook", payload=str(e), status="error")
        db.add(log)
        db.commit()
        raise HTTPException(status_code=500, detail="Error processing webhook")
