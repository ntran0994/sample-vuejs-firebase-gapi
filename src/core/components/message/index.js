import ElementUI from 'element-ui';

class ShowMessage {
    success(message){
        ElementUI.Message({
            showClose: true,
            message,
            type: 'success',
            duration: process.env.SHOW_MESSAGE_DURATION
          });
    }
    
    error(message){
        ElementUI.Message({
            showClose: true,
            message,
            type: 'error',
            duration: process.env.SHOW_MESSAGE_DURATION
          });
    }
}

export default ShowMessage;