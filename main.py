from fastapi import Depends, FastAPI
from models import Product
from database import session, engine
import database_model
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware



# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables in DB (runs once when app starts)
database_model.Base.metadata.create_all(bind=engine)

# Temporary in-memory products (used only for initial seeding)
products = [
    Product(id=1, name="phone", description="budget phone", price=99, quantity=10),
    Product(id=2, name="laptop", description="gaming laptop", price=999, quantity=6),
]


# Dependency to get DB session
def get_db():
    db = session()  # create DB session
    try:
        yield db     # give session to API
    finally:
        db.close()   # close session after request


# Function to insert initial data into DB
def init_db():
    db = session()

    # Count how many records already exist
    count = db.query(database_model.Product).count()

    # Only insert if table is empty
    if count == 0:
        for product in products:
            # Convert Pydantic model → dict → SQLAlchemy model
            db.add(database_model.Product(**product.model_dump()))

        db.commit()  # save changes


# Run this when app starts
init_db()


# ================== ROUTES ================== #

# Get all products
@app.get("/products")
def all_products(db: Session = Depends(get_db)):
    db_products = db.query(database_model.Product).all()
    return db_products  # return data from DB


# Get product by ID
@app.get("/product/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()

    if db_product:
        return db_product

    return "product not found"


# Add new product
@app.post("/product")
def add_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_model.Product(**product.model_dump()))
    db.commit()
    return product


# Update product
@app.put("/product")
def update_product(id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()

    if db_product:
        # Update fields one by one
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity

        db.commit()
        return "Product Updated Successfully"

    return "no product found"


# Delete product
@app.delete("/product")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(database_model.Product).filter(database_model.Product.id == id).first()

    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product deleted"

    return "Product not found"