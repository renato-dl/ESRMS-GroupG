import {BaseController} from "./baseController";
import Parent from "../database/models/parent";
import nodemailer from 'nodemailer';
import {config} from '../config/';
import {genRandomString} from '../services/passwordGenerator';

class AdminController extends BaseController {


  async getParentData(req, res){
    const parents = await Parent.getParentData(
      {
        page: req.query.page,
        pageSize: req.query.pageSize
      });
      
    res.send(parents);
  }

  async insertParentData(req, res) {
    const password = genRandomString(8);

    const parent = await Parent.insertParentData(
      req.params.adminId,  
      req.body.firstName, 
      req.body.lastName, 
      req.body.eMail, 
      req.body.SSN, 
      password
    );
    this.sendEmailToParent(req.body.eMail, password, firstName, lastName);
    res.send(parent); 
  }

  sendEmailToParent(parentEmail, parentPassword, parentName, parentSurname){
    try{
      const emailService =  `${config.email.service}`;
      const senderEmail = `${config.email.sender_email}`;
      const senderPass = `${config.email.sender_psw}`; 
      const fullName = parentName + " " + parentSurname;
      var transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
          user: senderEmail,
          pass: senderPass
        }
      });
      var mailOptions = {
        from: senderEmail,
        to: parentEmail,
        subject: 'Welcome to ESRMS platform!',
        html: `<h3>Welcome to ESRMS platform! </h3> 
        <p>Dear ` + fullName + `, </p>
        <p>You have been granted access to ESRMS platform. </p>
        <p>Here is your first login password: <b>` +  parentPassword + `</b></p>
        <p>You will be asked to change it after your first access to the platform. </p>
        <p>Have a nice day, </p>
        <p>ESRMS Group G</p> `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Email not sent");
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    catch(e){
      console.log(e);
      //throw e; 
    }
    return;
  }
}

export default new AdminController();