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
folder_path = './dataset/train_set_dcm/'
objects = ["trauma","vhf"] 
x_train,y_train =list(), list()
images_path = os.listdir(folder_path)

# plot first few images
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

img_width=x_train[0].shape[0]
img_height=x_test[0].shape[1]

x_train=x_train.reshape(x_train.shape[0],img_width,img_height,1)

if K.image_data_format() == 'channels_first':
    input_shape = (1, img_width, img_height)
else:
    input_shape = (img_width, img_height, 1)
# define cnn model
def define_model():
    #Layer1
    model = Sequential()
    model.add(Conv2D(32, (3, 3), input_shape=input_shape))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    #Layer2
    model.add(Conv2D(32, (3, 3)))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    #Layer3
    model.add(Conv2D(64, (3, 3)))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    #Transforming the output
    model.add(Flatten())
    model.add(Dense(64))
    model.add(Activation('relu'))
    model.add(Dropout(0.5)) #Use dropout to handle overfitting
    model.add(Dense(1))
    model.add(Activation('sigmoid'))
    return model

model = define_model()
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])
#train model
model.fit(x_train, y_train, epochs=10)
# save model
model.save('classifier.h5')

