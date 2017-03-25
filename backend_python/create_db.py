from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Sale(Base):
    __tablename__ = 'sale'
    id = Column(Integer, primary_key=True)
    category_id = Column(String, nullable=False)
    category_name = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    date = Column(DateTime, nullable=False)

engine = create_engine('sqlite:///reminder.db')
Base.metadata.create_all(engine)
