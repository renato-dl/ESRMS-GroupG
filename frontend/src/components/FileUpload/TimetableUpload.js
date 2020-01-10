import React from 'react';
import Dropzone from 'react-dropzone';
import * as toastr from 'toastr';
import mime from 'mime';
import './FileUpload.scss';

export class TimetableUpload extends React.Component {
  defaultAccept = [mime.getType('xlsx')];

  onDropRejected = (files) => {
    toastr.error(files[0].name + ' is not valid. Please upload a [.xlsx] file under 5MB.');
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