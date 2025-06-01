import enum
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db # Import db from the current package (__init__.py)

class UserRole(enum.Enum):
    INVESTOR = "investor"
    PROJECT_OWNER = "project_owner"
    ADMIN = "admin"

class ProjectStatus(enum.Enum):
    DRAFT = "draft"
    FUNDING = "funding"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    CANCELLED = "cancelled"

class InvestmentStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(150), nullable=True)
    role = db.Column(db.Enum(UserRole), default=UserRole.INVESTOR, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    investments = db.relationship("Investment", back_populates="investor", lazy=True)
    projects_owned = db.relationship("Project", back_populates="owner", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    goal_amount = db.Column(db.Numeric(10, 2), nullable=False)
    current_amount = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    status = db.Column(db.Enum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = db.relationship("User", back_populates="projects_owned")
    investments = db.relationship("Investment", back_populates="project", lazy=True, cascade="all, delete-orphan")
    updates = db.relationship("ProjectUpdate", back_populates="project", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.title}>"

class Investment(db.Model):
    __tablename__ = "investments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum(InvestmentStatus), default=InvestmentStatus.PENDING, nullable=False)
    invested_at = db.Column(db.DateTime, default=datetime.utcnow)

    investor = db.relationship("User", back_populates="investments")
    project = db.relationship("Project", back_populates="investments")

    def __repr__(self):
        return f"<Investment {self.id} - User {self.user_id} -> Project {self.project_id}>"

class ProjectUpdate(db.Model):
    __tablename__ = "project_updates"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    update_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    project = db.relationship("Project", back_populates="updates")

    def __repr__(self):
        return f"<ProjectUpdate {self.id} for Project {self.project_id}>"


