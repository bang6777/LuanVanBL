from keras.models import load_model
from sklearn.metrics import classification_report, multilabel_confusion_matrix
import numpy as np   
from source import load_data_human
def predict(img_width,img_height):
    model = load_model('./model/model.h5')
    test_image,test_label = load_data_human.load_folder('./datatest/')
    test_image = test_image.reshape(test_image.shape[0],img_width,img_height,1)
    print("result")
    result = model.predict(test_image)
    print(result)
    result = np.argmax(result, axis=1)
    print(test_label)
    print(result)
    label = multilabel_confusion_matrix(test_label,result)
    objects = ["Hip","Head","Pelvis","Shoulder"]  
    print(label)
    print(classification_report(test_label,result, target_names=objects))