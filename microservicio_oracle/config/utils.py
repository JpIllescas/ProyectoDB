from functools import wraps
from flask import jsonify
from config.config import SessionLocal

def with_session(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        session = SessionLocal()
        try:
            return func(session, *args, **kwargs)
        except Exception as e:
            session.rollback()
            return jsonify({"error": str(e), "status": 500})
        finally:
            session.close()
    return wrapper