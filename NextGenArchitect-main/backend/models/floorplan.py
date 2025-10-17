"""
Floorplan model for genetic algorithm based floorplan generation
"""

from utils.db import get_db
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any, Optional

def floorplan_collection(db):
    """Get floorplan collection from database"""
    return db.floorplans

def floorplan_connections_collection(db):
    """Get floorplan connections collection from database"""
    return db.floorplan_connections

def floorplan_rooms_collection(db):
    """Get floorplan rooms collection from database"""
    return db.floorplan_rooms

class FloorplanModel:
    def __init__(self):
        self.db = get_db()
        self.floorplans = floorplan_collection(self.db)
        self.connections = floorplan_connections_collection(self.db)
        self.rooms = floorplan_rooms_collection(self.db)

    def create_floorplan(self, user_email: str, name: str, width: float, height: float, 
                        maps_data: List[Dict], rooms_data: List[List], 
                        generation_params: Dict = None) -> str:
        """Create a new floorplan with generated data"""
        try:
            floorplan_data = {
                "user_email": user_email,
                "name": name,
                "width": width,
                "height": height,
                "maps_data": maps_data,
                "rooms_data": rooms_data,
                "generation_params": generation_params or {},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "status": "active"
            }
            
            result = self.floorplans.insert_one(floorplan_data)
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"Error creating floorplan: {e}")
            return None

    def get_floorplan(self, floorplan_id: str) -> Optional[Dict]:
        """Get floorplan by ID"""
        try:
            return self.floorplans.find_one({"_id": ObjectId(floorplan_id)})
        except Exception as e:
            print(f"Error getting floorplan: {e}")
            return None

    def get_user_floorplans(self, user_email: str) -> List[Dict]:
        """Get all floorplans for a user"""
        try:
            floorplans = list(self.floorplans.find(
                {"user_email": user_email, "status": "active"}
            ).sort("created_at", -1))
            
            # Convert ObjectId to string for JSON serialization
            for floorplan in floorplans:
                floorplan['_id'] = str(floorplan['_id'])
            
            return floorplans
            
        except Exception as e:
            print(f"Error getting user floorplans: {e}")
            return []

    def update_floorplan(self, floorplan_id: str, updates: Dict) -> bool:
        """Update floorplan data"""
        try:
            updates["updated_at"] = datetime.utcnow()
            
            result = self.floorplans.update_one(
                {"_id": ObjectId(floorplan_id)},
                {"$set": updates}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error updating floorplan: {e}")
            return False

    def delete_floorplan(self, floorplan_id: str, user_email: str) -> bool:
        """Soft delete floorplan"""
        try:
            result = self.floorplans.update_one(
                {"_id": ObjectId(floorplan_id), "user_email": user_email},
                {"$set": {"status": "deleted", "updated_at": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"Error deleting floorplan: {e}")
            return False

    def save_floorplan_constraints(self, user_email: str, constraints: Dict) -> str:
        """Save floorplan generation constraints"""
        try:
            constraint_data = {
                "user_email": user_email,
                "constraints": constraints,
                "created_at": datetime.utcnow(),
                "type": "constraints"
            }
            
            result = self.connections.insert_one(constraint_data)
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"Error saving constraints: {e}")
            return None

    def save_room_connections(self, user_email: str, connections: List[Dict]) -> str:
        """Save room connections for floorplan generation"""
        try:
            connection_data = {
                "user_email": user_email,
                "connections": connections,
                "created_at": datetime.utcnow(),
                "type": "room_connections"
            }
            
            result = self.connections.insert_one(connection_data)
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"Error saving connections: {e}")
            return None

    def get_floorplan_variations(self, floorplan_id: str, variation_index: int = 0) -> Optional[Dict]:
        """Get specific variation of a floorplan"""
        try:
            floorplan = self.get_floorplan(floorplan_id)
            if not floorplan:
                return None
            
            maps_data = floorplan.get('maps_data', [])
            rooms_data = floorplan.get('rooms_data', [])
            
            if variation_index < len(maps_data):
                return {
                    "floorplan_id": str(floorplan['_id']),
                    "name": floorplan['name'],
                    "width": floorplan['width'],
                    "height": floorplan['height'],
                    "variation_index": variation_index,
                    "map_data": maps_data[variation_index],
                    "room_data": rooms_data[variation_index] if variation_index < len(rooms_data) else [],
                    "created_at": floorplan['created_at']
                }
            
            return None
            
        except Exception as e:
            print(f"Error getting floorplan variation: {e}")
            return None

    def search_floorplans(self, user_email: str, search_term: str) -> List[Dict]:
        """Search floorplans by name"""
        try:
            query = {
                "user_email": user_email,
                "status": "active",
                "name": {"$regex": search_term, "$options": "i"}
            }
            
            floorplans = list(self.floorplans.find(query).sort("created_at", -1))
            
            # Convert ObjectId to string for JSON serialization
            for floorplan in floorplans:
                floorplan['_id'] = str(floorplan['_id'])
            
            return floorplans
            
        except Exception as e:
            print(f"Error searching floorplans: {e}")
            return []

    def get_floorplan_stats(self, user_email: str) -> Dict:
        """Get floorplan statistics for user"""
        try:
            total_floorplans = self.floorplans.count_documents({
                "user_email": user_email,
                "status": "active"
            })
            
            recent_floorplans = self.floorplans.count_documents({
                "user_email": user_email,
                "status": "active",
                "created_at": {"$gte": datetime.utcnow().replace(day=1)}  # This month
            })
            
            return {
                "total_floorplans": total_floorplans,
                "recent_floorplans": recent_floorplans
            }
            
        except Exception as e:
            print(f"Error getting floorplan stats: {e}")
            return {"total_floorplans": 0, "recent_floorplans": 0}

# Room type mappings for the genetic algorithm
ROOM_TYPES = {
    "living": "livingroom",
    "livingroom": "livingroom",
    "kitchen": "kitchen", 
    "bedroom": "bedroom",
    "bed": "bedroom",
    "bathroom": "bathroom", 
    "bath": "bathroom",
    "drawing": "drawingroom",
    "drawingroom": "drawingroom",
    "car": "carporch",
    "carporch": "carporch",
    "garage": "carporch",
    "garden": "garden",
    "gar": "garden"
}

def normalize_room_type(room_type: str) -> str:
    """Normalize room type to standard format"""
    return ROOM_TYPES.get(room_type.lower(), room_type.lower())

def validate_generation_params(params: Dict) -> Dict:
    """Validate and normalize generation parameters"""
    validated = {}
    
    # Required dimensions
    validated['width'] = max(100, int(params.get('width', 500)))
    validated['height'] = max(100, int(params.get('height', 500)))
    
    # Room counts (default to 0 if not specified)
    room_counts = {
        'livingroom_count': int(params.get('livingroom_count', 1)),
        'kitchen_count': int(params.get('kitchen_count', 1)),
        'bedroom_count': int(params.get('bedroom_count', 2)),
        'bathroom_count': int(params.get('bathroom_count', 1)),
        'drawingroom_count': int(params.get('drawingroom_count', 0)),
        'carporch_count': int(params.get('carporch_count', 0)),
        'garden_count': int(params.get('garden_count', 0))
    }
    validated.update(room_counts)
    
    # Room proportions (aspect ratios, default to moderate values)
    proportions = {
        'livingroom_proportion': float(params.get('livingroom_proportion', 0.7)),
        'kitchen_proportion': float(params.get('kitchen_proportion', 0.8)),
        'bedroom_proportion': float(params.get('bedroom_proportion', 0.8)),
        'bathroom_proportion': float(params.get('bathroom_proportion', 0.9)),
        'drawingroom_proportion': float(params.get('drawingroom_proportion', 0.7)),
        'carporch_proportion': float(params.get('carporch_proportion', 0.6)),
        'garden_proportion': float(params.get('garden_proportion', 0.5))
    }
    validated.update(proportions)
    
    # Room area percentages (default to reasonable distributions)
    total_percentage = 100.0
    default_percentages = {
        'livingroom_percentage': 25.0,
        'kitchen_percentage': 15.0, 
        'bedroom_percentage': 30.0,
        'bathroom_percentage': 10.0,
        'drawingroom_percentage': 10.0,
        'carporch_percentage': 5.0,
        'garden_percentage': 5.0
    }
    
    percentages = {}
    for room_type, default_val in default_percentages.items():
        percentages[room_type] = float(params.get(room_type, default_val))
    
    # Normalize percentages to sum to 100
    total = sum(percentages.values())
    if total > 0:
        for room_type in percentages:
            percentages[room_type] = (percentages[room_type] / total) * 100.0
    
    validated.update(percentages)
    
    return validated

# Example floorplan schema (for reference)
floorplan_schema = {
    'user_email': str,
    'name': str,
    'width': float,
    'height': float,
    'maps_data': list,  # Generated floorplan variations
    'rooms_data': list,  # Room data for each variation
    'project_name': str,
    'created_at': None,
}
