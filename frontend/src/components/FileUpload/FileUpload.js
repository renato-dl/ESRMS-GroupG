import React from 'react';
import Dropzone from 'react-dropzone';
import * as toastr from 'toastr';
import mime from 'mime';
import './FileUpload.scss';

export class FileUpload extends React.Component {
  defaultAccept = [mime.getType('doc'), mime.getType('docx'), mime.getType('pdf'), mime.getType('jpeg'), mime.getType('jpg')];

  onDropRejected = (files) => {
    toastr.error(files[0].name + (this.props.errorMessage ? this.props.errorMessage : ' is not valid. Please upload a [.doc, .docx, .pdf, .jpg, .jpeg] file under 5MB.'));
  }

  render() {
    return (
      <Dropzone
        accept={this.props.accept || this.defaultAccept} 
        onDropAccepted={this.props.onDropAccepted}
        onDropRejected={this.onDropRejected}
        maxSize={5 * 1024 * 1024}
      >
        {({getRootProps, getInputProps, isDragAccept, isDragActive, isDragReject}) => {
          const classNames = ['file-upload'];
          if (isDragAccept) {
            classNames.push('accept');
          } else if (isDragReject) {
            classNames.push('reject');
          } else if (isDragActive) {
            classNames.push('active')
          }

          return (
            <section className="container">
              <div {...getRootProps({className: classNames.join(' ')})}>
                <input {...getInputProps()} />
                <b>Drag 'n' drop a file(s) here, or click to select</b>
              </div>
            </section>
          );
        }}
      </Dropzone>
    );
  }
}