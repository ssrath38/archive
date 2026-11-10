#!/usr/bin/env python3
"""
Temperature Analysis and Stress Calculation Script
Processes NASA POWER temperature data to create:
1. 8-day average temperature rasters (MODIS Julian dates)
2. Temperature stress rasters using provided formula

Requirements:
    pip install pandas numpy scipy rasterio

Author: Generated for climate data analysis
Date: 2024
"""

import pandas as pd
import numpy as np
from datetime import datetime
from scipy.interpolate import Rbf
import rasterio
from rasterio.transform import from_origin
import os

# ============================================================================
# CONFIGURATION
# ============================================================================

# Temperature stress parameters
T_MIN = 14  # Minimum temperature (°C)
T_MAX = 40  # Maximum temperature (°C)
T_OPT = 30  # Optimal temperature (°C)

# Interpolation parameters
RESOLUTION = 0.004505  # Output raster resolution in degrees (0.01 ≈ 1km)
IDW_POWER = 2      # Inverse Distance Weighting power parameter
BUFFER = 0.1       # Buffer around data extent in degrees

# Input/Output
INPUT_FILE = r'Z:\Work\rice_yield\temp_stress\POWER_Regional_Daily_20240601_20241231.csv'
OUTPUT_DIR_TEMP = r'Z:\Work\rice_yield\temp_stress\temperature_rasters'
OUTPUT_DIR_STRESS = r'Z:\Work\rice_yield\temp_stress\temperature_stress_rasters'

# ============================================================================
# STEP 1: Load and Prepare Data
# ============================================================================

print("="*80)
print("TEMPERATURE ANALYSIS AND STRESS CALCULATION")
print("="*80)
print(f"\nLoading data from: {INPUT_FILE}")

# Load the CSV file (skip header rows)
df = pd.read_csv(INPUT_FILE, skiprows=9)

# Create datetime column
df['date'] = pd.to_datetime(df[['YEAR', 'MO', 'DY']].rename(
    columns={'YEAR': 'year', 'MO': 'month', 'DY': 'day'}))

# Calculate Julian day
df['julian_day'] = df['date'].dt.dayofyear

print(f"✓ Data loaded: {len(df)} records")
print(f"  Date range: {df['date'].min()} to {df['date'].max()}")
print(f"  Julian day range: {df['julian_day'].min()} to {df['julian_day'].max()}")
print(f"  Unique locations: {df[['LAT', 'LON']].drop_duplicates().shape[0]}")
print(f"  Temperature range: {df['T2M'].min():.2f}°C to {df['T2M'].max():.2f}°C")

# ============================================================================
# STEP 2: Generate MODIS 8-day Julian Date Periods
# ============================================================================

def get_modis_periods(start_julian, end_julian):
    """
    Generate MODIS 8-day period start days.
    MODIS composites start from day 1 of the year in 8-day intervals.
    """
    periods = []
    day = 1
    while day <= end_julian:
        if day >= start_julian - 7:  # Include periods overlapping with data range
            periods.append(day)
        day += 8
    return periods

min_julian = df['julian_day'].min()
max_julian = df['julian_day'].max()

modis_periods = get_modis_periods(min_julian, max_julian)

print(f"\n{'='*80}")
print("MODIS 8-DAY PERIODS")
print(f"{'='*80}")
print(f"Number of periods: {len(modis_periods)}")
print(f"Period start days: {modis_periods}")

# ============================================================================
# STEP 3: Calculate 8-day Averages for Each MODIS Period
# ============================================================================

def calculate_8day_average(df, period_start):
    """
    Calculate 8-day average temperature for a given MODIS period.

    Parameters:
        df: DataFrame with temperature data
        period_start: Julian day for period start (inclusive)

    Returns:
        DataFrame with averaged temperatures by location
    """
    period_end = period_start + 7
    mask = (df['julian_day'] >= period_start) & (df['julian_day'] <= period_end)
    period_data = df[mask].copy()

    if len(period_data) == 0:
        return None

    # Group by location and calculate mean temperature
    avg_data = period_data.groupby(['LAT', 'LON']).agg({
        'T2M': 'mean'
    }).reset_index()

    avg_data['julian_period'] = period_start
    avg_data['num_days'] = period_data.groupby(['LAT', 'LON']).size().values

    return avg_data

