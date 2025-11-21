import numpy as np
import rasterio
from rasterio.merge import merge
from rasterio.warp import calculate_default_transform, reproject, Resampling
from rasterio.mask import mask
import geopandas as gpd
from pathlib import Path
import glob
from datetime import datetime, timedelta

# Step 1: Setup paths
raw_data_dir = "INSAT3DR_RAW"  # Your downloaded HDF/TIFF files
output_dir = "INSAT_PAR_COMPOSITE"
Path(output_dir).mkdir(exist_ok=True)

# Step 2: Function to convert INSOLATION to PAR (multiply by 0.5)
def insolation_to_par(input_tif, output_tif):
    """
    Convert INSOLATION data to PAR by multiplying by 0.5
    """
    with rasterio.open(input_tif) as src:
        # Read the data
        insolation = src.read(1)
        profile = src.profile.copy()
        # Convert to PAR
        par = insolation * 0.5
        # Write output
        with rasterio.open(output_tif, 'w', **profile) as dst:
            dst.write(par, 1)
    return output_tif

# Step 3: Create 8-day composite using Cell Statistics (MEAN)
def create_8day_composite(input_files, output_file, statistic='mean'):
    """
    Create 8-day composite from daily PAR files statistic: 'mean', 'max', 'min', 'sum', 'median'
    """
    data_stack = []

    with rasterio.open(input_files[0]) as src:
        profile = src.profile.copy()
        shape = src.shape

    for file in input_files:
        with rasterio.open(file) as src:
            data = src.read(1).astype(np.float32)
            # Handle NoData values
            data = np.ma.masked_where(data == src.nodata, data)
            data_stack.append(data)

    data_stack = np.ma.array(data_stack)
    if statistic == 'mean':
        composite = np.ma.mean(data_stack, axis=0)
    elif statistic == 'max':
        composite = np.ma.max(data_stack, axis=0)
    elif statistic == 'min':
        composite = np.ma.min(data_stack, axis=0)
    elif statistic == 'sum':
        composite = np.ma.sum(data_stack, axis=0)
    elif statistic == 'median':
        composite = np.ma.median(data_stack, axis=0)
    else:
        raise ValueError("Unknown statistic")

    composite = composite.filled(profile['nodata'])
    with rasterio.open(output_file, 'w', **profile) as dst:
        dst.write(composite.astype(profile['dtype']), 1)
    return output_file

# Step 4: Resample to 500m resolution
def resample_raster(input_tif, output_tif, target_resolution=500):
    """
    Resample raster to target resolution (e.g., 500m)
    """
    with rasterio.open(input_tif) as src:
        scale_factor = src.res[0] / target_resolution
        new_width = int(src.width * scale_factor)
        new_height = int(src.height * scale_factor)
        transform = src.transform * src.transform.scale(
            (src.width / new_width),
            (src.height / new_height)
        )
        profile = src.profile.copy()
        profile.update({
            'width': new_width,
            'height': new_height,
            'transform': transform
        })
        data = src.read(
            out_shape=(src.count, new_height, new_width),
            resampling=Resampling.nearest
        )
        with rasterio.open(output_tif, 'w', **profile) as dst:
            dst.write(data)
    return output_tif

# Step 5: Extract by mask (clip to study area)
def extract_by_mask(input_raster, mask_shapefile, output_raster):
    """
    Extract raster by mask (shapefile boundary)
    """
    gdf = gpd.read_file(mask_shapefile)
    with rasterio.open(input_raster) as src:
        if gdf.crs != src.crs:
            gdf = gdf.to_crs(src.crs)
        out_image, out_transform = mask(src, gdf.geometry, crop=True)
        out_meta = src.meta.copy()
        out_meta.update({
            "driver": "GTiff",
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform
        })
        with rasterio.open(output_raster, "w", **out_meta) as dst:
            dst.write(out_image)
    return output_raster

# Main processing pipeline
def process_insat3dr_composites(raw_dir, output_dir, shapefile_path, year=2024):
    """
    Complete pipeline for INSAT-3DR 8-day composite generation
    """
    julian_days = [153, 161, 169, 177, 185, 193, 201, 209, 217, 225, 233,
                   241, 249, 257, 265, 273, 281, 289, 297, 305, 313, 321,
                   329, 337, 345, 353, 361]

    all_files = sorted(glob.glob(f"{raw_dir}/*.tif"))

    print("Step 1: Converting INSOLATION to PAR...")
    par_dir = f"{output_dir}/PAR"
    Path(par_dir).mkdir(exist_ok=True)

    par_files = {}
    for tif_file in all_files:
        filename = Path(tif_file).stem
        splits = filename.split('_')
        if len(splits) < 2:
            print(f"Skipping {filename}: cannot find valid date.")
            continue
        date_str = splits[1]  # Format: '01AUG2024'
        try:
            date_obj = datetime.strptime(date_str, '%d%b%Y')
            julian_day = date_obj.timetuple().tm_yday
        except ValueError as e:
            print(f"Skipping {filename}: cannot parse date '{date_str}'. Error: {e}")
            continue
        output_par = f"{par_dir}/PAR_{date_str}.tif"
        insolation_to_par(tif_file, output_par)
        par_files[julian_day] = output_par
        print(f"  Converted {filename} to PAR")

    # Step 2: Create 8-day composites
    print("\nStep 2: Creating 8-day composites...")
    composite_dir = f"{output_dir}/COMPOSITE"
    Path(composite_dir).mkdir(exist_ok=True)

    for start_julian in julian_days:
        period_files = []
        for day in range(start_julian, start_julian + 8):
            if day in par_files:
                period_files.append(par_files[day])
        if len(period_files) > 0:
            composite_name = f"{year}{start_julian:03d}"
            output_composite = f"{composite_dir}/{composite_name}.tif"
            create_8day_composite(period_files, output_composite, statistic='mean')
            print(f"  Created composite for Julian day {start_julian}: {len(period_files)} files")
            resampled_file = f"{composite_dir}/{composite_name}_resampled.tif"
            resample_raster(output_composite, resampled_file, target_resolution=500)
            print(f"  Resampled to 500m resolution")
            final_output = f"{composite_dir}/{composite_name}_final.tif"
            extract_by_mask(resampled_file, shapefile_path, final_output)
            print(f"  Extracted to study area boundary")

    print("\nProcessing complete!")

# Run the pipeline
if __name__ == "__main__":
    # Set your paths
    raw_data_directory = r"Z:\Data\Raw_MOSDAC\INSAT3DR_01062024_31122024"
    output_directory = r"Z:\Work\rice_yield\mosdac\data\jujomura"
    study_area_shapefile = r'Z:\Data\Yes-Tech Locations SHP\Jujomura Block\Jujomura_Block.shp'

    process_insat3dr_composites(
        raw_dir=raw_data_directory,
        output_dir=output_directory,
        shapefile_path=study_area_shapefile,
        year=2024
    )
