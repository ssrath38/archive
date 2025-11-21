import ee
import geemap
import os


# --- 1. Initialization and Authentication ---
ee.Authenticate()
try:
    ee.Initialize(project='yestech-gee')
    print("Google Earth Engine initialized successfully.")
except Exception as e:
    print(f"Error initializing Earth Engine: {e}")


# --- 2. Define Parameters and Local Shapefile Path ---
LOCAL_SHAPEFILE_PATH = r'Z:\Data\Yes-Tech Locations SHP\Jujomura Block\Jujomura_Block.shp'

# GEE Collection and Bands
COLLECTION_ID = 'MODIS/061/MOD15A2H'
BANDS_TO_EXTRACT = ['Fpar_500m', 'FparLai_QC']

# Date Range
START_DATE = '2024-06-01'
END_DATE_FILTER = '2024-12-31'

# Local Download Settings
OUTPUT_DIR = r'Z:\Work\rice_yield\fapar\data\jujomura'  # Change to your desired download location
os.makedirs(OUTPUT_DIR, exist_ok=True)


# --- 3. Load Area of Interest (AOI) from Local Shapefile ---
if not os.path.exists(LOCAL_SHAPEFILE_PATH):
    print(f"Error: Shapefile not found at {LOCAL_SHAPEFILE_PATH}")
    exit()

try:
    AOI = geemap.shp_to_ee(LOCAL_SHAPEFILE_PATH)
    print(f"Successfully loaded AOI from {LOCAL_SHAPEFILE_PATH}")
except Exception as e:
    print(f"Failed to load shapefile into GEE: {e}")
    exit()


# --- 4. Filter and Process the ImageCollection ---
def process_and_clip(image):
    """Clips, scales Fpar, casts both Fpar and QC to Float32."""
    clipped_image = image.clipToCollection(AOI)

    # Scale FPAR and cast to Float32
    scaled_fpar = (
        clipped_image.select('Fpar_500m')
        .multiply(0.01)
        .rename('Fpar_Scaled')
        .cast({'Fpar_Scaled': 'float'})
    )

    # Get QC band and cast to Float32
    qc_band = (
        clipped_image.select('FparLai_QC')
        .rename('QC')
        .cast({'QC': 'float'})
    )

    # Combine bands
    combined_image = scaled_fpar.addBands(qc_band)

    # Copy metadata
    return combined_image.copyProperties(image, ['system:time_start'])


# Filter the collection
image_collection = ee.ImageCollection(COLLECTION_ID).filterDate(START_DATE, END_DATE_FILTER).filterBounds(AOI).select(BANDS_TO_EXTRACT)

count = image_collection.size().getInfo()
print(f"Total images found: {count}")

if count == 0:
    print("No images found for the specified criteria. Exiting.")
else:
    # Process the collection
    processed_collection = image_collection.map(process_and_clip)
    image_list = processed_collection.toList(processed_collection.size())

    # --- 5. Download Images Directly to Local Disk ---
    print(f"\nStarting download of {count} images to {OUTPUT_DIR}...")

    for i in range(count):
        image = ee.Image(image_list.get(i))

        # Get the date
        time_start = image.get('system:time_start')
        date_str = ee.Algorithms.If(
            time_start,
            ee.Date(time_start).format('YYYYMMdd'),
            f'NoDate_{i+1}'
        ).getInfo()

        # Create filename
        filename = f"MOD15A2H_2024_{date_str}.tif"
        output_path = os.path.join(OUTPUT_DIR, filename)

        # Download image using geemap
        try:
            geemap.ee_export_image(
                image,
                filename=output_path,
                scale=500,
                region=AOI.geometry().bounds(),
                file_per_band=False,
                crs='EPSG:4326'
            )
            print(f"Downloaded {i+1}/{count}: {filename}")
        except Exception as e:
            print(f"Failed to download {filename}: {e}")

