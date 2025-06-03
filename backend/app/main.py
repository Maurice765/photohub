from typing import Union
import oracledb
from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Field, Session, SQLModel, create_engine
from sqlalchemy.engine import URL


class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    secret_name: str = Field(max_length=255)
    age: int | None = None

engine = create_engine(
    f'oracle+oracledb://:@',
        thick_mode=False,
        connect_args={
            "user": "photohub",
            "password": "admin",
            "host": "localhost",
            "port": 1521,
            "service_name": "ORCLPDB1"
    })

SQLModel.metadata.create_all(engine)

app = FastAPI()

def create_heroes():
    hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")
    hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador")
    hero_3 = Hero(name="Rusty-Man", secret_name="Tommy Sharp", age=48)

    with Session(engine) as session:
        session.add(hero_1)
        session.add(hero_2)
        session.add(hero_3)

        session.commit()


create_heroes()