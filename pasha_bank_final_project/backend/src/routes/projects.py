from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Project, User, ProjectStatus, ProjectUpdate # Added ProjectUpdate
from .. import db
from datetime import datetime # Added datetime import
from decimal import Decimal # Added Decimal import

projects_bp = Blueprint("projects", __name__)

# Helper function to serialize project data
def serialize_project(project):
    return {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "category": project.category,
        "image_url": project.image_url,
        "goal_amount": str(project.goal_amount), # Convert Decimal to string
        "current_amount": str(project.current_amount),
        "status": project.status.value,
        "start_date": project.start_date.isoformat() if project.start_date else None,
        "end_date": project.end_date.isoformat() if project.end_date else None,
        "owner_id": project.owner_id,
        "owner_username": project.owner.username, # Include owner username
        "created_at": project.created_at.isoformat(),
        "updated_at": project.updated_at.isoformat(),
        "updates": [serialize_update(up) for up in project.updates] # Include updates
    }

def serialize_update(update):
    return {
        "id": update.id,
        "update_text": update.update_text,
        "created_at": update.created_at.isoformat()
    }

@projects_bp.route("", methods=["GET"])
def get_projects():
    """Get a list of all projects (or filter by status, e.g., only funding)."""
    # Add filtering/pagination later if needed
    status_filter = request.args.get("status", default=ProjectStatus.FUNDING.value, type=str)
    try:
        # Ensure the status value is valid before querying
        valid_status = ProjectStatus(status_filter)
        projects = Project.query.filter(Project.status == valid_status).order_by(Project.created_at.desc()).all()
        return jsonify([serialize_project(p) for p in projects]), 200
    except ValueError:
         # Handle invalid status value gracefully by defaulting to FUNDING
         projects = Project.query.filter(Project.status == ProjectStatus.FUNDING).order_by(Project.created_at.desc()).all()
         return jsonify([serialize_project(p) for p in projects]), 200
    except Exception as e:
        # Log error e
        print(f"Error fetching projects: {e}") # Basic logging
        return jsonify({"message": "Failed to retrieve projects"}), 500

@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project_details(project_id):
    """Get details for a specific project."""
    project = Project.query.get_or_404(project_id)
    return jsonify(serialize_project(project)), 200

@projects_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    """Create a new project (requires authentication)."""
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity["id"]
    user = User.query.get(user_id)

    # Optional: Check if user has project_owner role
    # if user.role != UserRole.PROJECT_OWNER:
    #     return jsonify({"message": "Only project owners can create projects"}), 403

    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    goal_amount_str = data.get("goal_amount")
    category = data.get("category")
    image_url = data.get("image_url")
    end_date_str = data.get("end_date") # Expecting YYYY-MM-DD

    if not title or not description or not goal_amount_str:
        return jsonify({"message": "Missing required fields: title, description, goal_amount"}), 400

    try:
        # Convert goal_amount carefully using Decimal
        goal_amount = Decimal(goal_amount_str)
        if goal_amount <= 0:
             raise ValueError("Goal amount must be positive")
        # Corrected strptime call with closed parenthesis
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date() if end_date_str else None
    except (ValueError, TypeError) as e:
        return jsonify({"message": f"Invalid data format: {e}"}), 400

    new_project = Project(
        title=title,
        description=description,
        goal_amount=goal_amount,
        category=category,
        image_url=image_url,
        end_date=end_date,
        owner_id=user_id,
        status=ProjectStatus.FUNDING # Default to funding, or draft if approval needed
    )

    try:
        db.session.add(new_project)
        db.session.commit()
        return jsonify(serialize_project(new_project)), 201
    except Exception as e:
        db.session.rollback()
        # Log error e
        print(f"Error creating project: {e}") # Basic logging
        return jsonify({"message": "Failed to create project"}), 500

# Add PUT/DELETE endpoints later if needed, with proper authorization checks

