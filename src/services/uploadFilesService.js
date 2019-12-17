import mime from 'mime'

export function validateFileSize(size) {
  const maxSize = 5*1024*1024;

  if (size > maxSize) {
    return false;
  }

  return true;
}

export function validateFileType(type) {
  const allowedFileTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg'];
  for (const allowdFileType of allowedFileTypes) {
    if (type === mime.getType(allowdFileType)) {
      return true;
    }
  }

  return false;
}