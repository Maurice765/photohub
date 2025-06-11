import cv2
import matplotlib.pyplot as plt

# Bild laden (Pfad zum Bild anpassen)
image = cv2.imread('IMG_1160.JPG')

# Bild von BGR (OpenCV-Standard) zu RGB konvertieren
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Farben definieren (für Plot)
farben = ('r', 'g', 'b')

plt.figure(figsize=(10, 5))

# Für jeden Farbkanal das Histogramm berechnen und plotten
for i, farbe in enumerate(farben):
    hist = cv2.calcHist([image_rgb], [i], None, [256], [0, 256])
    plt.plot(hist, color=farbe)
    plt.xlim([0, 256])

plt.title('Farbhistogramm')
plt.xlabel('Pixelwert')
plt.ylabel('Anzahl der Pixel')
plt.show()