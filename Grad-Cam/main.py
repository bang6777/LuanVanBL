from source import load_data_human
from source import model
from tensorflow import keras
from keras import backend as K
from source import model_train
from source import model_test

def main():
    folder_path = './dataset/'
    objects = ["Hip","Head","Knee","Pelvis","Shoulder"] 
    data_train,data_label =list(), list()
    # data_train,data_label = load_data_human.load_folder(folder_path)
    # print(data_label)
    # img_width=data_train[0].shape[0]
    # img_height=data_train[0].shape[1]
    img_width, img_height = 512,512
    # if K.image_data_format() == 'channels_first':
    #     input_shapes = (1, img_width, img_height)
    # else:
    #     input_shapes = (img_width, img_height, 1)
    # models = model.define_model(input_shapes)
    # models.compile(loss=keras.losses.categorical_crossentropy, optimizer=keras.optimizers.Adam(),metrics=['accuracy'])
    # models.summary()
    # model_train.train(models,data_train,data_label, img_width, img_height)
    model_test.predict(img_width, img_height)
    


if __name__ == '__main__':
    main()