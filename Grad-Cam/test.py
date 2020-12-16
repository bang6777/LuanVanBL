from matplotlib import pyplot as plt
from matplotlib.image import imread
from numpy import asarray
from keras.preprocessing.image import load_img
import numpy as np
from tensorflow import keras
import os
import cv2
from PIL import Image
from keras.models import Model
from keras import backend as K
import pydicom
from keras.models import load_model
import numpy as np
from keras.preprocessing import image
import tensorflow as tf
# model = load_model('model.h5')
model = tf.keras.models.load_model('classifier.h5')
# define location of dataset
folder_path_test = './dataset/test_set_dcm/'
objects = ["trauma","vhf"] 
data=list()
path_output_dcm = "./Output_dcm/"
path_output_jpg = "./Output_jpg/"
img_width, img_height= 512,512
os.mkdir(path_output_dcm)
os.mkdir(path_output_jpg)
os.mkdir(os.path.join(path_output_dcm,"trauma/"))
os.mkdir(os.path.join(path_output_dcm,"shoulder/"))
def load_folder(folder_name):
    photos = list()
    images_path = os.listdir(folder_name)
    for n,images in enumerate(images_path):
        files = folder_name + images
        print(files)
        photo = pydicom.dcmread(files)
        data = photo.pixel_array
        # convert to a numpy arrays
        data = asarray(data).astype(np.float32)
        data=data.reshape(1,img_width,img_height,1)
        result = model.predict(data)
        src_fname_jpg = "images"+str(n)
        path_image_jpg = os.path.join(path_output_jpg, os.path.basename(src_fname_jpg)+'.jpg')
        save_images_jpg(data,path_image_jpg)
        if result[0][0] == 0:
            src_fname = 'trauma'+str(n)
            path_image_dcm = os.path.join(path_output_dcm +"trauma/", os.path.basename(src_fname)+'.dcm')
            save_image_dcm(photo,path_image_jpg,path_image_dcm )
        elif result[0][0] == 1:
            src_fname = 'shoulder'+str(n)
            path_image_dcm = os.path.join(path_output_dcm +"shoulder/",os.path.basename(src_fname)+'.dcm')
            save_image_dcm(photo,path_image_jpg,path_image_dcm )

# print(prediction)
# img_path= "./dataset/"


def grad_cam(input_model, image, cls, layer_name):
    """GradCAM method for visualizing input saliency."""
    y_c = input_model.output[0, cls]

    conv_output = input_model.get_layer(layer_name).output
    # tf.compat.v1.disable_eager_execution()
    with tf.Graph().as_default():
        grads = K.gradients(y_c, conv_output)[0]
    # Normalize if necessary
    # grads = normalize(grads)

    gradient_function = K.function([input_model.input], [conv_output, grads])

    output, grads_val = gradient_function([image])
    output, grads_val = output[0, :], grads_val[:, :]

    weights = np.mean(grads_val, axis=(0, 1))
    cam = np.dot(output, weights)

    # Process CAM
    cam = cv2.resize(cam, (img_width, img_height), cv2.INTER_LINEAR)
    cam = np.maximum(cam, 0)
    
    heatmap = cam / np.max(cam)
    # print(heatmap)
    cam_max = cam.max()
    if cam_max != 0:
        cam = cam / cam_max
    return cam, heatmap


# print(model.get_layer(index = -1).name)

def save_images_jpg(test_image,path_output):
    cls = -1
    preprocessed_input = test_image
    layer_name = "activation_4"
    gradcam,heatmap = grad_cam(model, preprocessed_input, cls, layer_name)
    test_image = test_image.reshape(512,512,1)
    jetcam = cv2.applyColorMap(np.uint8(255 * gradcam), cv2.COLORMAP_JET)
    jetcam = (np.float32(jetcam) + test_image) / 2
    cv2.imwrite(path_output, np.uint8(jetcam))

def save_image_dcm(image,path_output_jpg,path_output):
    im_frame =  Image.open(path_output_jpg)
    # print(im_frame.mode)
    np_frame = np.array(im_frame.getdata(),dtype=np.uint8)
    image.Rows = im_frame.height
    image.Columns = im_frame.width
    image.PhotometricInterpretation = "RGB"
    image.SamplesPerPixel = 3
    image.BitsStored = 8
    image.BitsAllocated = 8
    image.HighBit = 7
    image.PixelRepresentation = 0
    image.PixelData = np_frame.tobytes()
    image.save_as(path_output)

load_folder(folder_path_test)
