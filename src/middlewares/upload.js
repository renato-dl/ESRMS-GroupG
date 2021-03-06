import multer from 'multer';
import { genRandomString } from '../services/passwordGenerator';
import { validateFileType } from "../services/uploadFilesService";

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, callback) {
    const genString = genRandomString(16) + file.originalname;
    callback(null, genString);
  },
});

const multerUpload = multer({
  storage, 
  fileFilter: (req, file, cb)  => {
    const isValidType = validateFileType(file.mimetype);
    if(!isValidType) {
      return cb (new Error("Allowed file types are: PDF, DOC, DOCX, JPG, JPEG"), false);
    }

    cb(null, true);
  },
  limits : { fileSize: 5*1024*1024 },
});

export const UploadMiddleware = {
  single: (req, res, next) => multerUpload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(422).send({ msg: err.message });
    }

    next();
  }),
  multiple: (numberOfFiles) => (req, res, next) => multerUpload.array('files', numberOfFiles)(req, res, (err) => {
    if (err) {
      return res.status(422).send({ msg: err.message });
    }

    next();
  })
}
