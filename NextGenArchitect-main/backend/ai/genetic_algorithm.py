# -*- coding: utf-8 -*-
"""
Genetic Algorithm for Floorplan Generation
Converted from Django to Flask implementation
Original: Smarchitect project
"""

import random
import math
import numpy as np
import numpy.random as npr
from typing import List, Dict, Any, Tuple, Optional

# Constants for genetic algorithm
DOOR_LENGTH = 50
ADJACENCY_REWARD = 50
PERCENTAGE_REWARD = 30
PROPORTION_REWARD = 20

class TreeNode:
    """Binary tree node for room splitting"""
    def __init__(self, val=None):
        self.val = val
        self.left = None
        self.right = None
    
    def maketree(self, rooms, split_genes):
        """Build tree with rooms and split genes"""
        if len(rooms) == 1:
            self.val = rooms[0]
            return
        
        # Use first split gene for this level
        split_axis, split_ratio = split_genes[0]
        self.val = [split_axis, split_ratio]
        
        # Split rooms for left and right subtrees
        mid = len(rooms) // 2
        left_rooms = rooms[:mid]
        right_rooms = rooms[mid:]
        
        # Create child nodes
        self.left = TreeNode()
        self.right = TreeNode()
        
        # Recursively build subtrees
        if len(split_genes) > 1:
            left_splits = split_genes[1:1+len(left_rooms)-1] if len(left_rooms) > 1 else []
            right_splits = split_genes[1+len(left_rooms)-1:] if len(right_rooms) > 1 else []
            
            if left_rooms and len(left_rooms) > 0:
                self.left.maketree(left_rooms, left_splits)
            if right_rooms and len(right_rooms) > 0:
                self.right.maketree(right_rooms, right_splits)

def clone_binary_tree(root):
    """Clone a binary tree"""
    if not root:
        return None
    
    new_root = TreeNode(root.val)
    new_root.left = clone_binary_tree(root.left)
    new_root.right = clone_binary_tree(root.right)
    return new_root

def get_string(node):
    """Convert tree to string representation"""
    if not node:
        return "null"
    
    x = "{" + str(node.val) + ","
    x += get_string(node.left) if node.left else "null"
    x += ","
    x += get_string(node.right) if node.right else "null"
    x += "}"
    return x

def all_possible_fbt(N):
    """Generate all possible full binary trees with N nodes"""
    if N % 2 == 0:
        return []
    if N == 1:
        return [TreeNode(0)]
    
    res = []
    for i in range(1, N, 2):  # select number of left subtree nodes
        for l in all_possible_fbt(i):
            for r in all_possible_fbt(N - i - 1):
                root = TreeNode(0)
                root.left = l
                root.right = r
                res.append(root)
    return res

def get_nth_permutation(array, n):
    """Get nth permutation of array using factoradic system"""
    try:
        import factoradic
        narr = array.copy()
        tarr = []
        m = factoradic.to_factoradic(n)
        m.reverse()
        lm = len(m)
        rem = abs(len(narr) - lm)
        
        for i in range(rem):
            m.insert(0, 0)
        
        for i in m:
            if i < len(narr):
                tarr.append(narr.pop(i))
            else:
                tarr.append(narr.pop(-1) if narr else array[0])
        
        return tarr
    except:
        # Fallback if factoradic not available
        return array

def gen_coord(W, H):
    """Generate initial coordinate bounds"""
    return [[0, 0], [W, 0], [0, H], [W, H], "Room"]

def split_room(coord, axis, ratio):
    """Split a room based on axis and ratio"""
    if ratio > 1:
        ratio = 0.5
    
    if axis == 1:  # split on x axis
        dist = abs(coord[1][0] - coord[0][0])
        dist = dist * ratio
        new_coords = []
        new_coords.append([
            coord[0],
            [coord[0][0] + dist, coord[1][1]],
            coord[2],
            [coord[2][0] + dist, coord[3][1]],
            coord[4]
        ])
        new_coords.append([
            [coord[0][0] + dist, coord[1][1]],
            coord[1],
            [coord[2][0] + dist, coord[3][1]],
            coord[3],
            coord[4]
        ])
        return new_coords
    else:  # split on y axis
        dist = abs(coord[2][1] - coord[0][1])
        dist = dist * ratio
        new_coords = []
        new_coords.append([
            coord[0],
            coord[1],
            [coord[0][0], coord[0][1] + dist],
            [coord[1][0], coord[1][1] + dist],
            coord[4]
        ])
        new_coords.append([
            [coord[0][0], coord[0][1] + dist],
            [coord[1][0], coord[1][1] + dist],
            coord[2],
            coord[3],
            coord[4]
        ])
        return new_coords

