from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..models import User, UserRole
from .. import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")
    role_str = data.get("role", "investor") # Default to investor

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"message": "Username or email already exists"}), 409

    try:
        role = UserRole(role_str)
    except ValueError:
        return jsonify({"message": f"Invalid role: {role_str}. Valid roles are: investor, project_owner, admin"}), 400

    new_user = User(username=username, email=email, full_name=full_name, role=role)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        # Log the error e
        return jsonify({"message": "Registration failed due to server error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        # --- MODIFICATION START ---
        # Use user.id (as a string) for the identity
        # Ensure user.id is converted to string if it's an integer,
        # as 'sub' claim is often expected to be a string.
        user_identity = str(user.id)

        # Put other user details into additional_claims
        additional_user_claims = {
            "username": str(user.username),
            "role": str(user.role.value)
            # You can add other JSON-serializable info here if needed
        }

        access_token = create_access_token(
            identity=str(user_identity),
            additional_claims=additional_user_claims
        )
        # --- MODIFICATION END ---
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    # current_user_identity = get_jwt_identity()
    user_id = int(get_jwt_identity())
    # user_id = int(user_id)
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value,
        "created_at": user.created_at.isoformat()
    }), 200

