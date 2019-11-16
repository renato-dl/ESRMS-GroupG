## USE CASE 1: Visualization of inserted topics ##

- **Scope**: web app section of teacher
- **Level**: User-goal
- **Intention in context**: the teacher wants to see the topics she has inserted for a subject in a class
- **Primary actor**: teacher
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The teacher would like to see the topics she has inserted as easily and clearly as possible
- **Precondition**: the server and database must be set correctly, the teacher account must be configured in order to see the inserted topics.
- **Success guarantee**: the teacher visualizes clearly and easily the inserted topics.
- **Main Success Scenario **: 
  1. The teacher enters her personal page.
  2. The teacher specifies the class and the subject names
  3. The teacher confirms her choice.
  4. The webpage shows the list of the inserted topics for that subject and class.
- **Extensions**:
  - There are not inserted topics for that subject and class, so an empty list is shown.

## USE CASE 2: Insertion of a topic

- **Scope**: web app section of the teacher
- **Level**: User-goal
- **Intention in context**: the teacher wants to add a new topic for a subject in a class
- **Primary actor**: teacher
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The teacher would like to add a new topic as easily and clearly as possible.
- **Precondition**: the server and database must be set correctly, the teacher account must be configured in order to add a new topic.
- **Success guarantee**: the teacher can add clearly and easily a new topic.
- **Main Success Scenario **: 
  1. The teacher enters her personal page.
  2. The teacher chooses the class and subject.
  3. The teacher specifies the title, description and the date of the topic.
  4. The teacher confirms the inserted data.
  5. The server stores the data in the database.
- **Extensions**:
  - The topic is not inserted, because of missing or invalid data during the insertion.



## USE CASE 3: Editing of a topic

- **Scope**: web app section of teacher
- **Level**: User-goal
- **Intention in context**: the teacher wants to edit the topic she has inserted for a subject in a class
- **Primary actor**: teacher
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The teacher would like to edit a topic she has inserted as easily and clearly as possible.
- **Precondition**: the server and database must be set correctly, the teacher account must be configured in order to edit the topic.
- **Success guarantee**: the teacher can edit clearly and easily the inserted topics.
- **Main Success Scenario **: 
  1. The teacher enters her personal page.
  2. The teacher specifies the class and the subject
  3. The teacher chooses the topic to edit.
  4. The teacher chooses the new data and confirms
  5. The webpage shows the edited topic.
- **Extensions**:
  - The teacher does not specify correctly the new data, so the operation fails.
  - There are not topics for the specified class and subject to be edited.



