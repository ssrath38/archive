import ee
import geemap
import os
from datetime import datetime
import numpy as np

# ==================== INITIALIZATION ====================
# ee.Authenticate()
ee.Initialize(project='yestech-gee')
print("✅ Google Earth Engine initialized successfully.")

# ==================== CONFIGURATION ====================
# Paths
LOCAL_SHAPEFILE_PATH = r'Z:\Data\Yes-Tech Locations SHP\Jujomura Block\Jujomura_Block.shp'
OUTPUT_BASE_DIR = r'Z:\Work\rice_yield\lswi\data\jujomura'

# Create output subdirectories for each step
DIRS = {
    'step1_raw': os.path.join(OUTPUT_BASE_DIR, '01_RAW_MOD09A1'),
    'step2_scaled': os.path.join(OUTPUT_BASE_DIR, '02_SCALED_SF'),
    'step3_nir': os.path.join(OUTPUT_BASE_DIR, '03_NIR_Band'),
    'step3_swir': os.path.join(OUTPUT_BASE_DIR, '04_SWIR_Band'),
    'step4_lswi': os.path.join(OUTPUT_BASE_DIR, '05_LSWI'),
    'step5_water_stress': os.path.join(OUTPUT_BASE_DIR, '06_Water_Stress'),
    'step6_masked': os.path.join(OUTPUT_BASE_DIR, '07_Masked_Final')
}

for dir_path in DIRS.values():
    os.makedirs(dir_path, exist_ok=True)

# GEE Collection Parameters
COLLECTION_ID = 'MODIS/061/MOD09A1'
START_DATE = '2024-06-01'
END_DATE = '2024-12-31'

# Scale factors
SCALE_FACTOR = 0.0001
SPATIAL_RESOLUTION = 500

# ==================== STEP 1: LOAD AOI ====================
print("\n========== STEP 1: Loading Area of Interest ==========")
if not os.path.exists(LOCAL_SHAPEFILE_PATH):
    print(f"❌ Error: Shapefile not found at {LOCAL_SHAPEFILE_PATH}")
    exit()

try:
    AOI = geemap.shp_to_ee(LOCAL_SHAPEFILE_PATH)
    # Convert to the appropriate geometry and buffer slightly to avoid edge issues
    aoi_geometry = AOI.geometry().buffer(100)  # 100m buffer to avoid edge errors
    print(f"✅ AOI loaded successfully")
except Exception as e:
    print(f"❌ Failed to load shapefile: {e}")
    exit()

# ==================== STEP 2: FILTER IMAGE COLLECTION ====================
print("\n========== STEP 2: Filtering MOD09A1 Collection ==========")
image_collection = ee.ImageCollection(COLLECTION_ID) \
    .filterDate(START_DATE, END_DATE) \
    .filterBounds(aoi_geometry) \
    .select(['sur_refl_b02', 'sur_refl_b06'])

count = image_collection.size().getInfo()
print(f"✅ Found {count} images in date range")

if count == 0:
    print("❌ No images found. Exiting.")
    exit()

# ==================== PROCESSING FUNCTIONS ====================

def get_date_string(image):
    """Extract date string from image"""
    time_start = image.get('system:time_start')
    date_str = ee.Date(time_start).format('YYYYMMdd').getInfo()
    return date_str

def save_raster(image, output_path, description):
    """Save raster to local disk using geemap with error handling"""
    try:
        geemap.ee_export_image(
            image,
            filename=output_path,
            scale=SPATIAL_RESOLUTION,
            region=aoi_geometry.bounds(),
            file_per_band=False,
            crs='EPSG:4326'
        )
        print(f"   ✅ Saved: {description}")
        return True
    except Exception as e:
        print(f"   ❌ Failed to save {description}: {e}")
        return False

def safe_reduce_region(image, geometry, reducer, scale):
    """Safely compute statistics with error handling for projection issues"""
    try:
        # Reproject image to EPSG:4326 before reduction to avoid projection errors
        reprojected = image.reproject(crs='EPSG:4326', scale=scale)

        stats = reprojected.reduceRegion(
            reducer=reducer,
            geometry=geometry,
            scale=scale,
            maxPixels=1e13,
            bestEffort=True,
            tileScale=4
        ).getInfo()
        return stats
    except Exception as e:
        print(f"   ⚠️ Warning: Could not compute statistics: {e}")
        return {}

# ==================== MAIN PROCESSING LOOP ====================
print(f"\n========== Processing {count} images through all steps ==========\n")

image_list = image_collection.toList(count)
lswi_max = -999
lswi_images = []
lswi_stats_list = []

