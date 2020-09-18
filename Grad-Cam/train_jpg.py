# plot dog photos from the dogs vs cats dataset
from matplotlib import pyplot
from matplotlib.image import imread
from numpy import asarray
import numpy as np
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout,Activation
from tensorflow.keras import layers
from keras.utils import to_categorical
import pydicom 
import os
from keras.models import Model
from keras.optimizers import SGD
from keras import backend as K
# define location of dataset
folder_path = './dataset/train_set_jpg/'
folder_path_test = './dataset/test_set_jpg/'
objects = ["trauma","vhf"] 
x_train,y_train,x_test,y_test =list(), list(),list(), list()
images_path = os.listdir(folder_path)
img_width, img_height = 512, 512
if K.image_data_format() == 'channels_first':
    input_shape = (3, img_width, img_height)
else:
    input_shape = (img_width, img_height, 3)
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
        photo = load_img(files)
        # convert to numpy array
        arr = img_to_array(photo)
        # store
        photos.append(arr)
        labels.append(output)
    # convert to a numpy arrays
    photos = asarray(photos)
    labels = asarray(labels)
    return photos, labels


x_train,y_train = load_folder(folder_path)
print(x_train.shape)

x_test,y_test = load_folder(folder_path_test)

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
# run the test harness for evaluating a model
model = define_model()
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])
model.fit(x_train, y_train, epochs=10)

# test_loss, test_acc = model.evaluate(x_test, y_test, verbose=2)
# save model
model.save('classifier.h5')