print(f"\n{'='*80}")
print("CALCULATING 8-DAY AVERAGES")
print(f"{'='*80}")

period_averages = []
for period_start in modis_periods:
    avg_data = calculate_8day_average(df, period_start)
    if avg_data is not None and len(avg_data) > 0:
        period_averages.append(avg_data)
        print(f"Period {period_start:03d} (days {period_start:03d}-{period_start+7:03d}): "
              f"{len(avg_data)} locations, "
              f"T avg: {avg_data['T2M'].mean():.2f}°C")

print(f"\n✓ Calculated averages for {len(period_averages)} periods")

# ============================================================================
# STEP 4: IDW Interpolation Functions
# ============================================================================

def create_idw_raster(lats, lons, values, resolution=RESOLUTION, power=IDW_POWER):
    """
    Create raster using Inverse Distance Weighting (IDW) interpolation.

    Parameters:
        lats, lons, values: Input point data (numpy arrays)
        resolution: Output raster resolution in degrees
        power: IDW power parameter (higher = more weight to nearby points)

    Returns:
        interpolated: 2D array of interpolated values
        grid_lats: 1D array of latitude values
        grid_lons: 1D array of longitude values
    """
    # Define grid bounds with buffer
    lat_min = lats.min() - BUFFER
    lat_max = lats.max() + BUFFER
    lon_min = lons.min() - BUFFER
    lon_max = lons.max() + BUFFER

    # Create grid (lats descending for standard raster orientation)
    grid_lons = np.arange(lon_min, lon_max, resolution)
    grid_lats = np.arange(lat_max, lat_min, -resolution)

    grid_lon, grid_lat = np.meshgrid(grid_lons, grid_lats)

    # IDW interpolation
    interpolated = np.zeros(grid_lon.shape)
    weights_sum = np.zeros(grid_lon.shape)

    for lat, lon, val in zip(lats, lons, values):
        # Calculate distance from each grid point to this data point
        dist = np.sqrt((grid_lat - lat)**2 + (grid_lon - lon)**2)
        # Avoid division by zero
        dist = np.where(dist == 0, 1e-10, dist)
        # Calculate weight
        weight = 1.0 / (dist ** power)

        interpolated += weight * val
        weights_sum += weight

    # Normalize by sum of weights
    interpolated = interpolated / weights_sum

    return interpolated, grid_lats, grid_lons

# ============================================================================
# STEP 5: Calculate Temperature Stress
# ============================================================================

def calculate_temperature_stress(T_avg, T_min=T_MIN, T_max=T_MAX, T_opt=T_OPT):
    """
    Calculate temperature stress using the formula:
    T_stress = [(T-Tmin)(T-Tmax)] / [(T-Tmin)(T-Tmax) - (T-Topt)²]

    Where:
        T = average temperature
        Tmin = minimum temperature threshold (14°C)
        Tmax = maximum temperature threshold (40°C)
        Topt = optimal temperature (30°C)

    Parameters:
        T_avg: 2D array of average temperatures
        T_min, T_max, T_opt: Temperature thresholds

    Returns:
        T_stress: 2D array of temperature stress values
    """
    T = T_avg

    numerator = (T - T_min) * (T - T_max)
    denominator = (T - T_min) * (T - T_max) - (T - T_opt)**2

    # Avoid division by zero
    denominator = np.where(np.abs(denominator) < 1e-10, np.nan, denominator)

    T_stress = numerator / denominator

    return T_stress

# ============================================================================
# STEP 6: Save Rasters as GeoTIFF
# ============================================================================

