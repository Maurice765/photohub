import hashlib
import numpy as np
import cv2
from src.photo import schemas
from src.photo import constants
from src.photo import exceptions

def generate_file_hash(content: bytes) -> str:
    """Generates a SHA-256 hash for the given file content."""
    hasher = hashlib.sha256()
    hasher.update(content)
    return hasher.hexdigest()

def calculate_orientation(width: int, height: int) -> constants.OrientationEnum:
    if width > height:
        return constants.OrientationEnum.HORIZONTAL
    elif height > width:
        return constants.OrientationEnum.VERTICAL
    else:
        return constants.OrientationEnum.SQUARE

def calculate_color_histograms(image_rgb: np.ndarray) -> schemas.ColorHistogram:
    """
    Calculates the normalized R, G, and B color histograms for an image.
    Expects an image in RGB format.
    """
    # Calculate histograms for each channel
    r_hist = cv2.calcHist([image_rgb], [0], None, [256], [0, 256]).flatten()
    g_hist = cv2.calcHist([image_rgb], [1], None, [256], [0, 256]).flatten()
    b_hist = cv2.calcHist([image_rgb], [2], None, [256], [0, 256]).flatten()

    # Normalize the histograms
    total_pixels = image_rgb.shape[0] * image_rgb.shape[1]
    r_hist_norm = r_hist / total_pixels
    g_hist_norm = g_hist / total_pixels
    b_hist_norm = b_hist / total_pixels

    return schemas.ColorHistogram(
        r_bins=r_hist_norm.tolist(),
        g_bins=g_hist_norm.tolist(),
        b_bins=b_hist_norm.tolist()
    )

def create_single_color_histogram(r: int, g: int, b: int) -> schemas.ColorHistogram:
    """
    Creates a normalized histogram for a single solid color.
    """
    def color_to_hist(c: int) -> list[float]:
        hist = np.zeros(256, dtype=float)
        hist[c] = 1.0
        return hist.tolist()
        
    return schemas.ColorHistogram(
        r_bins=color_to_hist(r),
        g_bins=color_to_hist(g),
        b_bins=color_to_hist(b)
    )

def generate_preview(image: np.ndarray, max_dim: int = 300) -> bytes:
    height, width = image.shape[:2]
    scale = max_dim / max(height, width)
    new_size = (int(width * scale), int(height * scale))
    resized = cv2.resize(image, new_size, interpolation=cv2.INTER_AREA)

    success, encoded = cv2.imencode('.jpg', resized)
    if not success:
        raise exceptions.PreviewGenerationError()
    return encoded.tobytes()


def extract_dominant_colors(image_rgb: np.ndarray, k: int = 5):
    # Bild grob verkleinern für Speed (z.B. 100x100)
    small_image = cv2.resize(image_rgb, (100, 100), interpolation=cv2.INTER_AREA)

    # Bilddaten in 2D-Array umformen: (N, 3)
    pixels = small_image.reshape((-1, 3))
    pixels = np.float32(pixels)

    # Einzigartige Farben zählen
    unique_colors = np.unique(pixels, axis=0)
    k = min(k, len(unique_colors))  # Sicherheitscheck

    if k == 0:
        return []
    elif k == 1:
        color = unique_colors[0]
        return [{
            "r": int(color[0]),
            "g": int(color[1]),
            "b": int(color[2]),
            "percentage": 100.0
        }]

    # KMeans Parameter
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 1.0)
    flags = cv2.KMEANS_PP_CENTERS

    compactness, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, flags)

    # Rundung + Umwandlung
    centers = np.round(centers).astype(int)
    labels = labels.flatten()

    # Prozentualer Anteil
    counts = np.bincount(labels)
    total = counts.sum()
    percentages = (counts / total) * 100

    dominant_colors = []
    for i in range(k):
        color = centers[i]
        dominant_colors.append({
            "r": int(color[0]),
            "g": int(color[1]),
            "b": int(color[2]),
            "percentage": round(float(percentages[i]), 2)
        })

    return dominant_colors