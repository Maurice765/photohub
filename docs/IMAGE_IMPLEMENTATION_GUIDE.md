# Image Fetching Implementation Guide

## Overview

This guide provides technical details for developers working with the image fetching system in PhotoHub, including code examples and implementation patterns.

## Backend Implementation Details

### 1. Image Storage Implementation

The image storage process in `backend/src/photo/service.py`:

```python
def process_and_store_photo(user_id: int, title: str, description: Optional[str], file: UploadFile) -> schemas.PhotoResponse:
    """
    Key implementation details:
    - Reads entire file into memory (limitation for large files)
    - Uses Oracle BLOB storage
    - Processes image for color histogram
    - Transactional - rollback on errors
    """
    file_content = file.file.read()  # Memory constraint consideration
    file_type = file.content_type
    file_size = len(file_content)

    conn = get_connection()
    cur = conn.cursor()

    try:
        # Step 1: Insert into CONTENT table
        content_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO CONTENT (user_id, title, description, content_type) 
            VALUES (:user_id, :title, :description, 'PHOTO') 
            RETURNING id INTO :content_id
        """, {
            "user_id": user_id, "title": title, "description": description, 
            "content_id": content_id_var
        })
        content_id = content_id_var.getvalue()[0]

        # Step 2: Store BLOB data
        photo_id_var = cur.var(int)
        cur.execute("""
            INSERT INTO PHOTO (content_id, image, file_type, file_size) 
            VALUES (:cid, :blob, :ftype, :fsize) 
            RETURNING id INTO :photo_id
        """, {
            "cid": content_id, 
            "blob": file_content,  # BLOB storage
            "ftype": file_type, 
            "fsize": file_size, 
            "photo_id": photo_id_var
        })
        photo_id = photo_id_var.getvalue()[0]

        # Step 3: Process for histogram (OpenCV)
        nparr = np.frombuffer(file_content, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise exceptions.InvalidImageFormat()

        # ... histogram processing code ...

        conn.commit()
        return schemas.PhotoResponse(content_id=content_id, photo_id=photo_id, filename=file.filename)
    
    except Exception as e:
        conn.rollback()
        raise exceptions.PhotoUploadError(str(e))
    finally:
        cur.close()
        conn.close()
```

### 2. Image Retrieval Implementation

The image retrieval process in `backend/src/photo/service.py`:

```python
def get_photo_image(photo_id: int) -> schemas.ImageStreamResponse:
    """
    Key implementation details:
    - Direct database BLOB access
    - Streaming response for efficiency
    - Proper content-type handling
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT image, file_type FROM PHOTO WHERE id = :id", {"id": photo_id})
        result = cur.fetchone()
        if result is None:
            raise exceptions.PhotoNotFound()
        
        image_blob, file_type = result
        data = image_blob.read()  # Read BLOB data
        media_type = file_type if file_type else "application/octet-stream"
        
        return schemas.ImageStreamResponse(content=data, media_type=media_type)
    finally:
        cur.close()
        conn.close()
```

### 3. Custom Streaming Response

The `ImageStreamResponse` class in `backend/src/photo/schemas.py`:

```python
class ImageStreamResponse(StreamingResponse):
    def __init__(self, content: bytes, media_type: str):
        super().__init__(content=io.BytesIO(content), media_type=media_type)
```

This provides:
- Efficient streaming of binary data
- Proper MIME type handling
- Integration with FastAPI response system

## Frontend Implementation Details

### 1. Service Layer Implementation

The `PhotoSearchService` in `frontend/src/app/features/photo-search/services/photo-search.service.ts`:

```typescript
@Injectable({
    providedIn: 'root'
})
export class PhotoSearchService {
    private photoClient = inject(PhotoClient);

    searchPhotos(rgbVector: RGBVectorViewModel, limit?: number): Observable<PhotoSearchResultItemViewModel[]> {
        const rgbVectorClientModel = rgbVector.toClientModel();

        return this.photoClient.searchByColor(rgbVectorClientModel, limit).pipe(
            map((response: PhotoSearchResponseClientModel) => {
                return response.results.map((item: PhotoSearchResultItemClientModel) => {
                    const viewModel = new PhotoSearchResultItemViewModel(item);
                    // Key URL construction logic
                    viewModel.imageUrl = environment.apiUrl + item.image_url;
                    return viewModel;
                })
            })
        );
    }
}
```

### 2. Client Layer Implementation

The `PhotoClient` in `frontend/src/app/core/clients/photo.client.ts`:

