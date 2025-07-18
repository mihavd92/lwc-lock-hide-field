# Salesforce Field Masking Using LWC and Dynamic Forms
It's been a while since we built some fun little features in Salesforce. Why not fix that?

We received a task to implement an elegant way of masking a field that shouldn't be visible to all users. Of course, Salesforce offers plenty of standard tools for this, but we decided to do it our own way - using Lightning Web Components (LWC) and the capabilities of Dynamic Forms.

For example, on the Contact object, we have a field called Easter Egg, which we'll display only when needed. To achieve this, we'll create an additional Checkbox field - isPasswordCorrect.

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/55d4a9fd-f8b1-415f-ab2b-8f642b4366a4" />

Next, we update the Contact page to use Dynamic Forms and set a visibility condition for the Easter Egg field based on the value of the isPasswordCorrect field. 

<img width="800" height="auto" alt="image" src="https://github.com/user-attachments/assets/4b35e406-c780-4973-9849-6d368334a2a2" />

**Proceeding to create the LWC and Apex Controller<br />
Our component will have the following functionality:**

1️ A password input field. If the password is correct, we set the isPasswordCorrect to true, if it's incorrect - to false. The user password that grants access to the field can be stored in Custom Settings.

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/daecc5bb-e0a7-4491-9d0a-9600cdd74613" />

2️ The ability to manually hide the field when needed.

3️ The ability to set a password through a custom "admin panel". Access to it is granted after entering the Super Admin password (for simplicity, the password is hardcoded in Apex).

4️ Additional enhancements: uploaded 2 images to Static Resources that change depending on the situation: ✔️ Lock open ✖️ Lock closed

You can view the component code here: GitHub

**Functionality:**<br />
![Functionality](https://github.com/user-attachments/assets/5f6c136d-c82c-41a9-978d-7491be52b0fb)

Based on this task, we can see how a non-standard approach can be used to implement this functionality. Using LWC in combination with Dynamic Forms allows us to create flexible and user-friendly solutions that go beyond the standard capabilities of Salesforce. This approach makes it possible to control access to sensitive information without complex user permissions and security configurations.
