import ee
import geemap
import os

# --- 1. Initialization and Authentication ---
ee.Authenticate()
try:
    # Initialize GEE (geemap handles both ee.Initialize() and optional map display setup)
    # ee.Initialize(project='yestech-gee')
    print("Google Earth Engine initialized successfully.")
except Exception as e:
    # Note: If this fails, run ee.Authenticate() in a separate cell/script first
    ee.Initialize(project='yestech-gee')
    print(f"Error initializing Earth Engine. Please check project ID or run ee.Authenticate(): {e}")

# --- 2. Define Parameters and Local Shapefile Path ---

# **REQUIRED: Update this path to your local shapefile (.shp file)**
LOCAL_SHAPEFILE_PATH = r'Z:\Data\Yes-Tech Locations SHP\Bhanjanagar Block\Bhanjanagar_Block.shp'

# GEE Collection and Bands
COLLECTION_ID = 'MODIS/061/MOD15A2H'
BANDS_TO_EXTRACT = ['Fpar_500m', 'FparLai_QC']

# Date Range
START_DATE = '2024-06-01'
END_DATE_FILTER = '2024-12-13' # Exclusive end date means data up to 2024-12-12 is included

# Export Settings
EXPORT_FOLDER_NAME = 'MOD15A2H_LAI_FPAR_EXPORT'
EXPORT_FILENAME_PREFIX = 'MOD15A2H_2024'

# --- 3. Load Area of Interest (AOI) from Local Shapefile ---

if not os.path.exists(LOCAL_SHAPEFILE_PATH):
    print(f"Error: Shapefile not found at {LOCAL_SHAPEFILE_PATH}")
    # Handle the error or exit

# Use geemap to convert the local shapefile to an ee.Geometry
try:
    AOI = geemap.shp_to_ee(LOCAL_SHAPEFILE_PATH)
    print(f"Successfully loaded AOI from {LOCAL_SHAPEFILE_PATH}")
except Exception as e:
    print(f"Failed to load shapefile into GEE: {e}")
    # Handle the error or exit

# --- 4. Filter and Process the ImageCollection ---

# 4.1 Define the Preprocessing Function (Scale, Cast, Clip, and Copy Metadata)
def process_and_clip(image):
    """
    Clips, scales Fpar, casts both Fpar and QC to Float32,
    and copies the system:time_start property.
    """

    # 1. Clip to the AOI
    clipped_image = image.clipToCollection(AOI)

    # 2. Scale FPAR (0.001) and EXPLICITLY CAST to Float32 to ensure consistency
    scaled_fpar = (
        clipped_image.select('Fpar_500m')
        .multiply(0.01)
        .rename('Fpar_Scaled')
        .cast({'Fpar_Scaled': 'float'})
    )

    # 3. Get QC band and EXPLICITLY CAST TO Float32
    qc_band = (
        clipped_image.select('FparLai_QC')
        .rename('QC')
        .cast({'QC': 'float'})
    )

    # 4. Combine bands
    combined_image = scaled_fpar.addBands(qc_band)

    # 5. CRUCIAL FIX: Copy metadata (like system:time_start) from the original 'image'
    # This prevents the 'NoDate_X' error.
    return combined_image.copyProperties(image, ['system:time_start'])

# 4.2 Filter the collection
image_collection = ee.ImageCollection(COLLECTION_ID) \
    .filterDate(START_DATE, END_DATE_FILTER) \
    .filterBounds(AOI) \
    .select(BANDS_TO_EXTRACT)

count = image_collection.size().getInfo()
print(f"Total images found: {count}")

if count == 0:
    print("No images found for the specified criteria. Exiting.")
else:
    # 4.3 Process the entire collection (clip, scale, and cast each image)
    processed_collection = image_collection.map(process_and_clip)

    # 4.4 Create the temporal composite (Mean)
    # The result will inherit the Float32 cast from the input images
    mean_composite = processed_collection.mean().rename(['Fpar_Mean_Scaled', 'QC_Composite'])

    # --- 5. Export to Google Drive (Mean Composite and Single Images) ---

    # Define base export task configuration
    base_task_config = {
        'region': AOI.geometry().bounds().getInfo()['coordinates'],
        'folder': EXPORT_FOLDER_NAME,
        'scale': 500, # Native resolution for MOD15A2H
        'fileFormat': 'GeoTIFF',
        'crs': 'EPSG:4326',
        'maxPixels': 1e13
    }

    # 5.1 Export the Mean Composite Image
    export_filename_mean = f"{EXPORT_FILENAME_PREFIX}_Mean_Composite"
    print(f"Starting export task for: {export_filename_mean}")
    task_mean = ee.batch.Export.image.toDrive(
        image=mean_composite,
        description=export_filename_mean,
        fileNamePrefix=export_filename_mean,
        **base_task_config
    )
    task_mean.start()
    print(f"✅ Export task '{export_filename_mean}' started.")

    # 5.2 Export all Single Images in the collection
    image_list = processed_collection.toList(processed_collection.size())

    print(f"Starting export tasks for {count} individual images...")

    for i in range(count):
        image = ee.Image(image_list.get(i))

        # Get the time_start property. Use ee.Algorithms.If() to handle nulls
        # (though .copyProperties should have ensured it exists).
        time_start = image.get('system:time_start')

        # Use ee.Algorithms.If to safely format the date or use a placeholder
        date_str = ee.Algorithms.If(
            time_start,
            ee.Date(time_start).format('YYYYMMdd'),
            f'NoDate_{i+1}' # Placeholder if the property is somehow still missing
        ).getInfo()

        # Create a unique filename for the single image
        export_filename_single = f"{EXPORT_FILENAME_PREFIX}_{date_str}"

        # Define the task
        task_single = ee.batch.Export.image.toDrive(
            image=image,
            description=export_filename_single,
            fileNamePrefix=export_filename_single,
            **base_task_config
        )
        task_single.start()
        print(f"   ... Task {i+1}/{count} started: {export_filename_single}")

    print("\n")
    print("=========================================================================")
    print(f"✅ All {count+1} export tasks (1 composite + {count} single images) started.")
    print(f"   Check the GEE Tasks tab (https://code.earthengine.google.com/tasks) for status.")
    print(f"   The GeoTIFFs will appear in a folder named '{EXPORT_FOLDER_NAME}' in your Google Drive.")
    print("=========================================================================")