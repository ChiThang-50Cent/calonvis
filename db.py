import utils
import numpy as np

from tinydb import TinyDB, where

line_db = TinyDB("./tinydb/line.json")
cluster_db = TinyDB("./tinydb/cluster.json")
canvas_db = TinyDB("./tinydb/canvas.json")

# Canvas
def insert_canvas():
    return canvas_db.insert({"clusters": []})

def update_canvas(canvas_id, cluster_id):
    cluster_ids = canvas_db.get(doc_id=canvas_id)['clusters']
    cluster_ids.append(cluster_id)

    return canvas_db.update(
        {"clusters": list(set(cluster_ids))},
        doc_ids=[canvas_id]
    )

# Cluster
def insert_cluster(cluster, canvas_id):
    if not len(cluster):
        raise Exception("Invalid cluster, cluster must have at least one line!")

    new_cluster = {"lines": []}

    for line in cluster:
        line_id = insert_line(line)
        new_cluster["lines"].append(line_id)

    new_line_bbox = [line["bbox"] for line in line_db.get(doc_ids=new_cluster["lines"])]
    new_cluster["bbox"] = utils.compute_bounding_box(new_line_bbox)
    new_cluster["center"] = utils.compute_center(new_cluster["bbox"])
    new_cluster["canvas"] = canvas_id

    def get_nearest_cluster():

        all_clusters = cluster_db.search(where('canvas') == canvas_id)
        if not len(all_clusters):
            return None

        all_cluster_center = [cluster["center"] for cluster in all_clusters]
        all_distance = list(map(
            lambda x: utils.compute_distance(new_cluster["center"], x), 
            all_cluster_center
        ))

        return all_clusters[np.argmin(all_distance)]

    nearest_cluster = get_nearest_cluster()

    if nearest_cluster is not None:
        check_is_near_any_cluster = utils.is_new_cluster_near_by(
            nearest_cluster["bbox"], new_cluster["bbox"]
        )
        if check_is_near_any_cluster:
            update_cluster(
                nearest_cluster, new_cluster
            )[0]

            return {
                'id': nearest_cluster.doc_id,
                **cluster_db.get(doc_id=nearest_cluster.doc_id)
            }

    new_id = insert_new_cluster(new_cluster)
    return {'id': new_id, **new_cluster }

def insert_new_cluster(cluster):
    valid_required_key = all(
        key in cluster.keys() for key in ["lines", "center", "bbox", "canvas"]
    )
    if not valid_required_key:
        raise Exception('Invalid required, cluster must have "center, bbox, line" key!')

    return cluster_db.insert(cluster)

def update_cluster_operation(line_ids, new_center, new_bbox):
    def transform(doc):
        doc["lines"].extend(line_ids)
        doc["center"] = new_center
        doc["bbox"] = new_bbox
    return transform

def update_cluster(current_cluster, new_cluster):

    new_bbox = utils.re_compute_bbox(
        current_cluster['bbox'],
        new_cluster['bbox']
    )

    new_center = utils.compute_center(new_bbox)

    return cluster_db.update(
        update_cluster_operation(
            new_cluster['lines'],
            new_bbox=new_bbox,
            new_center=new_center
        ), 
        doc_ids=[current_cluster.doc_id]
    )

# Line
def insert_line(line: dict):
    if "coords" not in line.keys():
        raise Exception("Invalid line")

    line_bbox = utils.compute_bounding_box(line["coords"])
    line_center = utils.compute_center(line_bbox)

    line_id = line_db.insert(
        {
            "coords": line["coords"],
            "center": line_center,
            "bbox": line_bbox,
        }
    )

    return line_id