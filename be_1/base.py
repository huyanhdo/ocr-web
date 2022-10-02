from flask import Flask,request,send_file
from PIL import Image,ImageDraw,ImageFont
import io
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from my_craft.predict import predict
import numpy as np
from flask_cors import CORS
import cv2
api = Flask(__name__)
CORS(api)

config = Cfg.load_config_from_name('vgg_transformer')
config['weights'] = './weights/transformerocr.pth'
config['device'] = 'cuda:0'

detector = Predictor(config)

@api.route('/predict',methods = ['POST'])
def upload_image_api():
    if request.files.get("image"):
        image_file = request.files.get('image', '').read()
        image = Image.open(io.BytesIO(image_file))

        if np.array(image).shape[2] == 4:
            image = cv2.cvtColor(np.array(image), cv2.COLOR_BGRA2BGR)
            image = Image.fromarray(image) 

        res = image.copy()
        # print(np.array(res),np.array(res).shape)
        boxes = predict(np.array(image),link_threshold = 0.4)
        res1 = ImageDraw.Draw(res) 

        font_text = ImageFont.truetype( './font/arial.ttf',24, encoding="utf-8")
        for box in boxes:
            res1.rectangle(((box[0],box[2]),(box[1],box[3])),width = 3,outline='red')
            label = detector.predict(image.crop((box[0],box[2],box[1],box[3])))
            res1.text((box[0], box[2]),label,(0,0,255),font = font_text)
        res.save('./res/image.png')
        return {'status':200}

@api.route('/res',methods = ['GET'])
def get_res_api():
    return send_file('./res/image.png')