# Image Fetching Flow - Sequence Diagrams

This document provides detailed sequence diagrams for the image fetching flow in PhotoHub.

## Image Upload Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as Angular Frontend
    participant Backend as FastAPI Backend
    participant DB as Oracle Database

    User->>Frontend: Upload Image File
    Frontend->>Backend: POST /photo/upload (multipart/form-data)
    
    Backend->>Backend: Validate File (dependencies.validate_photo_upload)
    Backend->>Backend: Read file content into memory
    Backend->>DB: INSERT INTO CONTENT (metadata)
    DB-->>Backend: Return content_id
    
    Backend->>DB: INSERT INTO PHOTO (BLOB data)
    DB-->>Backend: Return photo_id
    
    Backend->>Backend: Process image with OpenCV
    Backend->>Backend: Calculate color histograms
    Backend->>DB: INSERT INTO COLOR_HISTOGRAM
    
    Backend->>Backend: Commit transaction
    Backend-->>Frontend: PhotoResponse {content_id, photo_id, filename}
    Frontend-->>User: Upload Success
```

## Image Search and Display Flow

```mermaid
sequenceDiagram
    participant User
    participant Component as Angular Component
    participant SearchService as PhotoSearchService
    participant PhotoClient as PhotoClient
    participant Backend as FastAPI Backend
    participant DB as Oracle Database
    participant Browser

    User->>Component: Search by Color
    Component->>SearchService: searchPhotos(rgbVector)
    SearchService->>PhotoClient: searchByColor(rgbVectorClientModel)
    PhotoClient->>Backend: POST /photo/search-by-color
    
    Backend->>Backend: Create single color histogram
    Backend->>DB: Query COLOR_HISTOGRAM with euclidean_distance_rgb_hist
    DB-->>Backend: Return photo_ids with distances
    
    Backend->>Backend: Construct image URLs: "/photo/image/{photo_id}"
    Backend-->>PhotoClient: PhotoSearchResponse
    PhotoClient-->>SearchService: PhotoSearchResponseClientModel
    
    SearchService->>SearchService: Construct full URLs: environment.apiUrl + image_url
    SearchService-->>Component: PhotoSearchResultItemViewModel[]
    Component-->>User: Display search results with image URLs
    
    Note over Browser: For each image displayed:
    Browser->>Backend: GET /photo/image/{photo_id}
    Backend->>DB: SELECT image, file_type FROM PHOTO WHERE id = photo_id
    DB-->>Backend: Return BLOB data and file_type
    Backend->>Backend: Create StreamingResponse
    Backend-->>Browser: Stream image data with Content-Type
    Browser-->>User: Display image
```

## Image Retrieval Detail Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Router as FastAPI Router
    participant Service as Photo Service
    participant DB as Oracle Database

    Browser->>Router: GET /photo/image/{photo_id}
    Router->>Service: get_photo_image(photo_id)
    
    Service->>DB: SELECT image, file_type FROM PHOTO WHERE id = :id
    DB-->>Service: Return (image_blob, file_type) or None
    
    alt Photo Found
        Service->>Service: image_blob.read() - Read BLOB data
        Service->>Service: Determine media_type from file_type
        Service->>Service: Create ImageStreamResponse(content, media_type)
        Service-->>Router: StreamingResponse
        Router-->>Browser: HTTP Response with image data
    else Photo Not Found
        Service->>Service: Raise PhotoNotFound exception
        Service-->>Router: HTTP 404 Error
        Router-->>Browser: 404 Not Found
    end
```

## Error Handling Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Frontend as Angular Frontend
    participant Backend as FastAPI Backend
    participant DB as Oracle Database

    Browser->>Backend: GET /photo/image/999999 (non-existent ID)
    Backend->>DB: SELECT image, file_type FROM PHOTO WHERE id = 999999
    DB-->>Backend: Return None (no results)
    Backend->>Backend: Raise PhotoNotFound()
    Backend-->>Browser: HTTP 404 with error details
    Browser->>Browser: Display broken image icon
    Frontend->>Frontend: Log error (if implemented)
```

## Component Interaction Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Angular Component] --> B[PhotoSearchService]
        B --> C[PhotoClient]
        C --> D[PhotoApiService - Auto-generated]
    end
    
    subgraph "Backend Layer"
        E[FastAPI Router] --> F[Photo Service]
        F --> G[Database Connection]
    end
    
    subgraph "Data Layer"
        H[Oracle Database]
        I[CONTENT Table]
        J[PHOTO Table - BLOB Storage]
        K[COLOR_HISTOGRAM Table]
    end
    
    D --> E
    G --> H
    H --> I
    H --> J
    H --> K
    
    L[Browser IMG Element] --> E
```

## Data Transformation Flow

```mermaid
graph LR
    subgraph "Backend Data Models"
        A[PhotoSearchResultItem] --> B[image_url: '/photo/image/{id}']
    end
    
    subgraph "Client Layer"
        C[PhotoSearchResultItemClientModel] --> D[image_url: '/photo/image/{id}']
    end
    
    subgraph "View Layer"
        E[PhotoSearchResultItemViewModel] --> F[imageUrl: 'http://api.url/photo/image/{id}']
    end
    
    A --> C
    C --> E
    
    G[environment.apiUrl] --> E
```

## Caching Opportunities

```mermaid
graph TB
    A[Browser Request] --> B{Cache Check}
    B -->|Hit| C[Return Cached Image]
    B -->|Miss| D[Backend Database Query]
    D --> E[Stream Response]
    E --> F[Store in Cache]
    F --> G[Return to Browser]
    
    subgraph "Potential Cache Layers"
        H[Browser Cache - HTTP Headers]
        I[CDN Cache - Geographic Distribution]
        J[Application Cache - Redis/Memory]
        K[Database Query Cache]
    end
```

## Security Considerations Flow

```mermaid
sequenceDiagram
    participant User
    participant Auth as Authentication
    participant Backend as FastAPI Backend
    participant DB as Oracle Database

    Note over User,DB: Current State - No Authentication
    User->>Backend: GET /photo/image/{any_photo_id}
    Backend->>DB: Direct database access
    DB-->>Backend: Return any photo
    Backend-->>User: Image data

    Note over User,DB: Recommended Secure Flow
    User->>Auth: Authenticate
    Auth-->>User: JWT Token
    User->>Backend: GET /photo/image/{photo_id} + JWT
    Backend->>Backend: Validate JWT + Check ownership
    alt Authorized
        Backend->>DB: Query photo if user has access
        DB-->>Backend: Return photo data
        Backend-->>User: Image data
    else Unauthorized
        Backend-->>User: 403 Forbidden
    end
```

## Performance Optimization Opportunities

```mermaid
graph TB
    A[Original Request] --> B[Load Balancer]
    B --> C[CDN Check]
    C -->|Hit| D[Return from CDN]
    C -->|Miss| E[Application Server]
    E --> F[Application Cache Check]
    F -->|Hit| G[Return from App Cache]
    F -->|Miss| H[Database Query]
    H --> I[Read BLOB]
    I --> J[Stream Response]
    J --> K[Cache in Multiple Layers]
    K --> L[Return to User]
    
    subgraph "Optimization Layers"
        M[Thumbnail Generation]
        N[Image Compression]
        O[Multiple Format Support]
        P[Lazy Loading]
    end
```