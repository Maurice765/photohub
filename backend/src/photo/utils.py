import hashlib
import numpy as np
import cv2
from sklearn.cluster import KMeans
from src.photo import schemas
from src.photo import constants

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

def extract_dominant_colors(image_rgb: np.ndarray, k: int = 5):
    # Umformen zu (N, 3) für Clustering
    pixels = image_rgb.reshape((-1, 3))
    pixels = np.float32(pixels)

    # Anzahl einzigartiger Farben prüfen
    unique_colors = np.unique(pixels, axis=0)
    k = min(k, len(unique_colors))  # Clusteranzahl anpassen

    if k == 0:
        return []  # Bild ist leer oder fehlerhaft
    elif k == 1:
        color = unique_colors[0].astype(int)
        return [{
            "r": int(color[0]),
            "g": int(color[1]),
            "b": int(color[2]),
            "percent": 100.0
        }]

    # KMeans Clustering
    kmeans = KMeans(n_clusters=k, n_init=10)
    labels = kmeans.fit_predict(pixels)
    centers = np.round(kmeans.cluster_centers_).astype(int)

    # Anteil berechnen
    _, counts = np.unique(labels, return_counts=True)
    percentages = counts / counts.sum()

    return [
        {"r": int(c[0]), "g": int(c[1]), "b": int(c[2]), "percent": round(float(p) * 100, 2)}
        for c, p in zip(centers, percentages)
    ]