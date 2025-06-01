import os
import logging # Added for logging
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import NotFound
# from dotenv import load_dotenv # No longer loading .env for deployment workaround

# Configure basic logging
logging.basicConfig(level=logging.INFO)

# Initialize extensions (globally)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=None):
    """Application factory function."""
    # Define the static folder path relative to this file (__init__.py)
    # Now points to the backend/src/static directory
    current_dir = os.path.dirname(__file__)
    # Path is now backend/src/static relative to backend/src/__init__.py
    static_folder_path = os.path.abspath(os.path.join(current_dir, "static"))
    
    # Log the paths for debugging deployment
    logging.info(f"Current directory (__file__): {current_dir}")
    logging.info(f"Calculated static_folder_path: {static_folder_path}")
    logging.info(f"Current working directory (os.getcwd()): {os.getcwd()}")
    logging.info(f"Static folder exists: {os.path.exists(static_folder_path)}")
    if os.path.exists(static_folder_path):
        logging.info(f"Contents of static folder: {os.listdir(static_folder_path)}")

    # Corrected: Set static_url_path to "/" to serve static files from the root
    app = Flask(__name__, static_folder=static_folder_path, static_url_path="/")

    # Configuration - HARDCODED FOR DEPLOYMENT WORKAROUND (NOT RECOMMENDED FOR PRODUCTION)
    app.config["SECRET_KEY"] = "f9b8a3e1c5d7f0a9b2c4e6d8a1b3c5d7e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5" # Example hardcoded key
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://pasha_user:StrongPassword123!@localhost/pasha_community_db" # Hardcoded DB URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1" # Example hardcoded key
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False # Disable token expiration (Security Risk)

    # Check if SQLALCHEMY_DATABASE_URI is set (should always be true now)
    if not app.config["SQLALCHEMY_DATABASE_URI"]:
        logging.error("SQLALCHEMY_DATABASE_URI is somehow not set even when hardcoded.")
        raise RuntimeError("SQLALCHEMY_DATABASE_URI is somehow not set even when hardcoded.")

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Enable CORS for API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Adjust origins for production

    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.projects import projects_bp
    from .routes.investments import investments_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(investments_bp, url_prefix="/api/investments")

    # Serve React App (Catch-all route for non-API, non-static file requests)
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react_app(path):
        # Let blueprints handle API routes
        if path.startswith("api/"):
            raise NotFound()

        # Check if the path corresponds to a static file in the dist directory
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            # Otherwise, serve the index.html for SPA routing
            index_path = os.path.join(app.static_folder, "index.html")
            if not os.path.exists(index_path):
                logging.error(f"index.html not found at expected path: {index_path}")
                raise NotFound() # Raise 404 if index.html is missing
            return send_from_directory(app.static_folder, "index.html")

    # Simple test route (already covered by blueprint)
    # @app.route("/api/health")
    # def health_check():
    #     return {"status": "healthy"}

    # Import models within app context
    with app.app_context():
        from . import models # noqa
        # db.create_all() # Usually handled by migrations

    return app
