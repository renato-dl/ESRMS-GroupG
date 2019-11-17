## STORY 1 ##
**As a** *parent*

**I want** *to know the marks of my child*

**So that** *I can monitor his/her performance*

- **Use Case**: Show marks of a student
- **Scope**: School management
- **Level**: User-goal
- **Intention in context**: A parent of a student wants to see the marks their child received
- **Primary actor**: Parent
- **Secondary actor(s)**:
- **Stakeholders' interest**:
  - Parents would like to know the latest marks their children received as soon as the teacher gives them.
  - Teachers would like the parents to be informed about their children academic performance
- **Precondition**:
  - The parent must have an account in the system and the credentials provided by the school administration.
  - The child must be enrolled in school.
- **Success guarantees**: The parent is able to see all the marks their children received during the year.
- **Main Success Scenario**: 
  1. The parent enters her personal page.
  2. The system shows a list of children.
  3. The parent
    - selects a children from the list
    - selects the option for marks visualization
  4. The system shows a list of marks with respective subject and date, ordered by date.
- **Extensions**:
  * 2.a. The parent has one child:
    * 2a.1 The parent selects the option for marks visualization
    *   The use case continues from step 4

  * 4a. The student has no marks:
    * 4a.1 The system shows a message saying that there are no marks to show.

