import numpy as np

NEAR_BY_THRESHOLD = 35

def compute_distance(point_1, point_2):
    point_1 = np.array(point_1)
    point_2 = np.array(point_2)
    return  np.linalg.norm(point_1 - point_2)

def compute_center(bbox):
    x_center = (bbox[0] + bbox[2]) / 2
    y_center = (bbox[1] + bbox[3]) / 2
    return [x_center, y_center]

def compute_bounding_box(coords):
    coords = np.array(coords)

    x_min = np.min(coords[:, 0])
    x_max = np.max(coords[:, 0])
    y_min = np.min(coords[:, 1])
    y_max = np.max(coords[:, 1])

    return [x_min, y_min, x_max, y_max]

def re_compute_bbox(current_bbox, new_bbox):
    x_min = min(current_bbox[0], new_bbox[0])
    y_min = min(current_bbox[1], new_bbox[1])
    x_max = max(current_bbox[2], new_bbox[2])
    y_max = max(current_bbox[3], new_bbox[3])
    return [x_min, y_min, x_max, y_max]

def is_new_cluster_near_by(current_cluster_bbox, new_cluster_bbox):
    if current_cluster_bbox[2] > new_cluster_bbox[2]:
        # Swapping
        current_cluster_bbox, new_cluster_bbox \
            = new_cluster_bbox, current_cluster_bbox
        
    current = np.array([current_cluster_bbox[2], current_cluster_bbox[3]])
    new = np.array([new_cluster_bbox[0], new_cluster_bbox[1]])

    distance = compute_distance(current, new)
    
    if distance < NEAR_BY_THRESHOLD:
        return True
    
    return False