```typescript
@Injectable({
    providedIn: 'root'
})
export class PhotoClient {
    private apiService = inject(PhotoApiService);
    
    public searchByColor(rgbVector: RGBVectorClientModel, limit?: number): Observable<PhotoSearchResponseClientModel> {
        return this.apiService.searchByColor(rgbVector, limit).pipe(
            map((response: PhotoSearchResponse) => {
                return response as PhotoSearchResponseClientModel;
            })
        );
    }
}
```

### 3. Auto-Generated API Client

The generated `PhotoApiService` handles the HTTP communication:

```typescript
public getPhotoImage(photoId: number, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    // Validation
    if (photoId === null || photoId === undefined) {
        throw new Error('Required parameter photoId was null or undefined when calling getPhotoImage.');
    }

    // URL construction
    let localVarPath = `/photo/image/${this.configuration.encodeParam({
        name: "photoId", 
        value: photoId, 
        in: "path", 
        style: "simple", 
        explode: false, 
        dataType: "number", 
        dataFormat: undefined
    })}`;

    // HTTP request
    return this.httpClient.request<any>('get', `${basePath}${localVarPath}`, {
        context: localVarHttpContext,
        responseType: <any>responseType_,
        headers: localVarHeaders,
        observe: observe,
        transferCache: localVarTransferCache,
        reportProgress: reportProgress
    });
}
```

## Key Implementation Patterns

### 1. Error Handling Pattern

**Backend Exception Handling**:
```python
# Custom exceptions in backend/src/photo/exceptions.py
class PhotoNotFound(Exception):
    pass

class InvalidImageFormat(Exception):
    pass

class PhotoUploadError(Exception):
    pass

# Usage in service layer
try:
    # Database operations
    pass
except Exception as e:
    conn.rollback()
    raise exceptions.PhotoUploadError(str(e))
finally:
    cur.close()
    conn.close()
```

**Frontend Error Handling**:
```typescript
// Automatic HTTP error handling via Angular HTTP client
// Observable error streams for reactive programming
this.photoClient.searchByColor(rgbVector, limit).pipe(
    map(response => /* success transformation */),
    catchError(error => /* error handling */)
);
```

### 2. Data Transformation Pattern

**Multi-Layer Data Models**:
```typescript
// API Response -> Client Model -> View Model pattern

// 1. API Response (auto-generated)
interface PhotoSearchResponse {
    results: PhotoSearchResultItem[];
}

// 2. Client Model (business logic layer)
class PhotoSearchResponseClientModel {
    results: PhotoSearchResultItemClientModel[];
}

// 3. View Model (presentation layer)
class PhotoSearchResultItemViewModel {
    imageUrl: string; // Fully constructed URL
    // ... other presentation-specific properties
}
```

### 3. URL Construction Pattern

```typescript
// Environment-based configuration
// environment.ts
export const environment = {
    apiUrl: 'http://localhost:8000'
};

// Service layer URL construction
searchPhotos(rgbVector: RGBVectorViewModel, limit?: number): Observable<PhotoSearchResultItemViewModel[]> {
    return this.photoClient.searchByColor(rgbVectorClientModel, limit).pipe(
        map((response: PhotoSearchResponseClientModel) => {
            return response.results.map((item: PhotoSearchResultItemClientModel) => {
                const viewModel = new PhotoSearchResultItemViewModel(item);
                // Construct complete URL
                viewModel.imageUrl = environment.apiUrl + item.image_url;
                return viewModel;
            })
        })
    );
}
```

## Performance Considerations

### 1. Memory Usage in Backend

**Current Implementation**:
```python
file_content = file.file.read()  # Loads entire file into memory
```

**Considerations**:
- Large files (>100MB) can cause memory issues
- Multiple concurrent uploads can exhaust server memory
- Consider streaming processing for large files

**Potential Improvement**:
```python
# Stream processing for large files
async def process_large_file(file: UploadFile):
    chunk_size = 8192
    hasher = hashlib.md5()
    
    while chunk := await file.read(chunk_size):
        hasher.update(chunk)
        # Process chunk without loading entire file
```

### 2. Database Connection Management

**Current Pattern**:
```python
def get_photo_image(photo_id: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        # ... operations ...
    finally:
        cur.close()
        conn.close()  # Connection closed per request
```

**Considerations**:
- New connection per request
- No connection pooling visible
- Potential bottleneck under high load

### 3. Frontend Image Loading

**Current Implementation**:
```html
<img [src]="photo.imageUrl" alt="Photo" />
```

**Considerations**:
- Eager loading of all images
- No lazy loading implementation
- No progressive image loading

