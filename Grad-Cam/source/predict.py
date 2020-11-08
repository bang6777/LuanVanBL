from keras.models import load_model
import numpy as np 
from numpy import asarray  
import os
import pydicom 
from source import save_image
path_output_jpg = "./output/jpg/"
path_output_dcm = "./output/dcm/"

def predict_folder(model,folder_path,img_width,img_height):
    photos = list()
    images_path = os.listdir(folder_path)
    print(folder_path)
    for n,images in enumerate(images_path):
        # print("Images",images)
        files = folder_path + images
        # load image
        photo = pydicom.dcmread(files)
        # convert to numpy array
        arr = photo.pixel_array
        photos = asarray(arr).astype(np.float32)
        # determine class
        test_image = photos.reshape(1,img_width,img_height,1)
        result = model.predict(test_image)
        result = np.argmax(result, axis=1)
        if result == 0:
            output = "Hip"
        elif result == 1:
            output = "Head"
        elif result == 2:
            output = "Knee"
        elif result == 3:
            output = "Pelvis"
        elif result == 4:
            output = "Shoulder"
        src_fname = "images"+str(n)
        path_output_dcms = path_output_dcm + output
        print(path_output_dcms)
        path_image_jpg = os.path.join(path_output_jpg, os.path.basename(src_fname)+'.jpg')
        path_image_dcm = os.path.join(path_output_dcms , os.path.basename(src_fname)+'.dcm')
        save_image.save_images_jpg(photo,path_image_jpg)
        save_image.save_images_dcm(photo,path_image_jpg,path_image_dcm )



