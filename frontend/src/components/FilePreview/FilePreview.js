import React from 'react';
import "./FilePreview.scss";
import { Icon, Button } from 'semantic-ui-react';
import Tooltip from '../Tooltip/Tooltip';


export const FilePreview = (props) => (
  <div className="file-container">
    <div className="file">
      <div className={`file-preview ${props.type}`}>
        <span>{props.type}</span>
      </div>
      <div className="file-name">
        <span>{props.name}</span>
      </div>
    </div>
    <div className="buttons">
      <Button style={{position: 'absolute', visibility: 'hidden', top: 0}} />
      {props.onRemove && 
        <Tooltip 
          text="Remove file"
          trigger={
            <Icon name="remove" onClick={() => props.onRemove(props.name)} className="icon remove" />
          }
        />
      }
      {props.onDownload && 
        <Tooltip 
          text="Download file"
          trigger={
            <Icon name="download" onClick={() => props.onDownload(props.fileKey)} className="icon download" />
          }
        />
      }
    </div>
  </div>
);
