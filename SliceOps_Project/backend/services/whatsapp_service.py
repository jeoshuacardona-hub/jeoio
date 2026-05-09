import httpx
from core.config import settings
import json

class WhatsAppService:
    def __init__(self):
        self.access_token = settings.META_ACCESS_TOKEN
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
        self.base_url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"

    async def send_message(self, to: str, message: str):
        if not self.access_token or not self.phone_number_id:
            print(f"Mock WhatsApp Send to {to}: {message}")
            return {"status": "mocked", "message": message}

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {"body": message}
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()

whatsapp_service = WhatsAppService()
