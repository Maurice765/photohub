import os
import sys
import requests
import random
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime
from test_photo_data import photo_test_data
from PIL import Image
from PIL.ExifTags import TAGS

# Configuration
API_BASE_URL = "http://localhost:8000"
UPLOAD_ENDPOINT = f"{API_BASE_URL}/photo/upload"
PHOTOS_PATH = "photos"

# Random country codes for location (ISO 3166-1 alpha-2)
COUNTRIES = [
    "DE", "AT", "CH", "FR", "IT",
    "ES", "PT", "NL", "BE", "DK",
    "SE", "NO", "FI", "PL", "CZ",
    "HU", "HR", "SI", "GR", "TR"
]

CATEGORIES = {
    "Nature": 1,
    "Music": 2,
    "Food and Drink": 3,
    "Vehicles": 4,
    "Art": 5,
    "Sports": 6,
    "Architecture": 7,
    "Plants": 8,
    "Landscape": 9,
    "Animals": 10,
    "Pets": 11,
    "Wild Animals": 12,
    "Birds": 13,
    "Insects": 14,
    "Concert": 15,
    "Theater": 16,
    "Cars": 17,
    "Trains": 18,
    "Aircraft": 19,
    "Bicycles": 20,
    "Boats": 21,
    "Interior": 22,
    "Buildings": 23,
    "Religious Buildings": 24,
    "House": 25,
    "Bridges": 26,
    "Towers": 27,
}

def extract_exif_data(image_path: Path) -> Dict[str, Any]:
    """Extract EXIF data from image file."""
    
    try:
        with Image.open(image_path) as image:
            exif_data = image.getexif()
            if not exif_data:
                return {}
            
            extracted = {}
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                extracted[tag] = value
            
            return extracted
    except Exception as e:
        print(f"Error extracting EXIF from {image_path}: {e}")
        return {}

def get_camera_model(exif_data: Dict[str, Any]) -> Optional[str]:
    """Extract camera model from EXIF data."""
    # Try different possible keys for camera model
    for key in ['Model', 'Camera Model Name', 'Make']:
        if key in exif_data:
            return str(exif_data[key]).strip()
    return None

def get_capture_date(exif_data: Dict[str, Any]) -> Optional[datetime]:
    """Extract capture date from EXIF data."""
    # Try different possible keys for date
    for key in ['DateTime', 'DateTimeOriginal', 'DateTimeDigitized']:
        if key in exif_data:
            try:
                # EXIF date format is usually "YYYY:MM:DD HH:MM:SS"
                date_str = str(exif_data[key])
                return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
            except (ValueError, TypeError):
                continue
    return None

def get_mime_type(file_path: Path) -> str:
    """Get MIME type based on file extension."""
    extension = file_path.suffix.lower()
    mime_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif'
    }
    return mime_types.get(extension, 'image/jpeg')

def find_all_photos(photos_dir: Path) -> list[Path]:
    """Find all photo files in the photos directory."""
    photo_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
    photos = []
    
    for root, dirs, files in os.walk(photos_dir):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in photo_extensions:
                photos.append(file_path)
    
    return sorted(photos)

def get_category_id_from_folder(photo_path: Path) -> Optional[int]:
    """Get category ID based on the folder name containing the photo."""
    # Get the parent folder name
    folder_name = photo_path.parent.name
    
    # Look up the category ID in the CATEGORIES dictionary
    # Try exact match first
    if folder_name in CATEGORIES:
        return CATEGORIES[folder_name]
    
    # Try case-insensitive match
    for category_name, category_id in CATEGORIES.items():
        if category_name.lower() == folder_name.lower():
            return category_id
    
    # If no match found, return None
    print(f"⚠️  No category found for folder '{folder_name}', uploading without category")
    return None

def upload_photo(photo_path: Path, title: str, description: str,
                location: str, capture_date: Optional[datetime],
                camera_model: Optional[str], category_id: Optional[int] = None) -> bool:
    """Upload a single photo to the API."""
    try:
        # Prepare form data
        form_data = {
            'title': title,
            'description': description,
            'visibility': 'public',
            'location': location,
        }
        
        # Add optional fields if available
        if capture_date:
            form_data['capture_date'] = capture_date.isoformat()
        if camera_model:
            form_data['camera_model'] = camera_model
        if category_id:
            form_data['category_id'] = str(category_id)
        
        # Prepare file
        mime_type = get_mime_type(photo_path)
        with open(photo_path, 'rb') as f:
            files = {
                'file': (photo_path.name, f, mime_type)
            }
            
            # Make the request
            response = requests.post(UPLOAD_ENDPOINT, data=form_data, files=files)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Uploaded: {photo_path.name} -> Photo ID: {result.get('photo_id')}")
                return True
            else:
                print(f"❌ Failed to upload {photo_path.name}: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Error uploading {photo_path.name}: {e}")
        return False

def main():
    """Main function to bulk upload photos."""
    photos_dir = Path(PHOTOS_PATH)

    if not photos_dir.exists():
        print(f"❌ Photos directory '{photos_dir}' not found!")
        sys.exit(1)
    
    # Find all photos
    print("🔍 Scanning for photos...")
    photos = find_all_photos(photos_dir)
    
    if not photos:
        print("❌ No photos found in the photos directory!")
        sys.exit(1)
    
    print(f"📸 Found {len(photos)} photos to upload")
    
    # Check if API is accessible
    try:
        response = requests.get(f"{API_BASE_URL}/docs")
        if response.status_code != 200:
            print(f"❌ API not accessible at {API_BASE_URL}. Please make sure the backend is running.")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print(f"❌ Cannot connect to API at {API_BASE_URL}. Please make sure the backend is running.")
        sys.exit(1)
    
    print("🚀 Starting bulk upload...")
    
    successful_uploads = 0
    failed_uploads = 0
    
    for i, photo_path in enumerate(photos):
        print(f"\n📤 Processing {i+1}/{len(photos)}: {photo_path}")
        
        test_data_index = i % len(photo_test_data)
        test_entry = photo_test_data[test_data_index]
        
        title = test_entry['title']
        description = test_entry['description']
        location = random.choice(COUNTRIES)
        
        # Extract metadata from photo
        exif_data = extract_exif_data(photo_path)
        camera_model = get_camera_model(exif_data)
        capture_date = get_capture_date(exif_data)
        
        # Get category ID from folder name
        category_id = get_category_id_from_folder(photo_path)
        
        print(f"   Title: {title}")
        print(f"   Location: {location}")
        if category_id:
            # Find category name for display
            category_name = next((name for name, id in CATEGORIES.items() if id == category_id), "Unknown")
            print(f"   Category: {category_name} (ID: {category_id})")
        if camera_model:
            print(f"   Camera: {camera_model}")
        if capture_date:
            print(f"   Captured: {capture_date}")
        
        # Upload the photo
        if upload_photo(photo_path, title, description, location, capture_date, camera_model, category_id):
            successful_uploads += 1
        else:
            failed_uploads += 1
    
    # Summary
    print(f"\n📊 Upload Summary:")
    print(f"   ✅ Successful: {successful_uploads}")
    print(f"   ❌ Failed: {failed_uploads}")
    print(f"   📸 Total: {len(photos)}")
    
    if failed_uploads > 0:
        print(f"\n⚠️  Some uploads failed. Check the error messages above.")
        sys.exit(1)
    else:
        print(f"\n🎉 All photos uploaded successfully!")

if __name__ == "__main__":
    main()