def generate_rooms(coord, tree):
    """Generate rooms from coordinate and tree structure"""
    if not tree.left:
        coord[4] = tree.val
        return [coord]
    
    rooms = []
    splits = split_room(coord, tree.val[0], tree.val[1])
    rooms.extend(generate_rooms(splits[0], tree.left))
    rooms.extend(generate_rooms(splits[1], tree.right))
    return rooms

def rooms_to_lines(rooms):
    """Convert rooms to line segments"""
    lines = []
    for room in rooms:
        lines.append([room[0], room[1], room[4]])
        lines.append([room[0], room[2], room[4]])
        lines.append([room[1], room[3], room[4]])
        lines.append([room[2], room[3], room[4]])
    return lines

def check_colinear(set1, set2):
    """Check if two line segments are colinear and calculate overlap"""
    x1, y1, x2, y2 = set1
    x3, y3, x4, y4 = set2
    
    # Check if lines are parallel to axes
    if x1 == x2 and x3 == x4:  # Both vertical
        if x1 == x3:  # Same x coordinate
            overlap = min(max(y1, y2), max(y3, y4)) - max(min(y1, y2), min(y3, y4))
            return [max(0, overlap), "y"]
    elif y1 == y2 and y3 == y4:  # Both horizontal
        if y1 == y3:  # Same y coordinate
            overlap = min(max(x1, x2), max(x3, x4)) - max(min(x1, x2), min(x3, x4))
            return [max(0, overlap), "x"]
    
    return [0, None]

def check_in(line, line_list):
    """Check if line is already in line list"""
    line1 = line
    line2 = [line[1], line[0]]
    return line1 not in line_list and line2 not in line_list

def normalize_lines(lines):
    """Normalize and merge overlapping lines"""
    normalized = []
    used_indices = set()
    
    for i, line1 in enumerate(lines):
        if i in used_indices:
            continue
            
        current_line = [line1[0], line1[1]]
        used_indices.add(i)
        
        for j, line2 in enumerate(lines):
            if j in used_indices or i == j:
                continue
                
            overlap_info = check_colinear(
                [line1[0][0], line1[0][1], line1[1][0], line1[1][1]],
                [line2[0][0], line2[0][1], line2[1][0], line2[1][1]]
            )
            
            if overlap_info[0] >= 0:
                new_line = None
                if overlap_info[1] == "x":
                    new_line = [
                        [max(line1[0][0], line1[1][0], line2[0][0], line2[1][0]), line1[1][1]],
                        [min(line1[0][0], line1[1][0], line2[0][0], line2[1][0]), line2[1][1]]
                    ]
                elif overlap_info[1] == "y":
                    new_line = [
                        [line1[0][0], max(line1[0][1], line1[1][1], line2[0][1], line2[1][1])],
                        [line2[0][0], min(line1[0][1], line1[1][1], line2[0][1], line2[1][1])]
                    ]
                
                if new_line:
                    current_line = new_line
                    used_indices.add(j)
        
        if check_in(current_line, normalized):
            normalized.append(current_line)
    
    return normalized

def lines_to_json(lines):
    """Convert lines to JSON format"""
    connections = []
    for line in lines:
        connections.append({
            "x1": line[0][0],
            "y1": line[0][1],
            "x2": line[1][0],
            "y2": line[1][1],
            "type": "Wall"
        })
    return connections

def gen_tree(gene, rooms, trees):
    """Generate tree from gene and rooms"""
    if not trees or gene[0] >= len(trees):
        return trees[0] if trees else TreeNode(rooms[0] if rooms else "Room")
    
    tree = clone_binary_tree(trees[gene[0]])
    perm = get_nth_permutation(rooms, gene[1])
    
    split_genes = []
    for i in range(len(rooms) - 1):
        split_genes.append([gene[(i * 2) + 2], gene[(i * 2) + 3] / 10])
    
    tree.maketree(perm, split_genes)
    return tree

def check_adjacent(room1, room2, threshold):
    """Check if two rooms are adjacent"""
    lines = rooms_to_lines([room1, room2])
    
    for line1 in lines:
        for line2 in lines:
            if line1[2] != line2[2]:  # Different rooms
                overlap_info = check_colinear(
                    [line1[0][0], line1[0][1], line1[1][0], line1[1][1]],
                    [line2[0][0], line2[0][1], line2[1][0], line2[1][1]]
                )
                if overlap_info[0] >= threshold:
                    return True
    return False

