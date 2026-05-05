import os
import logging

from pymongo import MongoClient
from dotenv import load_dotenv

# Ensure environment variables from backend/.env are available even if
# this module is imported before app.py calls load_dotenv().
load_dotenv()

logger = logging.getLogger('backend.utils.db')

def _get_mongo_uri():
    return os.getenv(
        "MONGO_URI",
        "mongodb+srv://AashfaNoor:NextGenIT22-A@cluster0.otiywgx.mongodb.net/?retryWrites=true&w=majority",
    )


def _get_local_mongo_uri():
    return os.getenv("LOCAL_MONGO_URI", "mongodb://localhost:27017/")

# Global client and database instances (persistent connection pooling)
_client = None
_db = None

def setup_admin_indexes(db):
    """Setup MongoDB indexes to optimize Admin Dashboard queries"""
    try:
        db.users.create_index([("email", 1)])
        db.users.create_index([("role", 1)])
        db.users.create_index([("created_at", -1)])
        # Other common admin fields
        db.society_profiles.create_index([("status", 1)])
        db.approval_requests.create_index([("status", 1)])
        print("[DB] Admin query indexes verified.")
    except Exception as e:
        print(f"[DB] Failed to create indexes: {e}")

def get_db():
    """
    Get database connection with persistent connection pooling.
    Creates connection only once, then reuses for all requests.
    Prioritizes MongoDB Atlas, falls back to local MongoDB for development.
    """
    global _client, _db
    
    # Return existing connection if available
    if _db is not None:
        return _db
    
    mongo_uri = _get_mongo_uri()
    local_mongo_uri = _get_local_mongo_uri()

    # Try MongoDB Atlas first so the app uses the cloud database by default.
    try:
        logger.info("[DB] Attempting to connect to MongoDB Atlas...")
        _client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            # Connection pooling options
            maxPoolSize=50,          # Maximum connections in pool
            minPoolSize=10,          # Minimum connections to maintain
            retryWrites=True,
            retryReads=True,
        )
        # Test the connection
        _client.admin.command('ping')
        logger.info("[DB] ✅ Connected to MongoDB Atlas (with connection pooling)")
        _db = _client['NextGenArchitect']
        setup_admin_indexes(_db)
        return _db
    except Exception as atlas_error:
        logger.warning("[DB] ❌ Atlas connection failed: %s", atlas_error)

        # Some restrictive networks/proxies break strict TLS validation with Atlas.
        # Try compatibility connections before falling back to local MongoDB.
        try:
            logger.info("[DB] Retrying Atlas with TLS compatibility options (attempt 1)...")
            _client = MongoClient(
                mongo_uri,
                serverSelectionTimeoutMS=30000,
                connectTimeoutMS=30000,
                socketTimeoutMS=30000,
                maxPoolSize=50,
                minPoolSize=10,
                retryWrites=True,
                retryReads=True,
                tls=True,
                tlsAllowInvalidCertificates=True,
                tlsAllowInvalidHostnames=True,
            )
            _client.admin.command('ping')
            logger.info("[DB] ✅ Connected to MongoDB Atlas (TLS compatibility mode: allow invalid certs/hostnames)")
            _db = _client['NextGenArchitect']
            setup_admin_indexes(_db)
            return _db
        except Exception as atlas_compat_error:
            logger.warning("[DB] ❌ Atlas compatibility attempt failed: %s", atlas_compat_error)

            try:
                logger.info("[DB] Retrying Atlas with TLS compatibility options (attempt 2)...")
                _client = MongoClient(
                    mongo_uri,
                    serverSelectionTimeoutMS=30000,
                    connectTimeoutMS=30000,
                    socketTimeoutMS=30000,
                    maxPoolSize=50,
                    minPoolSize=10,
                    retryWrites=True,
                    retryReads=True,
                    tls=True,
                    tlsDisableOCSPEndpointCheck=True,
                )
                _client.admin.command('ping')
                logger.info("[DB] ✅ Connected to MongoDB Atlas (TLS compatibility mode: OCSP disabled)")
                _db = _client['NextGenArchitect']
                setup_admin_indexes(_db)
                return _db
            except Exception as atlas_compat_error_2:
                logger.warning("[DB] ❌ Atlas compatibility attempt failed: %s", atlas_compat_error_2)
        
        # Fallback to local MongoDB for offline development
        try:
            logger.info("[DB] Attempting to connect to local MongoDB (fallback)...")
            _client = MongoClient(
                local_mongo_uri,
                serverSelectionTimeoutMS=5000,
                # Connection pooling options
                maxPoolSize=50,
                minPoolSize=10,
            )
            # Test the connection
            _client.admin.command('ping')
            logger.info("[DB] ✅ Connected to local MongoDB (with connection pooling)")
            _db = _client['NextGenArchitect']
            setup_admin_indexes(_db)
            return _db
        except Exception as local_error:
            logger.warning("[DB] ❌ Local MongoDB connection failed: %s", local_error)
            logger.error("[DB] ❌ Both Atlas and local connections failed!")
            raise Exception("Database connection failed. Please ensure MongoDB Atlas is accessible or MongoDB is running locally.")

def test_connection():
    """
    Test database connection and return status using persistent connection
    """
    try:
        db = get_db()
        db.admin.command('ping')
        logger.info("[DB] MongoDB connection successful")
        return {"status": "Connected", "result": "OK"}
    except Exception as error:
        logger.exception("[DB] Connection test failed: %s", error)
        return {"status": "Failed", "error": str(error)}


def close_db():
    """
    Close MongoDB connection gracefully (call on app shutdown)
    """
    global _client, _db
    
    if _client is not None:
        try:
            _client.close()
            logger.info("[DB] MongoDB connection closed gracefully")
            _client = None
            _db = None
        except Exception as e:
            logger.exception("[DB] Error closing connection: %s", e)

    

