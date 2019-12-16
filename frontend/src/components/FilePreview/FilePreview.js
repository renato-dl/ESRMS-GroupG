import React from 'react';
import "./FilePreview.scss";
import { Icon, Button } from 'semantic-ui-react';

export const FilePreview = (props) => (
  <div className="file-container">
    <div className="file">
      <div className="file-name">
        <span>{props.name}</span>
      </div>
      <div className={`file-preview ${props.type}`}>
        <span>{props.type}</span>
      </div>
    </div>
    <div className="buttons">
      {props.onRemove && 
        <Button size="tiny" basic color="red" onClick={props.onRemove}>
          <Icon name="remove" /> Remove
        </Button>
      }
      {props.onDownload && 
        <Button size="tiny"  positive onClick={() => props.onDownload(props.name)}>
          <Icon name="download" />
          Download
        </Button>
      }
    </div>
  </div>
);
