"""
Lightweight verification script: compare document counts between local MongoDB and Atlas
Does NOT modify data.
"""
import os
from pymongo import MongoClient

LOCAL_MONGO_URI = os.getenv("LOCAL_MONGO_URI", "mongodb://localhost:27017/")
ATLAS_MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://Aashfa:12345Aa%23@cluster0.vemetqx.mongodb.net/?retryWrites=true&w=majority")
DB_NAME = "NextGenArchitect"


def main():
    print("\n== Verifying Local -> Atlas counts ==\n")
    local_client = MongoClient(LOCAL_MONGO_URI, serverSelectionTimeoutMS=5000)
    atlas_client = MongoClient(ATLAS_MONGO_URI, serverSelectionTimeoutMS=10000)

    try:
        local_client.admin.command('ping')
    except Exception as e:
        print(f"Failed to connect to local MongoDB: {e}")
        return 1

    try:
        atlas_client.admin.command('ping')
    except Exception as e:
        print(f"Failed to connect to MongoDB Atlas: {e}")
        return 1

    local_db = local_client[DB_NAME]
    atlas_db = atlas_client[DB_NAME]

    local_cols = set(local_db.list_collection_names())
    atlas_cols = set(atlas_db.list_collection_names())

    all_cols = sorted(local_cols.union(atlas_cols))

    total_local = 0
    total_atlas = 0

    for col in all_cols:
        local_count = local_db[col].count_documents({}) if col in local_cols else 0
        atlas_count = atlas_db[col].count_documents({}) if col in atlas_cols else 0
        total_local += local_count
        total_atlas += atlas_count
        status = "OK" if local_count == atlas_count else "MISMATCH"
        print(f"{status:8} {col:30} Local={local_count:6}  Atlas={atlas_count:6}")

    print("\nSummary:")
    print(f"  Total Local documents: {total_local}")
    print(f"  Total Atlas documents: {total_atlas}")

    local_client.close()
    atlas_client.close()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
