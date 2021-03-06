import {BaseController} from "./baseController";
import User from "../database/models/user";
import Student from "../database/models/student";
import nodemailer from 'nodemailer';
import {config} from '../config/';
import {genRandomString} from '../services/passwordGenerator';
import ClassModel from '../database/models/class';
import TCSR from '../database/models/teacherClassSubject'

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
    const parents = await User.searchUsersBySSN(ssn);

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
    res.send(parent); 
  }

  async addStudent(req, res) {
        
    let parent1;
    let parent2;
    let parent1Insert = false;
    let parent2Insert = false;
    let parent1Password, parent2Password = null;

    try {

      if (!req.body.hasOwnProperty('firstParent')) {
        res.status(422).send({ success: false, error: 'Missing first parent' });
        return;
      } else {
        if (!req.body.firstParent.hasOwnProperty('ID')) {
          parent1Password = genRandomString(8);
          parent1 = (await User.insertParentData(
            req.body.firstParent.FirstName,
            req.body.firstParent.LastName,
            req.body.firstParent.Email,
            req.body.firstParent.SSN,
            parent1Password
          )).id;
          parent1Insert = true;
        } else {
          parent1 = req.body.firstParent.ID;
          await User.makeParentIfNotAlready(parent1);
        }
      }
      if (req.body.hasOwnProperty('secondParent')) {
        if (!req.body.secondParent.hasOwnProperty('ID')) {
          parent2Password = genRandomString(8);
          parent2 = (await User.insertParentData(
            req.body.secondParent.FirstName,
            req.body.secondParent.LastName,
            req.body.secondParent.Email,
            req.body.secondParent.SSN,
            parent2Password
          )).id;
          parent2Insert = true;
        } else {
          parent2 = req.body.secondParent.ID;
          await User.makeParentIfNotAlready(parent2);
        }
      } else {
        parent2 = null;
      }


      const result = await Student.insertStudent(
        req.body.studentInfo.FirstName,
        req.body.studentInfo.LastName,
        req.body.studentInfo.SSN,
        req.body.studentInfo.Gender,
        req.body.studentInfo.BirthDate,
        parent1,
        parent2
      );

      if(parent1Insert) {
        this.sendEmailToUser(req.body.firstParent.Email, parent1Password, req.body.firstParent.FirstName, req.body.firstParent.LastName);
      }

      if (parent2Insert) {
        this.sendEmailToUser(req.body.secondParent.Email, parent2Password, req.body.secondParent.FirstName, req.body.secondParent.LastName);
      }

      res.send({success:true, id: result.id});

    } catch(error) {
      console.log(error)
      if (parent1Insert) {
        await User.remove(parent1);
      }
      if (parent2Insert) {
        await User.remove(parent2);
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

  async insertInternalAccount(req, res) {
    const password = genRandomString(8);
    const result = await User.insertInternalAccountData(
      req.body.firstName,
      req.body.lastName,
      req.body.eMail,
      req.body.SSN,
      password,
      req.body.isTeacher,
      req.body.isAdminOfficer,
      req.body.isPrincipal
    );
    this.sendEmailToUser(req.body.eMail, password, req.body.firstName, req.body.lastName);

    res.send({success:true, id: result.id});

  }
    
  async getClasses(req, res) {
    const classes = await ClassModel.getClasses({
      page: req.query.page, pageSize: req.query.pageSize
    });

    res.send(classes);
  }

  async getTeachers(req, res) {
    const teachers = await User.getTeachers(req.query.coordinators);
    res.send(teachers);
  }

  async assignStudentsToClass(req, res) {
    const classID = req.params.classID;
    const students = req.body.students;

    if (!students || !students.length) {
      throw new Error('Empty or invalid students list.');
    }
    
    const results = await ClassModel.assignStudentsToClass(classID, students);
    
    res.send(results);
  }

  async updateAssignmentStudentsToClass(req, res) {
    const studentId = req.params.studentId;
    const classId = req.query.classId;

    if (!studentId) {
      throw new Error('Missing or invalid studentId parameter');
    }

    if (!classId) {
      throw new Error('Missing or invalid classId parameter');
    }

    //check if class id exists
   await ClassModel.findById(classId);
   
    const results = await Student.update(studentId, {
      ClassId: classId
    });
    
    res.send({success: results});
  }

  async removeAssignmentStudentsToClass(req, res) {
    const studentId = req.params.studentId;

    if (!studentId) {
      throw new Error('Missing or invalid studentId parameter');
    }

    //check if class id exists
    
    const results = await Student.update(studentId, {
      ClassId: null
    });
    
    res.send({success: results});
  }

  async deleteAccount(req, res) {
    const result = await User.deleteAccount(req.body.ID);
    res.send(result);
  }

  sendEmailToUser(parentEmail, parentPassword, parentName, parentSurname){
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

  async updateInternalAccount(req, res) {
    const result = await User.editInternalAccount(
      req.body.Id,
      req.body.FirstName,
      req.body.LastName,
      req.body.eMail,
      req.body.SSN,
      req.body.isTeacher,
      req.body.isAdminOfficer,
      req.body.isPrincipal
    ); 
    res.send({success: result})
  }

  async removeStudent(req, res) {
    const student = await Student.findById(req.body.ID);
    if (student.ClassId != null) {
      res.send({
        success: false,
        msg: 'Only students not assigned to classes can be removed'
      });
      return;
    }
    
    await Student.remove(req.body.ID);
    await User.checkIfStillParent(student.Parent1);
    if (student.Parent2) {
      await User.checkIfStillParent(student.Parent2);
    }      
    res.send({success: true});
  }

  async createClass(req, res) {
    const result = await ClassModel.createClass(req.body.coordinatorId);
    res.send({
      success: true,
      id: result.id
    });
  }

  async deleteClass(req, res) {
    const result = await ClassModel.deleteClass(req.body.id);
    res.send({success: result});
  }

  async createTeacherClassAssociation(req, res) {
    const result = await TCSR.createNew(req.body.teacherId, req.body.CSPairs);
    res.send({
      success: true,
      newRecords: result.newRecords
    });
  }

  async getAllTeacherClassAssociations(req, res) {
    const result = await TCSR.findAll(req.query.pagination);
    res.send(result);
  }

  async deleteTeacherClassAssociation(req, res) {
    if(!req.body.id) {
      throw new Error('Missing or invalid id');
    }
    await TCSR.findById(req.body.id);
    try {
      await TCSR.remove(req.body.id);
    } catch (error) {
      throw new Error('Cannot remove association if teacher has assigned topics');
    }    
    res.send({success: true});
  }
  
}

export default new AdminController();
