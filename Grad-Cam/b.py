import pydicom
from matplotlib import pyplot as plt
from pydicom.pixel_data_handlers.util import apply_voi_lut
from pydicom.data import get_testdata_files
from numpy import savetxt
import numpy as np
import os
from PIL import Image
import cv2
# image = pydicom.dcmread('./dataset/test_set_dcm/vhf.1446.dcm')
folder_path_test = './test_gray/'
objects = ["trauma","vhf"] 
data=list()
path_output_dcm = "./Output_dcm/"
path_output_jpg = "./Output_jpg/"
os.mkdir(path_output_dcm)
os.mkdir(path_output_jpg)
def load_folder(folder_name):
    photos = list()
    images_path = os.listdir(folder_name)
    for n,images in enumerate(images_path):
        files = folder_name + images
        print(files)
        photo = pydicom.dcmread(files)
        # convert to a numpy arrays
        src_fname_jpg = "images"+str(n)
        path_image_jpg = os.path.join(path_output_jpg, os.path.basename(src_fname_jpg)+'.jpg')
        path_image_dcm = os.path.join(path_output_dcm , os.path.basename(src_fname_jpg)+'.dcm')
        save_images_jpg(photo,path_image_jpg)
        save_image_dcm(photo,path_image_jpg,path_image_dcm )
# filename = get_testdata_files('CT_small.dcm')[0]
# image = pydicom.dcmread(filename)

def save_images_jpg(image,path_output):
    test_image = image.pixel_array
    print(test_image.shape)
    img_2d = test_image.astype(float)

    # Step 2. Rescaling grey scale between 0-255
    img_2d_scaled = (np.maximum(img_2d, 0) / img_2d.max()) * 255.0

    # Step 3. Convert to uint
    img_2d_scaled = np.uint8(img_2d_scaled)
    # print(img_2d_scaled)
    # print(img_2d_scaled.dtype)
    # print(img_2d_scaled.shape)
    # print(img_2d_scaled)
    # out = apply_voi_lut(test_image, image, index=0)
    for x in range(0,img_2d_scaled.shape[0]):
        for y in range(0,img_2d_scaled.shape[1]):
            if(img_2d_scaled[x][y] < 150):
                img_2d_scaled[x][y] = 0
            # print("hello",img_2d_scaled[x][y])
    cv2.imwrite(path_output, img_2d_scaled)
    # savetxt('data.csv', img_2d_scaled, delimiter=',')
    # plt.imshow(img_2d_scaled,cmap='gray')
    # plt.show()

def save_image_dcm(image,path_output_jpg,path_output):
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

load_folder(folder_path_test)