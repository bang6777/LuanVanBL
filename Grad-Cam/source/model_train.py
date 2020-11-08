from numpy import asarray
from numpy import save
import numpy as np                                                                                                                                                                                                                
from tensorflow import keras
from keras import backend as K
import tensorflow as tf
from sklearn.model_selection import KFold
from sklearn.model_selection import StratifiedKFold 
import pandas as pd
def train(model,data_train,data_label, img_width, img_height):
    epochs = 10
    skf = StratifiedKFold(n_splits=10)
    for train_index, test_index in skf.split(data_train,data_label):
        print("TRAIN:", train_index, "TEST:", test_index)
        x_train, x_test = data_train[train_index], data_train[test_index]
        y_train, y_test = data_label[train_index], data_label[test_index]
        num_of_train_samples = x_train.shape[0]
        num_of_test_samples = x_test.shape[0]
        x_train=x_train.reshape(num_of_train_samples,img_width,img_height,1)
        x_test=x_test.reshape(num_of_test_samples,img_width,img_height,1)
        y_train = tf.keras.utils.to_categorical(
            y_train, num_classes=5, dtype='float32'
        )
        y_test = tf.keras.utils.to_categorical(
            y_test, num_classes=5, dtype='float32'
        )
        model.fit(x_train,y_train, batch_size=8,epochs=epochs,validation_data=(x_test, y_test))
        # save model
        model.save('./dataset/model.h5')

