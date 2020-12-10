
from django.shortcuts import render
import numpy as np 
from numpy import asarray  
import os
import pydicom 
from tensorflow import keras
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
from PIL import Image
import cv2
import numpy as np    
def save_images_dcm(image,path_output_jpg,path_output):
    im_frame =  Image.open(path_output_jpg)
    # print(im_frame.mode)
    # if im_frame.mode = L then image.PhotometricInterpretation = "MONOCHROME1"
    # if im_frame.mode = RGBA then image.PhotometricInterpretation = "RGB"
    np_frame = np.array(im_frame.getdata(),dtype=np.uint8)
    image.Rows = im_frame.height
    image.Columns = im_frame.width
    image.PhotometricInterpretation = "MONOCHROME1"
    image.SamplesPerPixel = 1
    image.BitsStored = 8
    image.BitsAllocated = 8
    image.HighBit = 7
    image.PixelRepresentation = 0
    image.PixelData = np_frame.tobytes()
    image.save_as(path_output)

def save_images_jpg(image,path_output):
    test_image = image.pixel_array
    print(test_image.shape)
    img_2d = test_image.astype(float)
    # Step 2. Rescaling grey scale between 0-255
    img_2d_scaled = (np.maximum(img_2d, 0) / img_2d.max()) * 255.0
    cv2.imwrite(path_output, img_2d_scaled)

def index(request):
    path_output_jpg = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/output/jpg/"
    path_output_dcm = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/output/dcm/"
    folder_path_input = 'C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/input/'
    model = load_model("C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/model.h5")
    img_width, img_height = 512,512
    photos = list()
    images_path = os.listdir(folder_path_input)
    for n,images in enumerate(images_path):
        # print("Images",images)
        files = folder_path_input + images
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
        save_images_jpg(photo,path_image_jpg)
        save_images_dcm(photo,path_image_jpg,path_image_dcm )
    return render(request, 'frontend/index.html')