def room_to_dict(rooms):
    """Convert rooms list to dictionary"""
    room_dict = {}
    for room in rooms:
        room_dict[room[4]] = room
    return room_dict

def get_rooms(connections):
    """Extract unique room names from connections"""
    room_list = []
    for conn in connections:
        from_tag = conn.get('from_tag')
        to_tag = conn.get('to_tag')
        
        # Only add valid tags
        if from_tag and from_tag not in room_list:
            room_list.append(from_tag)
        if to_tag and to_tag not in room_list:
            room_list.append(to_tag)
    return room_list

def get_connection_list(connections):
    """Convert connections to list format"""
    conns = []
    for connection in connections:
        from_tag = connection.get('from_tag')
        to_tag = connection.get('to_tag')
        
        # Skip invalid connections
        if not from_tag or not to_tag:
            print(f"Warning: Skipping connection with missing tags: {connection}")
            continue
            
        # Extract room type from tag (e.g., "kitchen-0" -> "kitchen")
        from_type = from_tag.split("-")[0] if "-" in from_tag else from_tag
        to_type = to_tag.split("-")[0] if "-" in to_tag else to_tag
        
        conn = [
            from_tag,
            from_type,
            to_tag,
            to_type
        ]
        conns.append(conn)
    return conns

def get_percentage_area(w, h, coords):
    """Calculate percentage area of room"""
    total_area = w * h
    room_area = abs(coords[1][0] - coords[0][0]) * abs(coords[2][1] - coords[0][1])
    return (room_area / total_area) * 100

def get_proportion(room):
    """Get room proportion (width/height ratio)"""
    line1 = [room[0], room[1]]
    line2 = [room[0], room[2]]
    
    x1 = math.dist(line1[0], line1[1])
    x2 = math.dist(line2[0], line2[1])
    
    if x1 >= x2:
        return x2 / x1 if x1 > 0 else 1
    else:
        return x1 / x2 if x2 > 0 else 1

def fitness(input_graph, gene, trees):
    """Calculate fitness score for a gene"""
    score = 0
    
    try:
        tree = gen_tree(gene, input_graph["rooms"], trees)
        rooms = generate_rooms(gen_coord(input_graph["width"], input_graph["height"]), tree)
        rooms_dict = room_to_dict(rooms)
        
        # Check adjacency requirements
        for connection in input_graph["connections"]:
            room1_key = connection[0]
            room2_key = connection[2]
            
            if room1_key in rooms_dict and room2_key in rooms_dict:
                if check_adjacent(rooms_dict[room1_key], rooms_dict[room2_key], DOOR_LENGTH):
                    score += ADJACENCY_REWARD
        
        # Check area percentages
        for room in rooms:
            room_type = room[4].split('-')[0]
            if room_type in input_graph["percents"]:
                p_area = get_percentage_area(input_graph["width"], input_graph["height"], room)
                expected = input_graph["percents"][room_type]
                
                if expected > 0:
                    deviation = abs((p_area - expected) / expected)
                    if deviation <= 1:
                        score += PERCENTAGE_REWARD * (1 - deviation)
        
        # Check proportions
        for room in rooms:
            room_type = room[4].split('-')[0]
            if room_type in input_graph["proportions"]:
                proportion = get_proportion(room)
                expected = input_graph["proportions"][room_type]
                
                if expected > 0:
                    deviation = abs((proportion - expected) / expected)
                    if deviation <= 1:
                        score += PROPORTION_REWARD * (1 - deviation)
        
    except Exception as e:
        print(f"Fitness calculation error: {e}")
        score = 0
    
    return max(0, score)

def validate_repair_gene(gene, nr, cat):
    """Validate and repair gene if needed"""
    if len(gene) < 4:
        return gene
    
    for i in range(len(gene)):
        if i == 0 and (gene[0] < 0 or gene[0] > cat):
            gene[0] = random.randint(0, cat)
        elif i == 1 and (gene[1] < 0 or gene[1] > math.factorial(nr) - 1):
            gene[1] = random.randint(0, max(0, math.factorial(nr) - 1))
        elif i > 1:
            if i % 2 == 0:
                if gene[i] not in [0, 1]:
                    gene[i] = random.randint(0, 1)
            else:
                if gene[i] < 1 or gene[i] > 9:
                    gene[i] = random.randint(1, 9)
    
    return gene

