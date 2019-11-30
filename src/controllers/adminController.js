import {BaseController} from "./baseController";
import User from "../database/models/user";
import Student from "../database/models/student";
import nodemailer from 'nodemailer';
import {config} from '../config/';
import {genRandomString} from '../services/passwordGenerator';
import ClassModel from '../database/models/class';

class AdminController extends BaseController {

  async getParentData(req, res){
    const parents = await User.getParentData(
      {
        page: req.query.page,
        pageSize: req.query.pageSize
      });
      
    res.send(parents);
  }

  async getParentsBySSN(req, res) {
    const ssn = req.query.ssn || '';
    const parents = await User.searchParentsBySSN(ssn);

    res.send(parents);
  }

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

  async addStudent(req, res) {
        
    let parent1;
    let parent2;
    let parent1Insert = false;
    let parent2Insert = false;

    if (!req.body.hasOwnProperty('firstParent')) {
      res.status(422).send({ success: false, error: 'Missing first parent' });
      return;
    } else {
      if (!req.body.firstParent.hasOwnProperty('ID')) {
        const password = genRandomString(8);
        parent1 = (await User.insertParentData(
          req.body.firstParent.FirstName,
          req.body.firstParent.LastName,
          req.body.firstParent.Email,
          req.body.firstParent.SSN,
          password
        )).id;
        parent1Insert = true;
        this.sendEmailToParent(req.body.firstParent.Email, password, req.body.firstParent.FirstName, req.body.firstParent.LastName);
      } else {
        parent1 = req.body.firstParent.ID;
      }
    }
    if (req.body.hasOwnProperty('secondParent')) {
      if (!req.body.secondParent.hasOwnProperty('ID')) {
        const password = genRandomString(8);
        parent2 = (await User.insertParentData(
          req.body.secondParent.FirstName,
          req.body.secondParent.LastName,
          req.body.secondParent.Email,
          req.body.secondParent.SSN,
          password
        )).id;
        parent2Insert = true;
        this.sendEmailToParent(req.body.secondParent.Email, password, req.body.secondParent.FirstName, req.body.secondParent.LastName);
      } else {
        parent2 = req.body.secondParent.ID;
      }
    } else {
      parent2 = null;
    }
    try {
      const result = await Student.insertStudent(
        req.body.studentInfo.FirstName,
        req.body.studentInfo.LastName,
        req.body.studentInfo.SSN,
        req.body.studentInfo.Gender,
        req.body.studentInfo.BirthDate,
        parent1,
        parent2
      );

      res.send({success:true, id: result.id});

    } catch(error) {
      if (parent1Insert) {
        await User.remove(parent1);
        throw(error);
      }
      if (parent2Insert) {
        await User.remove(parent2);
        throw(error);
      }
      throw(error);
    }
  }

  async updateParent(req, res) {
    console.log(req.body);
    const result = await User.updateParentData(
      req.body.Id,
      req.body.FirstName,
      req.body.LastName,
      req.body.Email,
      req.body.SSN
    );
    res.send({success: result.success});
  }

  async updateStudent(req, res) {
    let parent2;
    if(!req.body.hasOwnProperty('Parent2Id')){
      parent2 = null;
    }else{
      parent2 = req.body.Parent2Id;
    }
    const result = await Student.updateStudentData(
      req.body.Id,
      req.body.FirstName,
      req.body.LastName,
      req.body.SSN,
      req.body.Gender,
      req.body.BirthDate,
      req.body.Parent1Id,
      parent2
    );
    res.send({success: result.success})
  }
  
  async getStudentsData(req, res){
    let students;

    if(req.query.hasOwnProperty("classId")){
      students = await Student.getStudentsDataByClassId(req.query.classId);
      res.send(students);
      return;
    }
    if(req.query.hasOwnProperty("isAssigned")){
      let isAssigned;  
      if(req.query.isAssigned == 1){
        isAssigned = true;
      }else if(req.query.isAssigned == 0){
        isAssigned = false;
      }else{
        throw new Error("Invalid isAssigned parameter!");
      }

      students = await Student.getStudentsData(isAssigned, 
        {
          page: req.query.page,
          pageSize: req.query.pageSize
        }
      );
    }else{
      students = await Student.getStudentsWithParentsData(
        {
          page: req.query.page,
          pageSize: req.query.pageSize
        }
      );
    }
    res.send(students);
  }

  async getInternalAccountsData(req, res) {
    const internalAccounts = await User.findInternalAccounts({
      page: req.query.page,
      pageSize: req.query.pageSize
    });

    res.send(internalAccounts);
  }

  async getClasses(req, res) {
    const classes = await ClassModel.findAll({
      page: req.query.page,
      pageSize: req.query.pageSize
    })

    res.send(classes);
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