**Potential Improvements**:
```html
<!-- Lazy loading -->
<img [src]="photo.imageUrl" loading="lazy" alt="Photo" />

<!-- Progressive loading with thumbnails -->
<img [src]="photo.thumbnailUrl" 
     [attr.data-full-src]="photo.imageUrl"
     (load)="onThumbnailLoad($event)" />
```

## Security Implementation Notes

### Current Security State

1. **No Authentication on Image Endpoints**:
   ```python
   @router.get("/image/{photo_id}")
   async def get_photo_image(photo_id: int):
       # No authentication check
       return service.get_photo_image(photo_id)
   ```

2. **Public Access to All Images**:
   - Any photo_id can be accessed directly
   - No ownership validation

### Recommended Security Enhancements

1. **Add Authentication Dependency**:
   ```python
   @router.get("/image/{photo_id}")
   async def get_photo_image(
       photo_id: int,
       current_user: User = Depends(get_current_user)  # Add auth
   ):
       # Validate user can access this photo
       if not can_access_photo(current_user, photo_id):
           raise HTTPException(status_code=403, detail="Access denied")
       return service.get_photo_image(photo_id)
   ```

2. **Input Validation**:
   ```python
   # Enhanced file validation
   def validate_photo_upload(file: UploadFile = File(...)):
       # Check file size
       if file.size > MAX_FILE_SIZE:
           raise HTTPException(status_code=413, detail="File too large")
       
       # Check file type
       if file.content_type not in ALLOWED_TYPES:
           raise HTTPException(status_code=400, detail="Invalid file type")
       
       # Additional security checks (malware scanning, etc.)
       return file
   ```

## Testing Implementation

### Backend Testing Patterns

```python
# Unit test for image service
def test_process_and_store_photo():
    # Mock file upload
    mock_file = Mock(spec=UploadFile)
    mock_file.file.read.return_value = b"fake_image_data"
    mock_file.content_type = "image/jpeg"
    mock_file.filename = "test.jpg"
    
    # Test service method
    result = process_and_store_photo(user_id=1, title="Test", description=None, file=mock_file)
    
    assert result.photo_id is not None
    assert result.filename == "test.jpg"

# Integration test for image retrieval
def test_get_photo_image_endpoint():
    # Upload test image first
    photo_id = upload_test_image()
    
    # Test retrieval
    response = client.get(f"/photo/image/{photo_id}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"
```

### Frontend Testing Patterns

```typescript
// Service unit test
describe('PhotoSearchService', () => {
    it('should construct correct image URLs', () => {
        const mockResponse = {
            results: [{
                photo_id: 1,
                distance: 0.5,
                image_url: '/photo/image/1'
            }]
        };
        
        photoClient.searchByColor.and.returnValue(of(mockResponse));
        
        service.searchPhotos(mockRgbVector).subscribe(results => {
            expect(results[0].imageUrl).toBe('http://localhost:8000/photo/image/1');
        });
    });
});

// Component integration test
describe('PhotoSearchComponent', () => {
    it('should display images with correct URLs', async () => {
        const mockPhotos = createMockPhotos();
        photoSearchService.searchPhotos.and.returnValue(of(mockPhotos));
        
        component.search();
        fixture.detectChanges();
        
        const imgElements = fixture.debugElement.queryAll(By.css('img'));
        expect(imgElements[0].nativeElement.src).toContain('/photo/image/');
    });
});
```

## Deployment Considerations

### Environment Configuration

```typescript
// environment.prod.ts
export const environment = {
    production: true,
    apiUrl: 'https://api.photohub.com'  // Production API URL
};

// environment.dev.ts
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8000'  // Development API URL
};
```

### Database Configuration

```python
# backend/.env
ORACLE_USER=photohub_user
ORACLE_PASSWORD=secure_password
ORACLE_DSN=production_db_connection_string

# Connection pooling configuration
ORACLE_POOL_MIN=5
ORACLE_POOL_MAX=20
ORACLE_POOL_INCREMENT=5
```

### Performance Monitoring

```python
# Add metrics collection
import time
from prometheus_client import Counter, Histogram

IMAGE_REQUESTS = Counter('image_requests_total', 'Total image requests')
IMAGE_REQUEST_DURATION = Histogram('image_request_duration_seconds', 'Image request duration')

@router.get("/image/{photo_id}")
async def get_photo_image(photo_id: int):
    start_time = time.time()
    IMAGE_REQUESTS.inc()
    
    try:
        result = service.get_photo_image(photo_id)
        return result
    finally:
        IMAGE_REQUEST_DURATION.observe(time.time() - start_time)
```

This implementation guide provides the technical foundation for understanding and extending the image fetching system in PhotoHub.