from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Investment, Project, User, InvestmentStatus, ProjectStatus
from .. import db
from decimal import Decimal

investments_bp = Blueprint("investments", __name__)

# Helper function to serialize investment data
def serialize_investment(investment):
    return {
        "id": investment.id,
        "user_id": investment.user_id,
        "project_id": investment.project_id,
        "project_title": investment.project.title, # Include project title
        "amount": str(investment.amount), # Convert Decimal to string
        "status": investment.status.value,
        "invested_at": investment.invested_at.isoformat()
    }

@investments_bp.route("/project/<int:project_id>", methods=["POST"])
@jwt_required()
def make_investment(project_id):
    """Make an investment in a specific project."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    project = Project.query.get_or_404(project_id)

    if project.status != ProjectStatus.FUNDING:
        return jsonify({"message": "Project is not currently accepting investments"}), 400

    # Optional: Check if project owner is trying to invest in their own project
    if project.owner_id == user_id:
         return jsonify({"message": "Project owners cannot invest in their own projects"}), 403

    data = request.get_json()
    amount_str = data.get("amount")

    if not amount_str:
        return jsonify({"message": "Investment amount is required"}), 400

    try:
        amount = Decimal(amount_str)
        if amount <= 0:
            raise ValueError("Investment amount must be positive")
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid investment amount"}), 400

    # Create the investment record (initially pending, or directly confirmed if payment is integrated)
    new_investment = Investment(
        user_id=user_id,
        project_id=project_id,
        amount=amount,
        status=InvestmentStatus.CONFIRMED # Assume confirmed for now, adjust if payment flow needed
    )

    # Update project's current amount
    project.current_amount += amount

    # Optional: Check if goal reached and update project status
    if project.current_amount >= project.goal_amount:
        project.status = ProjectStatus.SUCCESSFUL
        # Potentially trigger notifications here

    try:
        db.session.add(new_investment)
        # The project object was already tracked by the session, so changes are staged
        db.session.commit()
        return jsonify(serialize_investment(new_investment)), 201
    except Exception as e:
        db.session.rollback()
        # Log error e
        return jsonify({"message": "Failed to process investment"}), 500

@investments_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_investments():
    """Get all investments made by the current user."""
    user_id = int(get_jwt_identity())
    try:
        investments = Investment.query.filter_by(user_id=user_id).order_by(Investment.invested_at.desc()).all()
        return jsonify([serialize_investment(inv) for inv in investments]), 200
    except Exception as e:
        # Log error e
        return jsonify({"message": "Failed to retrieve investments"}), 500

