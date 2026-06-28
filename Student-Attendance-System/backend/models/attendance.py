from database.db import db


class Attendance(db.Model):

    __tablename__ = "attendance"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        nullable=False
    )

    attendance_date = db.Column(
        db.String(20),
        nullable=False
    )

    reason = db.Column(
        db.String(300),
        nullable=True
    )