from numpy import asarray
from numpy import save
import numpy as np
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout
from keras.layers import Activation
from tensorflow.keras import layers
from keras.utils import to_categorical
import pydicom 
import os
import cv2
import pandas as pd
from keras import backend as K

# define and init location of dataset
folder_path = './dataset/'
objects = ["Ankle","Head","Knee","Pelvis","Shoulder"] 
x_train,y_train =list(), list()


# plot first few images
def load_folder(folder_name):
    photos, labels = list(), list()
    for path in objects:
        folder_path = folder_name + path+"/"
        images_path = os.listdir(folder_path)
        print(folder_path)
        for n,images in enumerate(images_path):
            print("Images",images)
            files = folder_path + images
            # determine class
            output = 0.0
            if path == "Ankle":
                output = 0.0
            elif path == "Head":
                output = 1.0
            elif path == "Knee":
                output = 2.0
            elif path == "Pelvis":
                output = 3.0
            elif path == 'Shoulder':
                output = 4.0
            # load image
            photo = pydicom.dcmread(files)
            # convert to numpy array
            arr = photo.pixel_array
            # store
            photos.append(arr)
            labels.append(output)
    # convert to a numpy arrays
    photos = asarray(photos).astype(np.float32)
    labels = asarray(labels).astype(np.float32)
    return photos, labels
x_train,y_train = load_folder(folder_path)

print(y_train)