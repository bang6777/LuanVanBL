
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
import tensorflow as tf
import tensorflow.keras.backend as K
def save_images_dcm(image, path_output_jpg, path_output):
    im_frame = Image.open(path_output_jpg)
    # print(im_frame.mode)
    # if im_frame.mode = L then image.PhotometricInterpretation = "MONOCHROME1"
    # if im_frame.mode = RGBA then image.PhotometricInterpretation = "RGB"
    np_frame = np.array(im_frame.getdata(), dtype=np.uint8)
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

def save_images_jpg_gradcam(image, path_output):
    cv2.imwrite(path_output,np.uint8(image.astype(float)))
def Predict_Human(request):
    print("Đang chạy")
    path_output_jpg = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output/jpg/"
    path_output_dcm = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output/dcm/"
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
            mutifiles_head.append(src_fname+'.jpg')
        elif(output == "Hip"):
            mutifiles_hip.append(src_fname+'.jpg')
        elif(output == "Pelvis"):
            mutifiles_pelvis.append(src_fname+'.jpg')
        elif(output == "Shoulder"):
            mutifiles_shoulder.append(src_fname+'.jpg')

    data = {
        'head': mutifiles_head,
        'hip': mutifiles_hip,
        'pelvis': mutifiles_pelvis,
        'shoulder': mutifiles_shoulder,
    }
    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')


def GradCam(request):
    print("đang chạy Gradcam")
    img_width=512
    img_height=512
    path_output_jpg = "D:/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output_gradcam/jpg/"
    path_output_dcm = "D:/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output_gradcam/dcm/"
    model = load_model("D:/LuanVanBL/Django-React/GCAM_Classification/frontend/model/models.h5")
    folder_path_input="D:/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output/dcm/"
    organ ="Head/"
    folder_path_input = folder_path_input+organ
    mutifiles_head,mutifiles_hip,mutifiles_pelvis,mutifiles_shoulder = list(),list(),list(),list()
    images_path = os.listdir(folder_path_input)
    for n, images in enumerate(images_path):
        files = folder_path_input + images
        # load image
        photo = pydicom.dcmread(files)
        # convert to numpy array
        arr = photo.pixel_array
        sunglasses = asarray(arr).astype(float)
        sunglasses = (np.maximum(sunglasses, 0) / sunglasses.max()) * 255.0
        sunglasses = np.uint8(sunglasses)
        sunglasses = cv2.resize(sunglasses, dsize=(512, 512), interpolation=cv2.INTER_CUBIC)
        x=  sunglasses.reshape(1,img_width,img_height,1)
     
        preds = model.predict(x)
        class_idx = np.argmax(preds[0])
        class_output = model.output[:,class_idx]
        last_conv_layer = model.get_layer("conv2d_9")
        with tf.Graph().as_default():
            grads = K.gradients(class_output, last_conv_layer.output)[0]
        grads /= (K.sqrt(K.mean(K.square(grads))) + 1e-5)

        pooled_grads = K.mean(grads, axis=(0,1,2))
        iterate = K.function([model.input], [pooled_grads, last_conv_layer.output[0]])
        pooled_grads_value, conv_layer_output_value = iterate([x])
        h = np.mean(conv_layer_output_value, axis = -1)
        # print(pooled_grads_value)
        for i in range(256):
            conv_layer_output_value[:, :, i] *= pooled_grads_value[i]
        cams = np.mean(conv_layer_output_value, axis = -1)

        # print(conv_layer_output_value.shape)

        # print(heatmap.shape)

        cams = np.maximum(cams, 0)
        cams = cv2.resize(cams, (sunglasses.shape[1], sunglasses.shape[0]))
        heatmap = cams/np.max(cams)
        heatmaps = cams/np.max(cams)

        # heatmap = cv2.resize(heatmap, (sunglasses.shape[1], sunglasses.shape[0]))

        heatmap = np.uint8(255 * heatmap)

        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        w, h = sunglasses.shape

        new = np.empty((w, h, 3), dtype=sunglasses.dtype)

        new[:,:,2] = new[:,:,1] = new[:,:,0] = sunglasses
        # jetcam = (np.float32(grad_cam_img)+np.float32(heatmap))
        jetcam = (np.float32(heatmap) + new) / 2
        organNew = organ[:-1]
        src_fname = organNew+str(n)
        path_output_dcms = path_output_dcm + organ
        path_output_jpg = path_output_jpg+organ
        path_image_jpg = os.path.join(
            path_output_jpg, os.path.basename(src_fname)+'.jpg')
        path_image_dcm = os.path.join(
            path_output_dcms, os.path.basename(src_fname)+'.dcm')
        save_images_jpg_gradcam(jetcam, path_image_jpg)
        save_images_dcm(jetcam, path_image_jpg, path_image_dcm)
        
        if(organNew == "Head"):
            mutifiles_head.append(path_image_jpg)
        elif(organNew == "Hip"):
            mutifiles_hip.append(path_image_jpg)
        elif(organNew == "Pelvis"):
            mutifiles_pelvis.append(path_image_jpg)
        elif(organNew == "Shoulder"):
            mutifiles_shoulder.append(path_image_jpg)
    data = {
        'head_grad': mutifiles_head,
        'hip_grad': mutifiles_hip,
        'pelvis_grad': mutifiles_pelvis,
        'shoulder_grad': mutifiles_shoulder,
    }
    dump_grad = json.dumps(data)
    return HttpResponse(dump_grad, content_type='application/json')


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
def GradCamUI(request):
    return render(request, 'frontend/index.html')