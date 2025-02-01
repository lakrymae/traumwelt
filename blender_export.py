import bpy
import os
import sys
import stat

def ensure_directory_permissions(path):
    """
    Ensure full read/write permissions for the directory
    """
    try:
        # Attempt to change directory permissions
        os.chmod(path, stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO)
    except Exception as e:
        print(f"⚠️ Permission modification failed: {e}")

def export_scene_for_threejs(export_path):
    """
    Automated export script for Three.js compatibility
    
    Recommended Usage:
    1. Open your .blend file
    2. Run this script in Blender's scripting workspace
    3. Exports to specified directory
    """
    
    try:
        # Use absolute path to avoid permission issues
        export_path = os.path.normpath(r'C:\Users\traumwelt\CascadeProjects\traumwelt\3d assets')
        
        # Ensure export directory exists with full permissions
        if not os.path.exists(export_path):
            os.makedirs(export_path, mode=0o777, exist_ok=True)
        
        # Force permission modification
        ensure_directory_permissions(export_path)
        
        # Deselect all objects
        bpy.ops.object.select_all(action='DESELECT')
        
        # Prepare export settings
        export_settings = {
            'export_format': 'GLB',  # Prefer GLB for web
            'export_animations': False,  # Disable if no animations needed
            'export_draco_mesh_compression': True,  # Reduce file size
            'export_materials': 'EXPORT',
            'export_colors': True,
            'export_selected': False  # Export entire scene
        }
        
        # Perform export
        output_path = os.path.join(export_path, 'brainz.glb')
        bpy.ops.export_scene.gltf(
            filepath=output_path, 
            **export_settings
        )
        
        print(f"🚀 Scene exported successfully to: {output_path}")
        print("Recommended Three.js Import:")
        print("const loader = new THREE.GLTFLoader();")
        print("loader.load('3d assets/brainz.glb', (gltf) => { scene.add(gltf.scene); });")
    
    except Exception as e:
        print(f"❌ Export Failed: {e}")
        print(f"Error Details: {sys.exc_info()}")
        
        # Comprehensive diagnostic information
        print("\nDiagnostic Information:")
        print(f"Current Working Directory: {os.getcwd()}")
        print(f"Export Path: {export_path}")
        print(f"Path Exists: {os.path.exists(export_path)}")
        try:
            print(f"Path Permissions: {oct(os.stat(export_path).st_mode)}")
        except Exception as perm_error:
            print(f"Permission Check Failed: {perm_error}")

# Run the export
export_scene_for_threejs('3d assets')
