
from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db import db
from models.student import Student
from models.attendance import Attendance
from models.class_model import Class
from models.user import User

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
app = Flask(__name__)

CORS(app)

app.config["JWT_SECRET_KEY"] = "super_secret_key_123"

jwt = JWTManager(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///students.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)







# Home route
@app.route("/")
def home():
    return "Student Attendance Management Backend Running"


# ----------------registration api# ---------------- #

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    existing_user = User.query.filter(
        (User.email == data["email"]) |
        (User.username == data["username"])
    ).first()

    if existing_user:

        return jsonify({
            "message": "User already exists"
        }), 400


    hashed_password = generate_password_hash(
        data["password"]
    )


    user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful"
    })

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404


    if not check_password_hash(
        user.password,
        data["password"]
    ):

        return jsonify({
            "message": "Invalid password"
        }), 401
    
    token = create_access_token(
    identity=str(user.id)
)
    
    return jsonify({

    "message": "Login successful",

    "token": token,

    "user": {

        "id": user.id,
        "username": user.username,
        "email": user.email

    }

})




# ---------------- STUDENT ROUTES ---------------- #

# Get all students
@app.route("/students", methods=["GET"])
@jwt_required()
def get_students():

    class_id = request.args.get("class_id")

    if class_id:
        students = Student.query.filter_by(
            class_id=class_id
        ).all()
    else:
        students = Student.query.all()

    result = []

    for student in students:
        result.append({
    "id": student.id,
    "name": student.name,
    "roll_no": student.roll_no,
    "department": student.department,
    "phone": student.phone,
    "class_id": student.class_id,
    "class_name": (
        Class.query.get(student.class_id).class_name
        if student.class_id
        else "No Class"
    )
})

    return jsonify(result)


# Add student
@app.route("/students", methods=["POST"])
@jwt_required()
def add_student():

    data = request.get_json()

    new_student = Student(
        name=data["name"],
        roll_no=data["roll_no"],
        department=data["department"],
        phone=data["phone"],
        class_id=data["class_id"]
    )

    db.session.add(new_student)
    db.session.commit()

    return jsonify({
        "message": "Student added successfully"
    })

@app.route("/students/<int:id>", methods=["PUT"])
@jwt_required()
def update_student(id):

    student = Student.query.get(id)

    if not student:
        return jsonify({
            "message": "Student not found"
        }), 404

    data = request.get_json()

    student.name = data["name"]
    student.roll_no = data["roll_no"]
    student.department = data["department"]
    student.phone = data["phone"]
    student.class_id = data["class_id"]

    db.session.commit()

    return jsonify({
        "message": "Student updated successfully"
    })

@app.route("/students/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_student(id):
    student = Student.query.get(id)

    if not student:
        return jsonify({"message": "Student not found"}), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({"message": "Student deleted successfully"})

                           #class api

@app.route("/classes", methods=["GET"])
@jwt_required()
def get_classes():
    classes = Class.query.all()

    result = []

    for c in classes:
        result.append({
            "id": c.id,
            "class_name": c.class_name,
            "department": c.department,
            "year": c.year,
            "section": c.section
        })

    return jsonify(result)

@app.route("/classes", methods=["POST"])
@jwt_required()
def add_class():

    data = request.get_json()

    new_class = Class(
        class_name=data["class_name"],
        department=data["department"],
        year=data["year"],
        section=data["section"]
    )

    db.session.add(new_class)
    db.session.commit()

    return jsonify({
        "message": "Class added successfully"
    })

@app.route("/classes/<int:id>", methods=["PUT"])
@jwt_required()
def update_class(id):

    c = Class.query.get(id)

    if not c:
        return jsonify({"message": "Class not found"}), 404

    data = request.get_json()

    c.class_name = data["class_name"]
    c.department = data["department"]
    c.year = data["year"]
    c.section = data["section"]

    db.session.commit()

    return jsonify({
        "message": "Class updated successfully"
    })

@app.route("/classes/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_class(id):

    c = Class.query.get(id)

    if not c:
        return jsonify({"message": "Class not found"}), 404

    db.session.delete(c)
    db.session.commit()

    return jsonify({
        "message": "Class deleted successfully"
    })

# ---------------- ATTENDANCE ROUTES ---------------- #

# Mark attendance
@app.route("/attendance", methods=["POST"])
@jwt_required()
def mark_attendance():
    data = request.get_json()

    student_id = data["student_id"]
    selected_date = data["attendance_date"]

    existing = Attendance.query.filter_by(
        student_id=student_id,
        attendance_date=selected_date
    ).first()

    # If already exists, update instead of blocking
    if existing:
        existing.status = data["status"]
        existing.reason = data.get("reason", "")

        db.session.commit()

        return jsonify({
            "message": "Attendance updated successfully"
        })

    # Otherwise create new record
    new_attendance = Attendance(
        student_id=student_id,
        status=data["status"],
        attendance_date=selected_date,
        reason=data.get("reason", "")
    )

    db.session.add(new_attendance)
    db.session.commit()

    return jsonify({
        "message": "Attendance saved successfully"
    })


# Get all attendance
@app.route("/attendance", methods=["GET"])
@jwt_required()
def get_attendance():
    records = Attendance.query.all()

    result = []

    for record in records:
        result.append({
            "id": record.id,
            "student_id": record.student_id,
            "status": record.status,
            "date": record.attendance_date,
            "reason": record.reason
        })

    return jsonify(result)


# Attendance percentage
@app.route("/attendance/percentage/<int:student_id>", methods=["GET"])
@jwt_required()
def attendance_percentage(student_id):
    total = Attendance.query.filter_by(student_id=student_id).count()

    present = Attendance.query.filter_by(
        student_id=student_id,
        status="Present"
    ).count()

    if total == 0:
        return jsonify({"percentage": 0})

    percentage = (present / total) * 100

    return jsonify({"percentage": round(percentage, 2)})


# Attendance risk detection
@app.route("/attendance/risk/<int:student_id>", methods=["GET"])
@jwt_required()
def risk(student_id):
    total = Attendance.query.filter_by(student_id=student_id).count()

    absent = Attendance.query.filter_by(
        student_id=student_id,
        status="Absent"
    ).count()

    if total == 0:
        return jsonify({"risk": "No data"})

    percentage = (absent / total) * 100

    if percentage > 30:
        return jsonify({"risk": "High Risk"})

    return jsonify({"risk": "Safe"})


# Clear attendance (for testing)
@app.route("/clear-attendance")
@jwt_required()
def clear_attendance():
    Attendance.query.delete()
    db.session.commit()
    return jsonify({"message": "Attendance cleared"})

@app.route("/dashboard-stats", methods=["GET"])
@jwt_required()
def dashboard_stats():

    total_students = Student.query.count()
    total_classes = Class.query.count()
    total_attendance = Attendance.query.count()

    risky_students = 0

    students = Student.query.all()

    for student in students:

        total = Attendance.query.filter_by(
            student_id=student.id
        ).count()

        present = Attendance.query.filter_by(
            student_id=student.id,
            status="Present"
        ).count()

        if total > 0:

            percentage = (present / total) * 100

            if percentage < 75:
                risky_students += 1

    return jsonify({
        "total_students": total_students,
        "total_classes": total_classes,
        "total_attendance": total_attendance,
        "risky_students": risky_students
    })

# ---------------- LOGIN ---------------- #




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)