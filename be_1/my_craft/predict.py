import torch 
import cv2
import numpy as np
from my_craft import imgproc
from torch.autograd import Variable
from my_craft.craft import CRAFT
from  my_craft import craft_utils
from collections import OrderedDict

def copyStateDict(state_dict):
    if list(state_dict.keys())[0].startswith("module"):
        start_idx = 1
    else:
        start_idx = 0
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = ".".join(k.split(".")[start_idx:])
        new_state_dict[name] = v
    return new_state_dict

def predict(img,trained_model = './my_craft/weights/craft_mlt_25k.pth',device = torch.device('cuda'),link_threshold = 0.4,low_text = 0.4,text_threshold = 0.7):
    net = CRAFT().to(device)
    net.load_state_dict(copyStateDict(torch.load(trained_model, map_location=device)))
    net.eval()

    img_resized,target_ratio,_ = imgproc.resize_aspect_ratio(img,1280,interpolation = cv2.INTER_LINEAR,mag_ratio = 1.5)
    
    ratio_h = ratio_w = 1 / target_ratio
    x = imgproc.normalizeMeanVariance(img_resized)
    x = torch.from_numpy(x).permute(2,0,1)
    x = Variable(x.unsqueeze(0))

    x = x.to(device)

    with torch.no_grad():
        y,_ = net(x)
    score_text = y[0,:,:,0].cpu().data.numpy()
    score_link = y[0,:,:,1].cpu().data.numpy()

    boxes,_ =  craft_utils.getDetBoxes(score_text,score_link,text_threshold,link_threshold,low_text,True)
    boxes = craft_utils.adjustResultCoordinates(boxes,ratio_w,ratio_h)

    render_img = score_text.copy()
    render_img = np.hstack((render_img,score_link))
    
    res = []
    for box in (boxes):
        poly = np.array(box).astype(np.int32).reshape((-1))
        pos = (int(poly[0]),int(poly[2]),int(poly[1]),int(poly[5]))
        res.append(pos) 
        # cv2.imwrite(f'./res/this{cnt}.jpg',image[int(pos[1]):int(pos[5]),int(pos[0]):int(pos[2]),:])
        
    return res


    