def gen_population(N, nr, cat):
    """Generate initial population"""
    pop = []
    for i in range(N):
        chrom = []
        chrom.append(random.randint(0, cat))
        chrom.append(random.randint(0, max(0, math.factorial(nr) - 1)))
        
        for j in range(nr - 1):
            chrom.append(random.randint(0, 1))
            chrom.append(random.randint(1, 9))
        
        pop.append([chrom, None])
    
    return pop

def chromosome_to_bin(chromosome, nr, cat):
    """Convert chromosome to binary string"""
    chrom = ""
    for i in range(len(chromosome)):
        if i == 0:
            glen = len(bin(cat)[2:]) if cat > 0 else 1
        elif i == 1:
            glen = len(bin(max(0, math.factorial(nr) - 1))[2:]) if nr > 0 else 1
        elif i % 2 == 0:
            glen = 1
        else:
            glen = len(bin(9)[2:])
        
        chrom += bin(chromosome[i])[2:].zfill(glen)
    
    return chrom

def bin_to_chromosome(bins, nr, cat):
    """Convert binary string to chromosome"""
    chromosome = []
    pos = 0
    
    # Extract tree index
    if cat > 0:
        glen = len(bin(cat)[2:])
        chromosome.append(int(bins[pos:pos + glen], 2))
        pos += glen
    else:
        chromosome.append(0)
    
    # Extract permutation index
    if nr > 0:
        glen = len(bin(max(0, math.factorial(nr) - 1))[2:])
        chromosome.append(int(bins[pos:pos + glen], 2) if glen > 0 else 0)
        pos += glen
    else:
        chromosome.append(0)
    
    # Extract split genes
    for j in range(nr - 1):
        # Split axis (0 or 1)
        chromosome.append(int(bins[pos:pos + 1], 2) if pos < len(bins) else 0)
        pos += 1
        
        # Split ratio (1-9)
        glen = len(bin(9)[2:])
        chromosome.append(int(bins[pos:pos + glen], 2) if pos + glen <= len(bins) else 1)
        pos += glen
    
    return chromosome

def crossover(chrom1, chrom2, nr, cat):
    """Perform crossover between two chromosomes"""
    c1 = chromosome_to_bin(chrom1, nr, cat)
    c2 = chromosome_to_bin(chrom2, nr, cat)
    
    if len(c1) == 0 or len(c2) == 0:
        return [chrom1, None], [chrom2, None]
    
    crossover_point = random.randint(1, min(len(c1), len(c2)) - 1)
    
    new_c1 = c1[:crossover_point] + c2[crossover_point:]
    new_c2 = c2[:crossover_point] + c1[crossover_point:]
    
    child1 = bin_to_chromosome(new_c1, nr, cat)
    child2 = bin_to_chromosome(new_c2, nr, cat)
    
    child1 = validate_repair_gene(child1, nr, cat)
    child2 = validate_repair_gene(child2, nr, cat)
    
    return [child1, None], [child2, None]

def mutate(chrom, nr, cat):
    """Mutate a chromosome"""
    c1 = chromosome_to_bin(chrom, nr, cat)
    
    if len(c1) == 0:
        return [chrom, None]
    
    mutation_point = random.randint(0, len(c1) - 1)
    
    c1_list = list(c1)
    c1_list[mutation_point] = '1' if c1_list[mutation_point] == '0' else '0'
    c1 = ''.join(c1_list)
    
    c2 = bin_to_chromosome(c1, nr, cat)
    c2 = validate_repair_gene(c2, nr, cat)
    
    return [c2, None]

def check_duplicate(chromosome, population):
    """Check if chromosome already exists in population"""
    for individual in population:
        if individual[0] == chromosome[0]:
            return True
    return False

