import os
import json
import trimesh
import numpy as np

def analyze_gltf_model(filepath):
    """Comprehensive GLTF Model Diagnostic"""
    try:
        # Load mesh
        mesh = trimesh.load(filepath)
        
        # Geometric Analysis
        print("🔬 GEOMETRIC ANALYSIS 🔬")
        print(f"Vertices: {len(mesh.vertices)}")
        print(f"Faces: {len(mesh.faces)}")
        
        # Bounding Box
        bounds = mesh.bounding_box.bounds
        dimensions = bounds[1] - bounds[0]
        
        print("\n📏 DIMENSIONS")
        print(f"X Range: {bounds[0][0]} to {bounds[1][0]}")
        print(f"Y Range: {bounds[0][1]} to {bounds[1][1]}")
        print(f"Z Range: {bounds[0][2]} to {bounds[1][2]}")
        
        print("\n📦 VOLUME & CENTER")
        volume = mesh.volume
        center_mass = mesh.center_mass
        
        print(f"Volume: {volume}")
        print(f"Center of Mass: {center_mass}")
        
        # Normalization Check
        normalized_vertices = (mesh.vertices - center_mass) / np.max(np.abs(dimensions))
        
        print("\n🧭 NORMALIZATION")
        print(f"Normalized Vertices Range: {normalized_vertices.min(axis=0)} to {normalized_vertices.max(axis=0)}")
        
        # Export Recommendations
        print("\n🚀 BLENDER EXPORT RECOMMENDATIONS")
        print("1. Apply all transformations (Ctrl+A)")
        print("2. Center origin to geometry")
        print("3. Scale to unit size (-1 to 1 range)")
        print("4. Use 'Selected Objects' in export")
        print("5. Compress: ON")
        print("6. Format: glTF Binary (.glb)")
        
        # Detailed JSON Output
        diagnostic_data = {
            "vertices": len(mesh.vertices),
            "faces": len(mesh.faces),
            "volume": volume,
            "center_mass": center_mass.tolist(),
            "dimensions": dimensions.tolist(),
            "bounds": bounds.tolist()
        }
        
        with open(f"{filepath}_diagnostic.json", 'w') as f:
            json.dump(diagnostic_data, f, indent=2)
        
    except Exception as e:
        print(f"🚨 DIAGNOSTIC FAILURE: {e}")

# Run on specific file
analyze_gltf_model('3d assets/brainz.glb')
