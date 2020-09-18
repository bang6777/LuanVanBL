import matplotlib.pyplot as plt
import pydicom
from pydicom.data import get_testdata_files
from skimage.transform import resize
# from pydicom.pixel_data_handlers.util import apply_color_lut
import numpy
import os
import cv2
import glob
import matplotlib
from numpy import asarray
from numpy import savetxt
import tensorflow as tf
from keras.layers import Input, Flatten
from keras.models import Model
import cnn
<<<<<<< HEAD
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
=======
def load_sequence(folder):
    sequence_folder = glob.glob(os.path.join(folder, '*.dcm'))
    for filename in sequence_folder:
        print(filename)
        ds = pydicom.dcmread(filename)
        arr = ds.pixel_array
        arr_colorimage = apply_color_lut(arr, palette='PET')
        # print(arr)
        # plt.imshow(arr,cmap=plt.cm.bone)
        # plt.show()
        l1_filter = numpy.zeros((2,3,3))
        l1_filter[0, :, :] = numpy.array([[[-1, 0, 1],   
                                        [-1, 0, 1],   
                                        [-1, 0, 1]]])  
        l1_filter[1, :, :] = numpy.array([[[1,   1,  1],   
                                        [0,   0,  0],   
                                        [-1, -1, -1]]])
        l1_feature_map = cnn.conv(arr, l1_filter)  
        # plt.imshow(l1_feature_map[:, :, 0],cmap=plt.cm.bone)
        # plt.show()   
        l1_feature_map_relu = cnn.relu(l1_feature_map)          
        l1_feature_map_relu_pool = cnn.pooling(l1_feature_map_relu, 2, 2) 
        data = asarray(l1_feature_map_relu_pool)

        print(data[0].shape)
        # save to csv file
        savetxt('data.csv', data[0], delimiter=',')

        # plt.imshow(l1_feature_map_relu_pool[:, :, 0],cmap=plt.cm.bone)
        # plt.show()
      
load_sequence('./TRAUMA/')





>>>>>>> a805c33490f05e3001a04afe3875add479e1de92