def GA(pop_size, generations_count, nr, cat, input_graph, trees):
    """Main genetic algorithm function"""
    print(f"Starting GA with pop_size={pop_size}, generations={generations_count}")
    
    pop = gen_population(pop_size, nr, cat)
    
    # Initial fitness calculation
    for j in range(len(pop)):
        if pop[j][1] is None:
            pop[j][1] = fitness(input_graph, pop[j][0], trees)
    
    for i in range(generations_count):
        no_of_crossover = int(len(pop) * 0.5)
        no_of_mutations = int(len(pop) * 2.5)
        
        # Crossover operations
        for n in range(no_of_crossover):
            parent1 = random.choice(pop)
            parent2 = random.choice(pop)
            
            child1, child2 = crossover(parent1[0], parent2[0], nr, cat)
            
            if not check_duplicate(child1, pop):
                pop.append(child1)
            if not check_duplicate(child2, pop):
                pop.append(child2)
        
        # Mutation operations
        for n in range(no_of_mutations):
            parent = random.choice(pop)
            child = mutate(parent[0], nr, cat)
            
            if not check_duplicate(child, pop):
                pop.append(child)
        
        # Calculate fitness for new individuals
        for j in range(len(pop)):
            if pop[j][1] is None:
                pop[j][1] = fitness(input_graph, pop[j][0], trees)
        
        # Sort by fitness and keep best individuals
        pop = sorted(pop, key=lambda x: x[1], reverse=True)
        pop = pop[:pop_size]
        
        # Calculate average fitness
        avg_fitness = sum(chrom[1] for chrom in pop) / len(pop)
        print(f"Generation {i + 1}: Average fitness = {avg_fitness:.2f}")
    
    return pop[:5]

def get_room_centers(rooms):
    """Get room centers for labeling"""
    room_centers = []
    
    for room in rooms:
        x1, y1 = room[0]
        x2, y2 = room[1]
        x3, y3 = room[2]
        x4, y4 = room[3]
        
        center_x = (x1 + x2) / 2
        center_y = (y1 + y3) / 2
        
        room_centers.append({
            'x': center_x,
            'y': center_y,
            'type': 'label',
            'label': room[4],
            'x1': x1, 'y1': y1,
            'x2': x2, 'y2': y2,
            'x3': x3, 'y3': y3,
            'x4': x4, 'y4': y4
        })
    
    return room_centers

def get_adjacent_wall(room1, room2, threshold):
    """Get adjacent wall between two rooms"""
    lines1 = rooms_to_lines([room1])
    lines2 = rooms_to_lines([room2])
    
    for line1 in lines1:
        for line2 in lines2:
            overlap_info = check_colinear(
                [line1[0][0], line1[0][1], line1[1][0], line1[1][1]],
                [line2[0][0], line2[0][1], line2[1][0], line2[1][1]]
            )
            
            if overlap_info[0] >= threshold:
                return True, [line1[0], line1[1]]
    
    return False, None

def generate_door(line):
    """Generate door on a wall line"""
    door_len = DOOR_LENGTH
    
    if line[0][0] == line[1][0]:  # Vertical wall
        midpoint = (line[0][1] + line[1][1]) / 2
        return [[line[0][0], midpoint + door_len / 2], [line[0][0], midpoint - door_len / 2]]
    
    if line[0][1] == line[1][1]:  # Horizontal wall
        midpoint = (line[0][0] + line[1][0]) / 2
        return [[midpoint + door_len / 2, line[0][1]], [midpoint - door_len / 2, line[0][1]]]
    
    return line

def check_inclusion(connection, door):
    """Check if door can be included in connection"""
    x1, y1 = connection["x1"], connection["y1"]
    x2, y2 = connection["x2"], connection["y2"]
    
    overlap_info = check_colinear(
        [x1, y1, x2, y2],
        [door[0][0], door[0][1], door[1][0], door[1][1]]
    )
    
    if overlap_info[0] > 0:
        if overlap_info[1] == 'y':
            if overlap_info[0] >= abs(door[0][1] - door[1][1]):
                line1 = [[x1, min(y1, y2)], [x1, min(door[0][1], door[1][1])]]
                line2 = [[x1, min(door[0][1], door[1][1])], [x1, max(door[0][1], door[1][1])]]
                line3 = [[x1, max(door[0][1], door[1][1])], [x1, max(y1, y2)]]
                return True, line1, line2, line3
        elif overlap_info[1] == 'x':
            if overlap_info[0] >= abs(door[0][0] - door[1][0]):
                line1 = [[min(x1, x2), y1], [min(door[0][0], door[1][0]), y1]]
                line2 = [[min(door[0][0], door[1][0]), y1], [max(door[0][0], door[1][0]), y1]]
                line3 = [[max(door[0][0], door[1][0]), y1], [max(x1, x2), y1]]
                return True, line1, line2, line3
    
    return [False]

