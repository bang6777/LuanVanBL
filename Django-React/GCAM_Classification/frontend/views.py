
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
import json
from django.http import HttpResponse


def save_images_dcm(image, path_output_jpg, path_output):
    im_frame = Image.open(path_output_jpg)
    # print(im_frame.mode)
    # if im_frame.mode = L then image.PhotometricInterpretation = "MONOCHROME1"
    # if im_frame.mode = RGBA then image.PhotometricInterpretation = "RGB"
    np_frame = np.array(im_frame.getdata(), dtype=np.uint8)
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


def save_images_jpg(image, path_output):
    test_image = image.pixel_array
    print(test_image.shape)
    img_2d = test_image.astype(float)
    # Step 2. Rescaling grey scale between 0-255
    img_2d_scaled = (np.maximum(img_2d, 0) / img_2d.max()) * 255.0
    cv2.imwrite(path_output, img_2d_scaled)


def index(request):
    return render(request, 'frontend/index.html')


def Predict_Human(request):
    print("Đang chạy")
    path_output_jpg = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/output/jpg/"
    path_output_dcm = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/output/dcm/"
    folder_path_input = 'C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/input/'
    model = load_model("C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/model/model_8_layers_epochs_40.h5")
    img_width, img_height = 251, 251
    photos = list()
    mutifiles_head,mutifiles_hip,mutifiles_pelvis,mutifiles_shoulder = list(),list(),list(),list()
    images_path = os.listdir(folder_path_input)
    for n, images in enumerate(images_path):
        # print("Images",images)
        files = folder_path_input + images
        # load image
        photo = pydicom.dcmread(files)
        # convert to numpy array
        arr = photo.pixel_array
        sunglasses = asarray(arr).astype(float)
        sunglasses = cv2.resize(arr, dsize=(
            img_width, img_height), interpolation=cv2.INTER_CUBIC)
        photos = asarray(sunglasses).astype(np.float32)
        # determine class
        test_image = photos.reshape(1, img_width, img_height, 1)
        result = model.predict(test_image)
        result = np.argmax(result, axis=1)
        if result == 0:
            output = "Head"
        elif result == 1:
            output = "Hip"
        elif result == 2:
            output = "Pelvis"
        elif result == 3:
            output = "Shoulder"
        src_fname = output+str(n)
        path_output_dcms = path_output_dcm + output
        print(path_output_dcms)
        path_image_jpg = os.path.join(
            path_output_jpg, os.path.basename(src_fname)+'.jpg')
        path_image_dcm = os.path.join(
            path_output_dcms, os.path.basename(src_fname)+'.dcm')
        save_images_jpg(photo, path_image_jpg)
        save_images_dcm(photo, path_image_jpg, path_image_dcm)
        if(output == "Head"):
            mutifiles_head.append(path_image_jpg)
        elif(output == "Hip"):
            mutifiles_hip.append(path_image_jpg)
        elif(output == "Pelvis"):
            mutifiles_pelvis.append(path_image_jpg)
        elif(output == "Shoulder"):
            mutifiles_shoulder.append(path_image_jpg)

    data = {
        'head': mutifiles_head,
        'hip': mutifiles_hip,
        'pelvis': mutifiles_pelvis,
        'shoulder': mutifiles_shoulder,
    }
    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')


def hello(request):
    m = ["a", "b", "c"]
    data = {
        'name': m,
        'location': 'India',
        'is_active': False,
        'count': 28,
    }
    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')