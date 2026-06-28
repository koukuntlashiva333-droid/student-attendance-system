from database.db import db

class Class(db.Model):
    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f"<Class {self.class_name}>"