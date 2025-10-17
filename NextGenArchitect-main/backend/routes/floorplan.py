from flask import Blueprint, request, jsonify
from ai.genetic_algorithm import GA_driver
from models.floorplan import FloorplanModel, validate_generation_params

floorplan_bp = Blueprint('floorplan', __name__)

@floorplan_bp.route('/generate-floorplan', methods=['POST', 'OPTIONS'])
def generate_floorplan():
    """
    Generate 2D floorplans using genetic algorithm based on user constraints, connections, and proportions.
    Request JSON should include:
      - width, height
      - room counts (livingroom_count, kitchen_count, etc.)
      - room proportions (livingroom_proportion, ...)
      - room percentages (livingroom_percentage, ...)
      - connectors: list of room connection dicts (from_tag, to_tag, etc.)
      - name: floorplan name
    """
    # Handle OPTIONS preflight request
    if request.method == 'OPTIONS':
        return '', 200
    
    # No authentication required - use 'guest' for all users
    user_email = 'guest'
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400

    try:
        # Extract parameters from frontend (support both naming conventions)
        connectors = data.get('connectors', [])
        width = float(data.get('width', data.get('w', 500)))
        height = float(data.get('height', data.get('h', 500)))
        
        # Room proportions (support both snake_case and short names)
        kitchen_p = float(data.get('kitchen_proportion', data.get('kitchen_p', 0.8)))
        living_p = float(data.get('livingroom_proportion', data.get('living_p', 0.7)))
        drawing_p = float(data.get('drawingroom_proportion', data.get('drawing_p', 0.7)))
        car_p = float(data.get('carporch_proportion', data.get('car_p', 0.6)))
        bath_p = float(data.get('bathroom_proportion', data.get('bath_p', 0.9)))
        bed_p = float(data.get('bedroom_proportion', data.get('bed_p', 0.8)))
        gar_p = float(data.get('garden_proportion', data.get('gar_p', 0.5)))
        
        # Room percentages (support both snake_case and short names)
        kitchen_per = float(data.get('kitchen_percentage', data.get('kitchen_per', 15.0)))
        living_per = float(data.get('livingroom_percentage', data.get('living_per', 25.0)))
        drawing_per = float(data.get('drawingroom_percentage', data.get('drawing_per', 10.0)))
        car_per = float(data.get('carporch_percentage', data.get('car_per', 5.0)))
        bath_per = float(data.get('bathroom_percentage', data.get('bath_per', 10.0)))
        bed_per = float(data.get('bedroom_percentage', data.get('bed_per', 30.0)))
        gar_per = float(data.get('garden_percentage', data.get('gar_per', 5.0)))
        
        name = data.get('name', 'Untitled Floorplan')
        
        print(f"Generating floorplan: {width}x{height}, {len(connectors)} connections")
        
        # Call the genetic algorithm driver
        result = GA_driver(
            connectors, width, height,
            kitchen_p, living_p, drawing_p, car_p, bath_p, bed_p, gar_p,
            kitchen_per, living_per, drawing_per, car_per, bath_per, bed_per, gar_per
        )
    except Exception as e:
        print(f"Error in GA_driver: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to generate floorplan: {str(e)}'}), 500

    # Save the generated floorplan
    model = FloorplanModel()
    generation_params = {
        'width': width,
        'height': height,
        'kitchen_p': kitchen_p,
        'living_p': living_p,
        'drawing_p': drawing_p,
        'car_p': car_p,
        'bath_p': bath_p,
        'bed_p': bed_p,
        'gar_p': gar_p,
        'kitchen_per': kitchen_per,
        'living_per': living_per,
        'drawing_per': drawing_per,
        'car_per': car_per,
        'bath_per': bath_per,
        'bed_per': bed_per,
        'gar_per': gar_per
    }
    floorplan_id = model.create_floorplan(
        user_email=user_email,
        name=name,
        width=width,
        height=height,
        maps_data=result['maps'],
        rooms_data=result['room'],
        generation_params=generation_params
    )

    return jsonify({
        'floorplan_id': floorplan_id,
        'maps': result['maps'],
        'room': result['room'],
        'message': 'Floorplans generated successfully.'
    })
