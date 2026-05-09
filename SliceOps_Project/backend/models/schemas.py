from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# --- Chat Schemas ---
class MessageBase(BaseModel):
    sender: str
    content: str

class MessageCreate(MessageBase):
    chat_id: int

class MessageResponse(MessageBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ChatBase(BaseModel):
    phone: str
    status: str = "active"

class ChatCreate(ChatBase):
    pass

class ChatResponse(ChatBase):
    id: int
    last_message: Optional[str] = None
    last_sender: Optional[str] = None
    last_updated: datetime
    messages: List[MessageResponse] = []
    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderBase(BaseModel):
    order_id: str
    customer: Optional[str] = None
    phone: Optional[str] = None
    items: str
    amount: float
    status: str = "pending"

class OrderCreate(OrderBase):
    pass

class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Webhook Schemas ---
class WebhookPayload(BaseModel):
    object: str
    entry: List[Any]

class N8NWebhookPayload(BaseModel):
    action: str
    data: dict
