from fastapi import APIRouter,FastAPI

router = APIRouter()

app = FastAPI()


from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def read_users():
    return {"users": ["user1", "user2"]}

@app.post("/users")
def create_user(user: dict):
    return {"user": user}
