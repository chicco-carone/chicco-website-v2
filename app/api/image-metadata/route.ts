import { NextRequest, NextResponse } from 'next/server';
import exifr from 'exifr';
import fs from 'fs';
import path from 'path';

// In-memory cache for metadata
const metadataCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

interface CacheEntry {
  data: Record<string, string>;
  timestamp: number;
}

// Periodic cache cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of metadataCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      metadataCache.delete(key);
    }
  }
}, 1000 * 60 * 5); // Clean up every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Check cache first
    const cachedEntry = metadataCache.get(imagePath);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cachedEntry.data);
    }

    // Ensure the path is within the public directory for security
    const fullPath = path.join(process.cwd(), 'public', imagePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Read file and extract EXIF data
    const fileBuffer = fs.readFileSync(fullPath);
    const exifData = await exifr.parse(fileBuffer, {
      pick: [
        'Make', 'Model', 'Lens', 'LensModel', 'FocalLength', 'FNumber',
        'ExposureTime', 'ISOSpeedRatings', 'DateTimeOriginal', 'GPSLatitude',
        'GPSLongitude', 'GPSAltitude', 'ImageWidth', 'ImageHeight'
      ]
    });

    // Format the metadata for display
    const metadata: Record<string, string> = {
      camera: exifData?.Make && exifData?.Model ? `${exifData.Make} ${exifData.Model}` : 'Unknown Camera',
      lens: exifData?.LensModel || exifData?.Lens || 'Unknown Lens',
      aperture: exifData?.FNumber ? `f/${exifData.FNumber}` : 'Unknown',
      shutterSpeed: exifData?.ExposureTime ? `1/${Math.round(1 / exifData.ExposureTime)}` : 'Unknown',
      iso: exifData?.ISOSpeedRatings?.toString() || 'Unknown',
      focalLength: exifData?.FocalLength ? `${exifData.FocalLength}mm` : 'Unknown',
      dateTaken: exifData?.DateTimeOriginal ?
        new Date(exifData.DateTimeOriginal).toLocaleDateString() : 'Unknown',
      location: (exifData?.GPSLatitude && exifData?.GPSLongitude) ?
        `${exifData.GPSLatitude.toFixed(4)}, ${exifData.GPSLongitude.toFixed(4)}` : 'Unknown Location',
      dimensions: exifData?.ImageWidth && exifData?.ImageHeight ?
        `${exifData.ImageWidth} × ${exifData.ImageHeight}` : 'Unknown'
    };

    // Cache the result
    metadataCache.set(imagePath, {
      data: metadata,
      timestamp: Date.now()
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error extracting image metadata:', error);
    return NextResponse.json(
      { error: 'Failed to extract image metadata' },
      { status: 500 }
    );
  }
}
