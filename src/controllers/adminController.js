import {BaseController} from "./baseController";
import User from "../database/models/user";
import Student from "../database/models/student";
import nodemailer from 'nodemailer';
import {config} from '../config/';
import {genRandomString} from '../services/passwordGenerator';

class AdminController extends BaseController {


  async getParentData(req, res){
    const parents = await User.getParentData(
      {
        page: req.query.page,
        pageSize: req.query.pageSize
      });
      
    res.send(parents);
  }

  /* DEPRECATED
  async insertParentData(req, res) {
    const password = genRandomString(8);

    const parent = await User.insertParentData(
      req.user.ID,  
      req.body.firstName, 
      req.body.lastName, 
      req.body.eMail, 
      req.body.SSN, 
      password
    );
    this.sendEmailToParent(req.body.eMail, password, req.body.firstName, req.body.lastName);
    res.send(parent); 
  }
  */

  async addStudent(req, res) {
        
    let parent1;
    let parent2;

    if (!req.body.firstParent.hasOwnProperty('ID')) {
      const password = genRandomString(8);
      parent1 = await User.insertParentData(
        req.body.firstParent.FirstName,
        req.body.firstParent.LastName,
        req.body.firstParent.Email,
        req.body.firstParent.SSN,
        password
      ).id;
      this.sendEmailToParent(req.body.firstParent.Email, password, req.body.firstParent.FirstName, req.body.firstParent.LastName);
    } else {
      parent1 = req.body.firstParent.ID;
    }
    if (req.body.hasOwnProperty('secondParent')) {
      if (!req.body.secondParent.hasOwnProperty('ID')) {
        const password = genRandomString(8);
        parent2 = await User.insertParentData(
          req.body.secondParent.FirstName,
          req.body.secondParent.LastName,
          req.body.secondParent.Email,
          req.body.secondParent.SSN,
          password
        ).id;
        this.sendEmailToParent(req.body.secondParent.Email, password, req.body.secondParent.FirstName, req.body.secondParent.LastName);
      } else {
        parent2 = req.body.secondParent.ID;
      }
    } else {
      parent2 = null;
    }

    res.send(await Student.insertStudent(
      req.body.studentInfo.FirstName,
      req.body.studentInfo.LastName,
      req.body.studentInfo.SSN,
      req.body.studentInfo.Gender,
      req.body.studentInfo.BirthDate,
      parent1,
      parent2
    ));

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