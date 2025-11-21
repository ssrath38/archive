from osgeo import gdal
import os

def extract_band_to_tif(hdf_path, band_name, out_tif, epsg=4326):
    """
    Extracts a specific MODIS band from HDF, converts to GeoTIFF, and reprojects.
    """

    # Open HDF file
    hdf = gdal.Open(hdf_path)
    if hdf is None:
        raise Exception("Could not open HDF file.")

    # Get list of all subdatasets inside the MODIS file
    subdatasets = hdf.GetSubDatasets()

    # Find the subdataset that contains the band name
    sds_path = None
    for sds in subdatasets:
        if band_name in sds[0]:
            sds_path = sds[0]
            break

    if sds_path is None:
        raise Exception(f"Band {band_name} not found in HDF file.")

    print(f"Extracting {band_name} from: {sds_path}")

    # Step 1: Translate (HDF → temporary GeoTIFF)
    temp_tif = out_tif.replace(".tif", "_temp.tif")
    gdal.Translate(temp_tif, sds_path, format="GTiff")

    # Step 2: Reproject to EPSG 4326
    gdal.Warp(out_tif, temp_tif, dstSRS=f"EPSG:{epsg}", format="GTiff")

    # Clean temp file
    if os.path.exists(temp_tif):
        os.remove(temp_tif)

    print(f"Saved: {out_tif}")


# ---------------- RUN ---------------- #
hdf_file = "./MODIS/MOD09A1.A2024161.h26v06.061.2024175162156.hdf"  # ← your file name here

# Extract NIR band (sur_refl_b02)
extract_band_to_tif(
    hdf_path=hdf_file,
    band_name="sur_refl_b02",
    out_tif= "./MODIS/MOD09A1161_NIR_epsg4326.tif"
)

# Extract SWIR band (sur_refl_b06)
extract_band_to_tif(
    hdf_path=hdf_file,
    band_name="sur_refl_b06",
    out_tif="./MODIS/MOD09A1161_SWIR_epsg4326.tif"
)