from bson import ObjectId
from flask import jsonify
from datetime import datetime

from utils.db import get_db
from models.compliance import Compliance, compliance_collection


class ComplianceController:
    """Controller for handling compliance rules (Sub-admin only)"""
    
    @staticmethod
    def create_compliance(user_id, society_id, compliance_data):
        """Create compliance rules for a specific plot size"""
        try:
            db = get_db()
            compliances = compliance_collection(db)
            
            marla_size = compliance_data.get('marla_size')
            plot_id = compliance_data.get('plot_id')

            # Normalize optional plot link fields
            if not plot_id:
                compliance_data.pop('plot_id', None)
                compliance_data.pop('plot_number', None)
            
            # Check if compliance already exists.
            # If plot is selected, enforce one compliance per society+plot.
            # Otherwise keep legacy one compliance per society+marla for general rules.
            if plot_id:
                existing = compliances.find_one({
                    'society_id': ObjectId(society_id),
                    'plot_id': ObjectId(plot_id),
                    'is_active': True
                })
            else:
                existing = compliances.find_one({
                    'society_id': ObjectId(society_id),
                    'marla_size': marla_size,
                    'is_active': True,
                    '$or': [
                        {'plot_id': {'$exists': False}},
                        {'plot_id': None}
                    ]
                })
            
            if existing:
                if plot_id:
                    return None, "Compliance rules for this plot already exist in your society. Please edit the existing rules or choose another plot."
                return None, f"Compliance rules for '{marla_size}' already exist in your society. Please edit the existing rules or choose a different plot size."
            
            # Add created_by field
            compliance_data['created_by'] = ObjectId(user_id)
            
            # Create compliance object
            compliance = Compliance(society_id, **compliance_data)
            
            # Validate
            is_valid, message = compliance.validate()
            if not is_valid:
                return None, message
            
            # Insert into database
            result = compliances.insert_one(compliance.to_dict())
            
            return str(result.inserted_id), "Compliance rules created successfully"
        
        except Exception as e:
            return None, f"Error creating compliance: {str(e)}"
    
    @staticmethod
    def get_society_compliances(society_id):
        """Get all compliance rules for a society"""
        try:
            db = get_db()
            compliances = compliance_collection(db)
            
            society_compliances = list(compliances.find({
                'society_id': ObjectId(society_id),
                'is_active': True
            }).sort('marla_size', 1))
            
            # Convert ObjectIds to strings
            for comp in society_compliances:
                comp['_id'] = str(comp['_id'])
                comp['society_id'] = str(comp['society_id'])
                if comp.get('plot_id'):
                    comp['plot_id'] = str(comp['plot_id'])
                if comp.get('created_by'):
                    comp['created_by'] = str(comp['created_by'])
            
            return society_compliances
        
        except Exception as e:
            print(f"Error getting compliances: {str(e)}")
            return []
    
    @staticmethod
    def get_compliance_by_plot_size(society_id, marla_size):
        """Get compliance rules for a specific plot size in a society"""
        try:
            db = get_db()
            compliances = compliance_collection(db)
            
            compliance = compliances.find_one({
                'society_id': ObjectId(society_id),
                'marla_size': marla_size,
                'is_active': True
            })
            
            if compliance:
                compliance['_id'] = str(compliance['_id'])
                compliance['society_id'] = str(compliance['society_id'])
                if compliance.get('plot_id'):
                    compliance['plot_id'] = str(compliance['plot_id'])
                if compliance.get('created_by'):
                    compliance['created_by'] = str(compliance['created_by'])
                return compliance
            
            return None
        
        except Exception as e:
            print(f"Error getting compliance: {str(e)}")
            return None
    
    @staticmethod
    def update_compliance(compliance_id, compliance_data):
        """Update existing compliance rules"""
        try:
            db = get_db()
            compliances = compliance_collection(db)
            
            # Update timestamp
            compliance_data['updated_at'] = datetime.utcnow()
            
            # Remove fields that shouldn't be updated
            compliance_data.pop('_id', None)
            compliance_data.pop('society_id', None)
            compliance_data.pop('created_by', None)
            compliance_data.pop('created_at', None)

            # Normalize optional plot link fields
            if 'plot_id' in compliance_data and compliance_data.get('plot_id'):
                compliance_data['plot_id'] = ObjectId(compliance_data['plot_id'])
            elif 'plot_id' in compliance_data:
                compliance_data['plot_id'] = None

            if 'plot_number' in compliance_data and not compliance_data.get('plot_id'):
                compliance_data['plot_number'] = ''
            
            result = compliances.update_one(
                {'_id': ObjectId(compliance_id)},
                {'$set': compliance_data}
            )
            
            if result.modified_count > 0:
                return True, "Compliance rules updated successfully"
            else:
                return False, "No changes made"
        
        except Exception as e:
            return False, f"Error updating compliance: {str(e)}"
    
    @staticmethod
    def delete_compliance(compliance_id):
        """Soft delete compliance (set is_active to False)"""
        try:
            db = get_db()
            compliances = compliance_collection(db)
            
            result = compliances.update_one(
                {'_id': ObjectId(compliance_id)},
                {'$set': {'is_active': False, 'updated_at': datetime.utcnow()}}
            )
            
            if result.modified_count > 0:
                return True, "Compliance rules deactivated successfully"
            else:
                return False, "Compliance not found"
        
        except Exception as e:
            return False, f"Error deleting compliance: {str(e)}"
    
    @staticmethod
    def get_compliance_for_floorplan(plot_id):
        """Get applicable compliance rules when generating a floor plan"""
        try:
            db = get_db()
            plots = db['plots']
            compliances = compliance_collection(db)
            
            # Get plot details
            plot = plots.find_one({'_id': ObjectId(plot_id)})
            if not plot:
                return None, "Plot not found"
            
            # Get society_id and marla_size from plot
            society_id = plot.get('societyId')
            marla_size = plot.get('marla_size')
            
            if not society_id:
                return None, "Plot missing society information"
            
            # Build tolerant candidates for society_id/plot_id because older data can store ids
            # as either ObjectId or string.
            society_candidates = []
            if isinstance(society_id, ObjectId):
                society_candidates.extend([society_id, str(society_id)])
            elif isinstance(society_id, str):
                society_candidates.append(society_id)
                if ObjectId.is_valid(society_id):
                    society_candidates.append(ObjectId(society_id))
            else:
                society_candidates.append(society_id)

            plot_candidates = []
            if ObjectId.is_valid(plot_id):
                plot_candidates.append(ObjectId(plot_id))
            plot_candidates.append(plot_id)

            # 1) Prefer strict plot-level compliance when present.
            compliance = compliances.find_one({
                'society_id': {'$in': society_candidates},
                'plot_id': {'$in': plot_candidates},
                'is_active': True
            })

            # 2) Fallback to marla-level compliance for this society if no plot-level rule exists.
            if not compliance and marla_size:
                compliance = compliances.find_one({
                    'society_id': {'$in': society_candidates},
                    'marla_size': marla_size,
                    'is_active': True,
                    '$or': [
                        {'plot_id': {'$exists': False}},
                        {'plot_id': None},
                        {'plot_id': ''}
                    ]
                })
            
            if compliance:
                compliance['_id'] = str(compliance['_id'])
                compliance['society_id'] = str(compliance['society_id'])
                if compliance.get('plot_id'):
                    compliance['plot_id'] = str(compliance['plot_id'])
                if compliance.get('created_by'):
                    compliance['created_by'] = str(compliance['created_by'])
                return compliance, "Compliance rules found"
            
            return None, "No compliance rules set for this plot or its marla size"
        
        except Exception as e:
            print(f"Error getting compliance for floor plan: {str(e)}")
            return None, f"Error: {str(e)}"
