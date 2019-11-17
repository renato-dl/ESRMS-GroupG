## USE CASE 1: Show registered parents ##

- **Scope**: web app section of admin
- **Level**: User-goal
- **Intention in context**: the admin wants to see the information of the registered parents.
- **Primary actor**: admin
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The admin would like to visualize the information of registered parents he has inserted as easily and clearly as possible.
- **Precondition**: the server and database must be set correctly, the admin account must be configured in order to see the registered parents.
- **Success guarantee**: the admin visualizes clearly and easily the data of registered parents.
- **Main Success Scenario**: 
  1. The admin enters his personal page.
  2. The admin accesses the section with registered parents data.
  3. The webpage shows all the data of registered parents.
- **Extensions**:
  - There are not registered parents, so an empty list is shown.
  
 ## USE CASE 2: Insert a new parent ##

- **Scope**: web app section of admin
- **Level**: User-goal
- **Intention in context**: the admin wants to register a new parent.
- **Primary actor**: admin
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The admin would like to register a new parent as easily and clearly as possible.
- **Precondition**: the server and database must be set correctly, the admin account must be configured in order to do the insertion.
- **Success guarantee**: the admin registers the new parent clearly and easily.
- **Main Success Scenario**: 
  1. The admin enters his personal page.
  2. The admin specifies the parents data and confirms the insertion.
  3. The webpage shows that the new parent is registered.
- **Extensions**:
  - The parent is not registered, because of missing or invalid data during the insertion.
  
 ## USE CASE 3: Send e-mail to registered parent ##
  
- **Scope**: web app section of admin
- **Level**: User-goal
- **Intention in context**: the admin wants to send an e-mail to a registered parent.
- **Primary actor**: admin
- **Secondary actor (s)**: none
- **Stakeholder's interest**:
  - The admin would like to send an e-mail to the registered parent as clearly and easily as possible.
- **Precondition**: the server and database must be set correctly, the admin account must be configured in order to send e-mails. 
- **Success guarantee**: the admin sends correctly an e-mail to a registered parent.
- **Main Success Scenario**: 
  1. The admin enters his personal page.
  2. The admin specifies whom parent to send the e-mail to and confirms the operation.
  3. The webpage shows that an e-mail to that parent has been sent.
- **Extensions**:
  - The e-mail is not sent correcly, due to fake email inserted during the registraton phase.
  
