import numpy as np

def create_single_color_histogram(r: int, g: int, b: int):
    """
    Creates a normalized histogram for a single solid color.
    """
    def color_to_hist(c):
        hist = np.zeros(256, dtype=float)
        hist[c] = 1.0
        return hist
        
    return color_to_hist(r), color_to_hist(g), color_to_hist(b)