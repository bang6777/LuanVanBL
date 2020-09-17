# make a prediction for a new image.
from matplotlib import pyplot
from matplotlib.image import imread
from numpy import asarray
from numpy import save
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout
from keras.layers import Activation
from tensorflow.keras import layers
from keras.utils import to_categorical
import pydicom as dicom
import os
import cv2
import PIL # optional
import pandas as pd
import csv
from keras.applications.vgg16 import VGG16
from keras.models import Model
from keras.layers import Dense
from keras.layers import Flatten
from keras.optimizers import SGD
from keras.preprocessing.image import ImageDataGenerator
from keras import backend as K
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np
from keras.preprocessing import image
model = load_model('classifier.h5')
# define location of dataset
folder_path = './dataset/train_set_dcm/'
folder_path_test = './dataset/test_set_dcm/'
objects = ["trauma","vhf"] 
x_train,y_train,x_test,y_test =list(), list(),list(), list()
images_path = os.listdir(folder_path)
img_width, img_height = 150, 150
if K.image_data_format() == 'channels_first':
    input_shape = (3, img_width, img_height)
else:
    input_shape = (img_width, img_height, 3)
def load_folder(folder_name):
    photos, labels = list(), list()
    for n,images in enumerate(images_path):
        # print(images)
        files = folder_path + images
        # determine class
        output = 0.0
        if images.startswith(objects[1]):
            output = 1.0
        # load image
        photo = pydicom.dcmread(files,target_size=(150, 150))
        # convert to numpy array
        arr = img_to_array(photo)
        arr = ds.pixel_array
        arr_colorimage = apply_color_lut(arr, palette='PET')
        # store
        photos.append(arr)
        labels.append(output)
    # convert to a numpy arrays
    photos = asarray(photos)
    labels = asarray(labels)
    return photos, labels
x_test,y_test = load_folder(folder_path_test)
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=2)
print("test loss",test_loss)
print("test acc",test_acc)
test_image = image.load_img('./test_set/vhf.1051.jpg', target_size=(150, 150))
test_image = image.img_to_array(test_image)
test_image = np.expand_dims(test_image, axis = 0)
result = model.predict(test_image)
print("class",result)
if result[0][0] == 0:
    prediction = 'trauma'
elif result[0][0] ==1:
    prediction = 'shoulder'
print(prediction)