def insert_door_connections(connections, doors):
    """Insert door connections into wall connections"""
    for door in doors:
        added = False
        new_lines = []
        connection_to_remove = None
        
        for connection in connections:
            if not added:
                inclusion_result = check_inclusion(connection, door)
                if inclusion_result[0]:
                    added = True
                    new_lines = [inclusion_result[1], inclusion_result[2], inclusion_result[3]]
                    connection_to_remove = connection
                    break
        
        if connection_to_remove:
            connections.remove(connection_to_remove)
            # Add wall segments
            connections.append({
                "x1": new_lines[0][0][0], "y1": new_lines[0][0][1],
                "x2": new_lines[0][1][0], "y2": new_lines[0][1][1],
                "type": "Wall"
            })
            # Add door
            connections.append({
                "x1": new_lines[1][0][0], "y1": new_lines[1][0][1],
                "x2": new_lines[1][1][0], "y2": new_lines[1][1][1],
                "type": "Door"
            })
            # Add remaining wall segment
            connections.append({
                "x1": new_lines[2][0][0], "y1": new_lines[2][0][1],
                "x2": new_lines[2][1][0], "y2": new_lines[2][1][1],
                "type": "Wall"
            })
    
    return connections

def gene_to_json_map(input_graph, gene, trees, rooms_list):
    """Convert gene to JSON map representation"""
    tree = gen_tree(gene, rooms_list, trees)
    rooms = generate_rooms(gen_coord(input_graph["width"], input_graph["height"]), tree)
    rooms_dict = room_to_dict(rooms)
    
    doors = []
    for connection in input_graph["connections"]:
        room1_key = connection[0]
        room2_key = connection[2]
        
        if room1_key in rooms_dict and room2_key in rooms_dict:
            adjacent_result = get_adjacent_wall(
                rooms_dict[room1_key], 
                rooms_dict[room2_key], 
                DOOR_LENGTH
            )
            if adjacent_result[0]:
                doors.append(generate_door(adjacent_result[1]))
    
    lines = rooms_to_lines(rooms)
    normalized_lines = normalize_lines(lines.copy())
    json_lines = lines_to_json(normalized_lines)
    json_lines = insert_door_connections(json_lines, doors)
    
    room_centers = get_room_centers(rooms)
    json_lines.extend(room_centers)
    
    return json_lines, rooms

def GA_driver(connects, width, height, kitchen_p, living_p, drawing_p, car_p, bath_p, bed_p, gar_p, 
              kitchen_per, living_per, drawing_per, car_per, bath_per, bed_per, gar_per):
    """Main driver function for genetic algorithm"""
    
    print(f"Starting GA_driver with {len(connects)} connections")
    
    rooms = get_rooms(connects)
    conns = get_connection_list(connects)
    
    input_graph = {
        "width": width,
        "height": height,
        "connections": conns,
        "rooms": rooms,
        "percents": {
            "livingroom": float(living_per),
            "kitchen": float(kitchen_per),
            "bedroom": float(bed_per),
            "bathroom": float(bath_per),
            "carporch": float(car_per),
            "garden": float(gar_per),
            "drawingroom": float(drawing_per)
        },
        "proportions": {
            "livingroom": float(living_p),
            "kitchen": float(kitchen_p),
            "bedroom": float(bed_p),
            "bathroom": float(bath_p),
            "carporch": float(car_p),
            "garden": float(gar_p),
            "drawingroom": float(drawing_p)
        }
    }
    
    if len(rooms) == 0:
        return {"maps": [], "room": []}
    
    # Generate all possible full binary trees
    all_trees = all_possible_fbt(2 * len(rooms) - 1)
    print(f"Generated {len(all_trees)} possible trees")
    
    if len(all_trees) == 0:
        return {"maps": [], "room": []}
    
    generations = 50  # Reduced for faster execution
    pop_size = 10
    
    # Run genetic algorithm multiple times for diversity
    print("Running genetic algorithm...")
    top1 = GA(pop_size, generations, len(rooms), len(all_trees) - 1, input_graph, all_trees)
    top2 = GA(pop_size, generations, len(rooms), len(all_trees) - 1, input_graph, all_trees)
    top3 = GA(pop_size, generations, len(rooms), len(all_trees) - 1, input_graph, all_trees)
    top4 = GA(pop_size, generations, len(rooms), len(all_trees) - 1, input_graph, all_trees)
    top5 = GA(pop_size, generations, len(rooms), len(all_trees) - 1, input_graph, all_trees)
    
    json_maps = []
    room_results = []
    
    # Generate maps from best solutions
    for top_result in [top1, top2, top3, top4, top5]:
        if top_result:
            json_map, room_map = gene_to_json_map(input_graph, top_result[0][0], all_trees, rooms)
            json_maps.append(json_map)
            room_results.append(room_map)
    
    print(f"Generated {len(json_maps)} floorplan variations")
    
    return {"maps": json_maps, "room": room_results}