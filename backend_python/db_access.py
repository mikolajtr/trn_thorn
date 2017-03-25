from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from create_db import Base, Sale


def init_db_session():
    engine = create_engine('sqlite:///reminder.db')
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    return DBSession()


class DbContext:
    def __init__(self):
        self.session = init_db_session()

    def add(self, sale):
        self.session.add(sale)

    def get(self, start_date=None, end_date=None):
        sales = self.session.query(Sale)
        if start_date:
            sales = sales.filter(Sale.date >= start_date)
        if end_date:
            sales = sales.filter(Sale.date <= end_date)
        return sales

    def save_changes(self, category_id, amount):
        self.session.commit()

    def summary(self, start_date=None, end_date=None):
        sales_summary = {}
        sales = self.get(start_date, end_date)

        for sale in sales:
            sales_summary[sale.category_name] = sales_summary.setdefault(sale.category_name, 0) + sale.amount

        return sales_summary