for i in range(count):
    print(f"\n--- Processing Image {i+1}/{count} ---")

    try:
        # Get original image
        original_image = ee.Image(image_list.get(i))
        date_str = get_date_string(original_image)
        print(f"Date: {date_str}")

        # STEP 2: Apply scale factor and reproject to EPSG:4326 to avoid clip errors
        print("  STEP 2: Applying scale factor and reprojecting...")

        # Reproject to EPSG:4326 BEFORE clipping to avoid SR-ORG:6974 transformation errors
        scaled_image = original_image.multiply(SCALE_FACTOR) \
            .reproject(crs='EPSG:4326', scale=SPATIAL_RESOLUTION) \
            .clip(aoi_geometry)

        scaled_path = os.path.join(DIRS['step2_scaled'], f'MOD09A1_{date_str}_Scaled.tif')
        save_raster(scaled_image, scaled_path, f"Scaled image - {date_str}")

        # STEP 3: Extract NIR (Band 2) and SWIR (Band 6)
        print("  STEP 3: Extracting NIR and SWIR bands...")
        nir_band = scaled_image.select('sur_refl_b02').rename('NIR')
        swir_band = scaled_image.select('sur_refl_b06').rename('SWIR')

        nir_path = os.path.join(DIRS['step3_nir'], f'MOD09A1_{date_str}_NIR.tif')
        swir_path = os.path.join(DIRS['step3_swir'], f'MOD09A1_{date_str}_SWIR.tif')

        save_raster(nir_band, nir_path, f"NIR band - {date_str}")
        save_raster(swir_band, swir_path, f"SWIR band - {date_str}")

        # STEP 4: Calculate LSWI = (NIR - SWIR) / (NIR + SWIR)
        print("  STEP 4: Calculating LSWI...")
        lswi = nir_band.subtract(swir_band).divide(
            nir_band.add(swir_band)
        ).rename('LSWI')

        lswi_path = os.path.join(DIRS['step4_lswi'], f'MOD09A1_{date_str}_LSWI.tif')
        save_raster(lswi, lswi_path, f"LSWI - {date_str}")

        # Store LSWI image
        lswi_images.append({
            'image': lswi,
            'date': date_str
        })

        # Get max LSWI value using safe reduction
        lswi_stats = safe_reduce_region(
            lswi,
            aoi_geometry,
            ee.Reducer.max(),
            SPATIAL_RESOLUTION
        )

        current_max = lswi_stats.get('LSWI', -999)
        if current_max > lswi_max:
            lswi_max = current_max

        lswi_stats_list.append({
            'date': date_str,
            'max_lswi': current_max
        })

        print(f"  📊 LSWI Max for {date_str}: {current_max:.4f}")

    except Exception as e:
        print(f"  ❌ Error processing image {i+1} ({date_str}): {e}")
        # Continue to next image instead of crashing
        continue

print(f"\n✅ LSWI Calculation Complete!")
print(f"📊 Overall LSWImax: {lswi_max:.4f}")

# ==================== STEP 5: CALCULATE WATER STRESS ====================
print(f"\n========== STEP 5: Calculating Water Stress ==========")
print(f"Using LSWImax = {lswi_max:.4f}")

for idx, lswi_data in enumerate(lswi_images):
    try:
        lswi_img = lswi_data['image']
        date_str = lswi_data['date']

        print(f"  Processing {idx+1}/{len(lswi_images)}: {date_str}")

        # Water Stress = (1 - LSWI) / (1 + LSWImax)
        water_stress = ee.Image(1).subtract(lswi_img).divide(
            ee.Image(1 + lswi_max)
        ).rename('Water_Stress')

        ws_path = os.path.join(DIRS['step5_water_stress'], f'MOD09A1_{date_str}_WaterStress.tif')
        save_raster(water_stress, ws_path, f"Water Stress - {date_str}")

        # STEP 6: Save masked output
        print(f"  STEP 6: Saving masked output...")
        masked_ws = water_stress.clip(aoi_geometry)

        masked_path = os.path.join(DIRS['step6_masked'], f'MOD09A1_{date_str}_WS_Masked.tif')
        save_raster(masked_ws, masked_path, f"Masked Water Stress - {date_str}")

    except Exception as e:
        print(f"  ❌ Error calculating water stress for {date_str}: {e}")
        continue

# ==================== SAVE SUMMARY STATISTICS ====================
print("\n========== Saving Summary Statistics ==========")
summary_file = os.path.join(OUTPUT_BASE_DIR, 'LSWI_WaterStress_Summary.csv')

with open(summary_file, 'w') as f:
    f.write("Date,Julian_Day,Max_LSWI,LSWImax_Used\n")
    for stat in lswi_stats_list:
        try:
            date_obj = datetime.strptime(stat['date'], '%Y%m%d')
            julian_day = date_obj.timetuple().tm_yday
            f.write(f"{stat['date']},{julian_day},{stat['max_lswi']:.6f},{lswi_max:.6f}\n")
        except:
            continue

print(f"✅ Summary saved to: {summary_file}")

# ==================== FINAL SUMMARY ====================
print("\n" + "="*70)
print("✅ LSWI WATER STRESS ANALYSIS COMPLETE!")
print("="*70)
print(f"📁 Output directory: {OUTPUT_BASE_DIR}")
print(f"📊 Total images processed: {len(lswi_images)}/{count}")
print(f"📊 LSWImax value used: {lswi_max:.6f}")
print("\nOutput folders:")
for step, path in DIRS.items():
    try:
        file_count = len([f for f in os.listdir(path) if f.endswith('.tif')])
        print(f"  - {step}: {file_count} files")
    except:
        print(f"  - {step}: 0 files")
print("="*70)