def save_geotiff(data, lats, lons, filename, nodata_value=-9999):
    """
    Save raster data as GeoTIFF file.

    Parameters:
        data: 2D numpy array of raster values
        lats: 1D array of latitude values (descending)
        lons: 1D array of longitude values (ascending)
        filename: Output file path
        nodata_value: Value representing no-data pixels
    """
    # Replace NaN with nodata value
    data_out = np.where(np.isnan(data), nodata_value, data)

    # Get resolution
    lat_res = abs(lats[1] - lats[0])
    lon_res = abs(lons[1] - lons[0])

    # Create affine transform (top-left corner)
    transform = from_origin(lons[0], lats[0], lon_res, lat_res)

    # Write GeoTIFF
    with rasterio.open(
        filename,
        'w',
        driver='GTiff',
        height=data_out.shape[0],
        width=data_out.shape[1],
        count=1,
        dtype=rasterio.float32,
        crs='EPSG:4326',  # WGS84 coordinate system
        transform=transform,
        nodata=nodata_value,
        compress='lzw'  # Compression for smaller file size
    ) as dst:
        dst.write(data_out.astype(rasterio.float32), 1)

        # Add metadata
        dst.update_tags(
            creation_date=datetime.now().strftime('%Y-%m-%d'),
            description=f'Generated from NASA POWER temperature data'
        )

# ============================================================================
# STEP 7: Process All Periods
# ============================================================================

# Create output directories
os.makedirs(OUTPUT_DIR_TEMP, exist_ok=True)
os.makedirs(OUTPUT_DIR_STRESS, exist_ok=True)

print(f"\n{'='*80}")
print("GENERATING RASTERS")
print(f"{'='*80}")
print(f"Resolution: {RESOLUTION}° ({RESOLUTION * 111:.2f} km)")
print(f"IDW power: {IDW_POWER}")
print(f"Temperature stress parameters: Tmin={T_MIN}°C, Tmax={T_MAX}°C, Topt={T_OPT}°C")
print()

for i, period_data in enumerate(period_averages, 1):
    julian_period = period_data['julian_period'].iloc[0]

    print(f"[{i}/{len(period_averages)}] Processing Julian period {julian_period:03d} "
          f"(days {julian_period:03d}-{julian_period+7:03d})...")

    # Extract coordinates and values
    lats = period_data['LAT'].values
    lons = period_data['LON'].values
    temps = period_data['T2M'].values

    # Create temperature raster using IDW
    temp_raster, grid_lats, grid_lons = create_idw_raster(lats, lons, temps)

    # Save temperature raster
    temp_filename = os.path.join(OUTPUT_DIR_TEMP, f'temp_julian_{julian_period:03d}.tif')
    save_geotiff(temp_raster, grid_lats, grid_lons, temp_filename)

    # Calculate temperature stress
    stress_raster = calculate_temperature_stress(temp_raster)

    # Save temperature stress raster
    stress_filename = os.path.join(OUTPUT_DIR_STRESS, f'stress_julian_{julian_period:03d}.tif')
    save_geotiff(stress_raster, grid_lats, grid_lons, stress_filename)

    print(f"  ✓ Temperature: {np.nanmin(temp_raster):.2f}°C to {np.nanmax(temp_raster):.2f}°C "
          f"(shape: {temp_raster.shape})")
    print(f"  ✓ Stress: {np.nanmin(stress_raster):.3f} to {np.nanmax(stress_raster):.3f}")

# ============================================================================
# STEP 8: Summary Report
# ============================================================================

print(f"\n{'='*80}")
print("PROCESSING COMPLETE")
print(f"{'='*80}")

temp_files = sorted([f for f in os.listdir(OUTPUT_DIR_TEMP) if f.endswith('.tif')])
stress_files = sorted([f for f in os.listdir(OUTPUT_DIR_STRESS) if f.endswith('.tif')])

print(f"\n✓ Generated {len(temp_files)} temperature rasters in '{OUTPUT_DIR_TEMP}/'")
print(f"✓ Generated {len(stress_files)} temperature stress rasters in '{OUTPUT_DIR_STRESS}/'")

print(f"\n{'='*80}")
print("FILE LIST")
print(f"{'='*80}")

print(f"\nTemperature Rasters:")
for f in temp_files:
    print(f"  - {f}")

print(f"\nTemperature Stress Rasters:")
for f in stress_files:
    print(f"  - {f}")

print(f"\n{'='*80}")
print("DONE!")
print(f"{'='*80}")
