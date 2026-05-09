from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from models.database import Base

class ChatStatus(str, enum.Enum):
    active = "active"
    abandoned = "abandoned"
    closed = "closed"

class OrderStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    paid = "paid"
    cancelled = "cancelled"

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(50), unique=True, index=True)
    status = Column(String, default=ChatStatus.active)
    last_message = Column(Text, nullable=True)
    last_sender = Column(String(50), default="human")
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    messages = relationship("Message", back_populates="chat")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender = Column(String(50)) # 'bot', 'human', etc.
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chat = relationship("Chat", back_populates="messages")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(50), unique=True, index=True)
    customer = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    items = Column(Text)
    amount = Column(Float, default=0.0)
    status = Column(String, default=OrderStatus.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100))
    payload = Column(Text, nullable=True)
    status = Column(String(50), default="success") # 'success' or 'error'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
