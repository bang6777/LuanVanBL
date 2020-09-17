import matplotlib.pyplot as plt
import pydicom
from pydicom.data import get_testdata_files
from skimage.transform import resize
# from pydicom.pixel_data_handlers.util import apply_color_lut
import numpy
import os
import cv2
import matplotlib
import cnn
# base = "./TRAUMA/"
base = "./Cor"
# pass_dicom = "trauma0005.dcm"
pass_dicom = "IM-0001-0001.dcm"
# filename = pydicom.data.data_manager.get_files(base, pass_dicom)[0]
filename = pydicom.data.data_manager.get_files(base, pass_dicom)[0]

ds = pydicom.dcmread(filename, force=True)
arr = ds.pixel_array
# arr_colorimage = apply_color_lut(arr, palette='PET')
plt.imshow(arr, cmap=plt.cm.bone)
plt.show()
l1_filter = numpy.zeros((2, 3, 3))
l1_filter[0, :, :] = numpy.array([[[-1, 0, 1],
                                   [-1, 0, 1],
                                   [-1, 0, 1]]])
l1_filter[1, :, :] = numpy.array([[[1,   1,  1],
                                   [0,   0,  0],
                                   [-1, -1, -1]]])
l1_feature_map = cnn.conv(arr, l1_filter)
plt.imshow(l1_feature_map[:, :, 0], cmap=plt.cm.bone)
plt.show()
l1_feature_map_relu = cnn.relu(l1_feature_map)
l1_feature_map_relu_pool = cnn.pooling(l1_feature_map, 2, 2)
print(l1_feature_map_relu_pool)
plt.imshow(l1_feature_map_relu_pool[:, :, 0], cmap=plt.cm.bone)
plt.show()
