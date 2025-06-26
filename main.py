import os
from app import app, db

if __name__ == "__main__":
    # Create tables on startup
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
