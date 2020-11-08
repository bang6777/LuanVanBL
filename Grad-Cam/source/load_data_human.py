from numpy import asarray
from numpy import save
import numpy as np                                                                                                                                                                                                                
import pydicom 
import os
import pandas as pd
# define and init location of dataset
folder_path = '/content/drive/My Drive/dataset/'
objects = ["Hip","Head","Knee","Pelvis","Shoulder"] 
x_train,y_train =list(), list()

def load_folder(folder_name):
    photos, labels = list(), list()
    for path in objects:
        folder_path = folder_name + path+"/"
        images_path = os.listdir(folder_path)
        print(folder_path)
        for n,images in enumerate(images_path):
            # print("Images",images)
            files = folder_path + images
            # determine class
            if path == "Hip":
                output = 0
            elif path == "Head":
                output = 1
            elif path == "Knee":
                output = 2
            elif path == "Pelvis":
                output = 3
            elif path == "Shoulder":
                output = 4

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