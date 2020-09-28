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
objects = ["trauma", "vhf"]
x_test, y_test = list(), list()
images_path = os.listdir(folder_path_test)


def load_folder(folder_name):
    photos, labels = list(), list()
    for n, images in enumerate(images_path):
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
    photos = asarray(photos).astype(np.float64)
    labels = asarray(labels).astype(np.float64)
    return photos, labels

# x_test,y_test = load_folder(folder_path_test)
# img_width=x_test[0].shape[0]
# img_height=x_test[0].shape[1]

# x_test=x_test.reshape(x_test.shape[0],img_width,img_height,1)
# #test
# test_loss, test_acc = model.evaluate(x_test, y_test, verbose=2)


# print("test loss",test_loss)
# print("test acc",test_acc)
H, W = 512, 512
image = pydicom.dcmread('./dataset/test_set_dcm/trauma0451.dcm')
test_image = image.pixel_array
test_image = asarray(test_image).astype(np.float64)
test_image = test_image.reshape(1, H, W, 1)
# result = model.predict(test_image)
# print("class",result)
# if result[0][0] == 0:
#     prediction = 'trauma'
# elif result[0][0] ==1:
#     prediction = 'shoulder'

# print(prediction)
# img_path= "./dataset/"


def grad_cam(input_model, image, cls, layer_name):
    """GradCAM method for visualizing input saliency."""
    y_c = input_model.output[0, cls]
    print(y_c)
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
    cam = cv2.resize(cam, (W, H), cv2.INTER_LINEAR)
    cam = np.maximum(cam, 0)
    print(cam)
    heatmap = cam / np.max(cam)
    # print(heatmap)
    cam_max = cam.max()
    if cam_max != 0:
        cam = cam / cam_max
    return cam, heatmap


print(model.get_layer(index=-1).name)
cls = -1
preprocessed_input = test_image
layer_name = "activation_4"
gradcam, heatmap = grad_cam(model, preprocessed_input, cls, layer_name)
test_image = test_image.reshape(512, 512, 1)
jetcam = cv2.applyColorMap(np.uint8(255 * gradcam), cv2.COLORMAP_JET)

jetcam = (np.float32(jetcam) + test_image) / 2
plt.imshow(np.uint8(jetcam))
plt.show()
cv2.imwrite('gradcam.jpg', np.uint8(jetcam))
im_frame = Image.open('gradcam.jpg')
print(im_frame.mode)
np_frame = np.array(im_frame.getdata(), dtype=np.uint8)
image.Rows = im_frame.height
image.Columns = im_frame.width
image.PhotometricInterpretation = "RGB"
image.SamplesPerPixel = 3
image.BitsStored = 8
image.BitsAllocated = 8
image.HighBit = 7
image.PixelRepresentation = 0
image.PixelData = np_frame.tobytes()
# image.SliceLocation = 1
image.save_as('result.dcm')
