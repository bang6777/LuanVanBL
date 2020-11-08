from keras.models import load_model
import numpy as np 
from numpy import asarray  
import os
import cv2
from keras import backend as K
import tensorflow as tf
import pydicom 
from source import save_image
def grad_cam(model,photos,path_image_jpg,img_width,img_height):
    photos = (np.maximum(photos, 0) / photos.max()) * 255.0
    photos = np.uint8(photos)
    photos = cv2.resize(photos, dsize=(512, 512), interpolation=cv2.INTER_CUBIC)
    test_image = photos.reshape(1,img_width,img_height,1)
    preds = model.predict(test_image)
    class_output = model.output[:,0]
    last_conv_layer = model.get_layer("max_pooling2d_8")
    with tf.Graph().as_default():
        grads = K.gradients(class_output, last_conv_layer.output)[0]
    grads /= (K.sqrt(K.mean(K.square(grads))) + 1e-5)

    pooled_grads = K.mean(grads, axis=(0,1,2))

    print(pooled_grads.shape)
    print("model.input",model.input)
    iterate = K.function([model.input], [pooled_grads, last_conv_layer.output[0]])
    pooled_grads_value, conv_layer_output_value = iterate([test_image])
    h = np.mean(conv_layer_output_value, axis = -1)
    print(conv_layer_output_value.shape)
    # print(pooled_grads_value)
    for i in range(256):
        conv_layer_output_value[:, :, i] *= pooled_grads_value[i]
    heatmap = np.mean(conv_layer_output_value, axis = -1)

    print(conv_layer_output_value.shape)

    print(heatmap.shape)

    heatmap = np.maximum(heatmap, 0)

    heatmap /= np.max(heatmap)

    heatmap = cv2.resize(heatmap, (photos.shape[1], photos.shape[0]))

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    photos =  photos.reshape(img_width,img_height)
    w, h = photos.shape

    new = np.empty((w, h, 3), dtype=photos.dtype)

    new[:,:,2] = new[:,:,1] = new[:,:,0] = photos
    # or with broadcasting
    new[:,:,:] = photos[:,:, np.newaxis]
    # print(new.shape)
    jetcam = (np.float32(heatmap) + new) / 2
    cv2.imwrite(path_image_jpg, np.uint8(jetcam))

def grad(model_gradcam,folder_part,path_gradcam_folder,path_output_gradcam,img_width,img_height):
    path_output_jpg = path_output_gradcam +"jpg"
    path_output_dcms = path_output_gradcam +"dcm/"+folder_part
    photos = list()
    folder_path = path_gradcam_folder+"dcm/"+folder_part+"/"
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

        src_fname = "images"+str(n)
        print(path_output_dcms)
        path_image_jpg = os.path.join(path_output_jpg, os.path.basename(src_fname)+'.jpg')
        path_image_dcm = os.path.join(path_output_dcms , os.path.basename(src_fname)+'.dcm')
        grad_cam(model_gradcam,photos,path_image_jpg,img_width,img_height)
        save_image.save_images_dcm(photo,path_image_jpg,path_image_dcm )
