from matplotlib import pyplot
from matplotlib.image import imread
from numpy import asarray
import numpy as np
from tensorflow import keras
import os
from keras.models import Model
from keras import backend as K
import pydicom 
from keras.models import load_model
import numpy as np
from keras.preprocessing import image

model = load_model('classifier.h5')
# define location of dataset
folder_path_test = './dataset/test_set_dcm/'
objects = ["trauma","vhf"] 
x_test,y_test =list(), list()
images_path = os.listdir(folder_path_test)

def load_folder(folder_name):
    photos, labels = list(), list()
    for n,images in enumerate(images_path):
        # print(images)
        files = folder_path_test + images
        # determine class
        output = 0.0
        if images.startswith(objects[1]):
            output = 1.0
        # load image
        photo = pydicom.dcmread(files)
        # convert to numpy array
        # arr = img_to_array(photo)
        arr = photo.pixel_array
        # arr_colorimage = apply_color_lut(arr, palette='PET')
        # store
        photos.append(arr)
        labels.append(output)
    # convert to a numpy arrays
    photos = asarray(photos).astype(np.float32)
    labels = asarray(labels).astype(np.float32)
    return photos, labels

# x_test,y_test = load_folder(folder_path_test)
# img_width=x_test[0].shape[0]
# img_height=x_test[0].shape[1]

# x_test=x_test.reshape(x_test.shape[0],img_width,img_height,1)
# #test 
# test_loss, test_acc = model.evaluate(x_test, y_test, verbose=2)

# print("test loss",test_loss)
# print("test acc",test_acc)
test_image = pydicom.dcmread('./dataset/test_set_dcm/vhf.1496.dcm')
test_image = test_image.pixel_array
test_image = asarray(test_image).astype(np.float32)
test_image = test_image.reshape(1,512,512,1)
result = model.predict(test_image)
print("class",result)
if result[0][0] == 0:
    prediction = 'trauma'
elif result[0][0] ==1:
    prediction = 'shoulder'
else:
    prediction = 'error'
print(prediction)