import pydicom
from matplotlib import pyplot as plt
from pydicom.pixel_data_handlers.util import apply_voi_lut
from pydicom.data import get_testdata_files
from numpy import savetxt
import numpy as np
image = pydicom.dcmread('./dataset/test_set_dcm/vhf.1446.dcm')
# filename = get_testdata_files('CT_small.dcm')[0]
# image = pydicom.dcmread(filename)
test_image = image.pixel_array
print(test_image.shape)
img_2d = test_image.astype(float)

# Step 2. Rescaling grey scale between 0-255
img_2d_scaled = (np.maximum(img_2d, 0) / img_2d.max()) * 255.0

# Step 3. Convert to uint
img_2d_scaled = np.uint8(img_2d_scaled)
# print(img_2d_scaled)
print(img_2d_scaled.dtype)
print(img_2d_scaled.shape)
print(img_2d_scaled)
# out = apply_voi_lut(test_image, image, index=0)
pixel_data = list()
for x in range(0, img_2d_scaled.shape[0]):
    for y in range(0, img_2d_scaled.shape[1]):
        if(img_2d_scaled[x][y] < 120):
            img_2d_scaled[x][y] = 0
        # print("hello",img_2d_scaled[x][y])
savetxt('data.csv', img_2d_scaled, delimiter=',')
plt.imshow(img_2d_scaled, cmap='gray')
plt.show()
