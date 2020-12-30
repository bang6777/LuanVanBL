from django.shortcuts import render

from numpy import asarray
from numpy import save
from tensorflow.python.framework import ops
import numpy as np        
import matplotlib.pyplot as plt    
from sklearn.metrics import accuracy_score                                                                                                                                                                                                    
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense, Conv2D, MaxPool2D , Flatten
from keras import activations
from tensorflow.keras import layers
from keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from keras.layers.advanced_activations import LeakyReLU
import pydicom 
import os
import cv2
import tensorflow as tf
import pandas as pd
import keras.backend as K
from sklearn.model_selection import KFold
from sklearn.model_selection import StratifiedKFold 
from PIL import Image
from keras.layers.core import Flatten, Dense, Dropout
from keras.layers.convolutional import Convolution2D, MaxPooling2D, ZeroPadding2D
from keras.models import load_model
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
import json
from django.http import HttpResponse

def save_images_dcm(image,path_output_jpg,path_output):
    # images_path = os.listdir(path_output_jpg)
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
    accuaracy_head,accuaracy_hip,accuaracy_pelvis,accuaracy_shoulder = list(),list(),list(),list()
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
        prediction=tf.keras.utils.to_categorical(result, num_classes=4, dtype='float32')
        score = model.evaluate(test_image, prediction, verbose = 0) 
        print('Test loss:', score[0]) 
        print('Test accuracy:', 1-score[0])
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
            accuaracy_head.append(str(1-score[0]))
        elif(output == "Hip"):
            mutifiles_hip.append(src_fname+'.jpg')
            accuaracy_hip.append(str(1-score[0]))
        elif(output == "Pelvis"):
            mutifiles_pelvis.append(src_fname+'.jpg')
            accuaracy_pelvis.append(str(1-score[0]))
        elif(output == "Shoulder"):
            mutifiles_shoulder.append(src_fname+'.jpg')
            accuaracy_shoulder.append(str(1-score[0]))

    data = {
        'head': mutifiles_head,
        'hip': mutifiles_hip,
        'pelvis': mutifiles_pelvis,
        'shoulder': mutifiles_shoulder,
        "accuaracy_head": accuaracy_head,
        "accuaracy_hip":accuaracy_hip,
        "accuaracy_pelvis":accuaracy_pelvis,
        "accuaracy_shoulder":accuaracy_shoulder
    }
    dump = json.dumps(data)
    return HttpResponse(dump, content_type='application/json')

def make_gradcam_heatmap(
    img_array, model, last_conv_layer_name, classifier_layer_names
):
    # First, we create a model that maps the input image to the activations
    # of the last conv layer
    last_conv_layer = model.get_layer(last_conv_layer_name)
    last_conv_layer_model = keras.Model(model.inputs, last_conv_layer.output)

    # Second, we create a model that maps the activations of the last conv
    # layer to the final class predictions
    classifier_input = keras.Input(shape=last_conv_layer.output.shape[1:])
    x = classifier_input
    for layer_name in classifier_layer_names:
        x = model.get_layer(layer_name)(x)
    classifier_model = keras.Model(classifier_input, x)

    # Then, we compute the gradient of the top predicted class for our input image
    # with respect to the activations of the last conv layer
    with tf.GradientTape() as tape:
        # Compute activations of the last conv layer and make the tape watch it
        last_conv_layer_output = last_conv_layer_model(img_array)
        tape.watch(last_conv_layer_output)
        # Compute class predictions
        preds = classifier_model(last_conv_layer_output)
        top_pred_index = tf.argmax(preds[0])
        top_class_channel = preds[:, top_pred_index]

    # This is the gradient of the top predicted class with regard to
    # the output feature map of the last conv layer
    grads = tape.gradient(top_class_channel, last_conv_layer_output)

    # This is a vector where each entry is the mean intensity of the gradient
    # over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # We multiply each channel in the feature map array
    # by "how important this channel is" with regard to the top predicted class
    last_conv_layer_output = last_conv_layer_output.numpy()[0]
    pooled_grads = pooled_grads.numpy()
    for i in range(pooled_grads.shape[-1]):
        last_conv_layer_output[:, :, i] *= pooled_grads[i]

    # The channel-wise mean of the resulting feature map
    # is our heatmap of class activation
    heatmap = np.mean(last_conv_layer_output, axis=-1)

    # For visualization purpose, we will also normalize the heatmap between 0 & 1
    heatmap = np.maximum(heatmap, 0) / np.max(heatmap)
    return heatmap
def GradCam(request):
    print("đang chạy Gradcam")
    classifier_layer_names = ["max_pooling2d_11","flatten_2",]
    img_width=512
    img_height=512
    path_output_jpg = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output_gradcam/jpg/"
    path_output_dcm = "C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output_gradcam/dcm/"
    model = load_model("C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/model/Grad_Models.h5")
    folder_path_input="C:/Users/Linh/Desktop/LuanVan/LuanVanBL/Django-React/GCAM_Classification/frontend/static/output/dcm/"
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
     
        heatmap = make_gradcam_heatmap(x,model,"conv2d_11",classifier_layer_names)

        heatmap = cv2.resize(heatmap, (sunglasses.shape[1], sunglasses.shape[0]))

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
        path_output_jpgs = path_output_jpg+organ
        path_image_jpg = os.path.join(
            path_output_jpgs, os.path.basename(src_fname)+'.jpg')
        path_image_dcm = os.path.join(
            path_output_dcms, os.path.basename(src_fname)+'.dcm')
        save_images_jpg_gradcam(jetcam, path_image_jpg)
        save_images_dcm(photo, path_image_jpg, path_image_dcm)
        
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