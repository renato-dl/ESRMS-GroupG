import mime from 'mime'

export function validateFileSize(size){
  const maxSize = 5*1024*1024;
  if(size > maxSize){
    return false;
  }
  return true;
}

export function validateFileType(type){
    if (type === mime.getType("pdf")){
      return true;
    }
    if (type === mime.getType("doc")){
      return true;
    }
    if (type === mime.getType("docx")){
      return true;
    }
    return false;
}