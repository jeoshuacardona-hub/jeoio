from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.schemas import OrderCreate, OrderResponse
from models.models import Order, SystemLog

router = APIRouter()

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Crear una nueva orden (llamado desde n8n o desde la app web).
    """
    db_order = db.query(Order).filter(Order.order_id == order.order_id).first()
    if db_order:
        raise HTTPException(status_code=400, detail="Order ID already exists")
    
    new_order = Order(
        order_id=order.order_id,
        customer=order.customer,
        phone=order.phone,
        items=order.items,
        amount=order.amount,
        status=order.status
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    log = SystemLog(action="Orden Creada", payload=f"Order {order.order_id} - {order.amount}", status="success")
    db.add(log)
    db.commit()

    return new_order

@router.get("/", response_model=list[OrderResponse])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtener lista de órdenes.
    """
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders
