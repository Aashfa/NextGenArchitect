from datetime import datetime
import os

from bson import ObjectId

from utils.db import get_db
from models.approval_request import ApprovalRequest, approval_request_collection
from models.plot import plot_collection
from models.society_profile import society_profile_collection
from controllers.user_profile_controller import UserProfileController


class ApprovalRequestController:
    """Controller for handling approval requests"""

    @staticmethod
    def _extract_filename(file_path):
        """Get filename from a stored path in a cross-platform-safe way."""
        if not file_path:
            return ''
        normalized = str(file_path).replace('\\', '/')
        return os.path.basename(normalized)

    @staticmethod
    def _enrich_requests(db, request_records):
        """Attach plot_number, society_name, and floor_plan_file_name for frontend display."""
        if not request_records:
            return request_records

        plots = plot_collection(db)
        societies = society_profile_collection(db)

        plot_ids = set()
        for req in request_records:
            pid = req.get('plot_id') or req.get('plotId')
            if isinstance(pid, ObjectId):
                plot_ids.add(pid)
            elif isinstance(pid, str) and pid:
                try:
                    plot_ids.add(ObjectId(pid))
                except Exception:
                    continue

        plots_map = {}
        if plot_ids:
            for plot in plots.find({'_id': {'$in': list(plot_ids)}}):
                plots_map[str(plot['_id'])] = plot

        society_ids = set()
        for req in request_records:
            sid = req.get('society_id') or req.get('societyId')
            if sid:
                society_ids.add(str(sid))

            pid = str(req.get('plot_id') or req.get('plotId') or '')
            plot_doc = plots_map.get(pid)
            if plot_doc and plot_doc.get('societyId'):
                society_ids.add(str(plot_doc.get('societyId')))

        society_object_ids = []
        for sid in society_ids:
            try:
                society_object_ids.append(ObjectId(sid))
            except Exception:
                continue

        societies_map = {}
        if society_object_ids:
            for society in societies.find({'_id': {'$in': society_object_ids}}):
                societies_map[str(society['_id'])] = society.get('name', '')

        for req in request_records:
            req['_id'] = str(req['_id'])
            req['user_id'] = str(req['user_id'])
            if req.get('reviewed_by'):
                req['reviewed_by'] = str(req['reviewed_by'])

            plot_id = str(req.get('plot_id') or req.get('plotId') or '')
            req['plot_id'] = plot_id
            plot_doc = plots_map.get(plot_id)
            if plot_doc:
                req['plot_number'] = plot_doc.get('plot_number', '')
                if not (req.get('society_id') or req.get('societyId')) and plot_doc.get('societyId'):
                    req['society_id'] = str(plot_doc.get('societyId'))

            society_id = str(req.get('society_id') or req.get('societyId') or '')
            req['society_id'] = society_id
            req['society_name'] = societies_map.get(society_id, req.get('society_name', ''))

            if not req.get('floor_plan_file_name'):
                if req.get('floor_plan_file_url'):
                    req['floor_plan_file_name'] = ApprovalRequestController._extract_filename(
                        req.get('floor_plan_file_url')
                    )
                elif req.get('floor_plan_data'):
                    req['floor_plan_file_name'] = 'uploaded_floorplan.json'

        return request_records

    @staticmethod
    def create_approval_request(user_id, request_data, files=None):
        """Create a new approval request"""
        try:
            db = get_db()
            requests = approval_request_collection(db)

            # Handle floor plan file upload - store JSON content directly in database
            if files and 'floor_plan_file' in files and files['floor_plan_file']:
                floor_plan_file = files['floor_plan_file']
                request_data['floor_plan_file_name'] = floor_plan_file.filename or 'uploaded_floorplan.json'
                try:
                    # Read the JSON content from the uploaded file
                    import json
                    floor_plan_content = floor_plan_file.read().decode('utf-8')
                    floor_plan_json = json.loads(floor_plan_content)
                    # Store the JSON content directly in the database
                    request_data['floor_plan_data'] = floor_plan_json
                except Exception as json_err:
                    print(f"Error parsing floor plan JSON: {json_err}")
                    # Fallback: save as file if JSON parsing fails
                    floor_plan_path = UserProfileController._save_file(
                        floor_plan_file, f"user_{user_id}/floor_plans"
                    )
                    if floor_plan_path:
                        request_data['floor_plan_file_url'] = floor_plan_path

            # Create approval request object
            approval_request = ApprovalRequest(user_id, **request_data)

            # Insert into database
            result = requests.insert_one(approval_request.to_dict())

            # Get plot number for activity logging
            plot_number = "N/A"
            if request_data.get('plot_id'):
                try:
                    plot = db['plots'].find_one({'_id': ObjectId(request_data['plot_id'])})
                    if plot:
                        plot_number = plot.get('plot_number', 'N/A')
                except:
                    pass

            # Log activity
            UserProfileController._log_activity(
                user_id,
                'approval_request_submitted',
                f"Approval request submitted for plot {plot_number}",
                {'request_id': str(result.inserted_id), 'plot_id': request_data.get('plot_id')},
            )

            return str(result.inserted_id), "Approval request submitted successfully"

        except Exception as e:
            return None, f"Error creating approval request: {str(e)}"

    @staticmethod
    def get_user_approval_requests(user_id):
        """Get all approval requests for a user"""
        try:
            db = get_db()
            requests = approval_request_collection(db)

            user_requests = list(
                requests.find({'user_id': ObjectId(user_id)}).sort('created_at', -1)
            )

            return ApprovalRequestController._enrich_requests(db, user_requests)

        except Exception as e:
            print(f"Error getting approval requests: {str(e)}")
            return []

    @staticmethod
    def get_approval_request(request_id):
        """Get a specific approval request"""
        try:
            db = get_db()
            requests = approval_request_collection(db)

            request = requests.find_one({'_id': ObjectId(request_id)})
            if request:
                enriched = ApprovalRequestController._enrich_requests(db, [request])
                return enriched[0] if enriched else None

            return None

        except Exception as e:
            print(f"Error getting approval request: {str(e)}")
            return None

    @staticmethod
    def update_approval_request(request_id, update_data):
        """Update an approval request"""
        try:
            db = get_db()
            requests = approval_request_collection(db)

            update_data['updated_at'] = datetime.utcnow()

            result = requests.update_one(
                {'_id': ObjectId(request_id)},
                {'$set': update_data},
            )

            if result.modified_count > 0:
                # Get the updated request to log activity
                updated_request = requests.find_one({'_id': ObjectId(request_id)})
                if updated_request:
                    user_id = str(updated_request['user_id'])
                    status = update_data.get('status')
                    admin_comments = update_data.get('admin_comments', '')
                    
                    # Log activity with admin comments
                    activity_desc = f"Approval request {status.lower()}"
                    if admin_comments:
                        activity_desc += f" - {admin_comments}"
                        
                    UserProfileController._log_activity(
                        user_id,
                        f'approval_request_{status.lower()}',
                        activity_desc,
                        {
                            'request_id': request_id,
                            'status': status,
                            'admin_comments': admin_comments,
                            'reviewed_at': update_data.get('reviewed_at')
                        }
                    )
                
                return True, "Approval request updated successfully"
            else:
                return False, "Approval request not found"

        except Exception as e:
            return False, f"Error updating approval request: {str(e)}"

    @staticmethod
    def delete_approval_request(request_id, user_id):
        """Delete an approval request"""
        try:
            db = get_db()
            requests = approval_request_collection(db)

            result = requests.delete_one(
                {
                    '_id': ObjectId(request_id),
                    'user_id': ObjectId(user_id),
                }
            )

            if result.deleted_count > 0:
                # Log activity
                UserProfileController._log_activity(
                    user_id,
                    'approval_request_deleted',
                    f'Approval request {request_id} deleted',
                )
                return True, "Approval request deleted successfully"
            else:
                return False, "Approval request not found"

        except Exception as e:
            return False, f"Error deleting approval request: {str(e)}"
