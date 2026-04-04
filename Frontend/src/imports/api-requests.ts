i want the code to change that adapts this functionality of the system (i want the code to have an api frontend request or send needed to the backend)

login credentials:
-Checks Email or ID and Password is matched (send a request to the backend if an email/ID and password is matched)
-if forget password, it will send an emal input to the backend so the backend will send an verification code to the email, then the staff will enter the verification code so that it will send back to the backend to verify if the code is correct. (the frotnend will send an email input from the backend and then backend will send a code to the email, then frontend will send an code input to the backend and the backend will send back to the frontend if its correct or no)

dashboard:
-display all of the patient list in the table (the frontend will send a request of all the patient of the database)
-clicking on patient row can show all of the information of the patient (it checks whenever the patient is 5 years old and below or 6 years old and above since both have different medical history, physical exam and immunization status tabs looks.) (the frontend will send a request to the backend to get the information of the patient) 
-have filters and advance filters that filter out the table.
-in edit mode of the patient, the staff can change the patient information and save that changes (the frontend will send request of the changes and also the old information before the changes with the timestamp of the changes so that the backend will update the patient database of the new changes and also put the old information to the patient archives database with the timestamp of the change) (tthe frontend will also send a request of adding this edit activity to the backend logbook activity database, with timestamp of that edit)

logbook activity:
-adds to the logbook everytime the staff did something in the system, from add record to edit record, and the patient name they add or edit will display and the timestamp that edit or add happened. (the fronend will request the of list of all logbook activity from the activity logbook database then the database will response with a list)

patient archive:
-everytime, a staff changes information to a patient, that old record of that patient will be added in the patient archives, and also display that record timeline from the first(new edit/new patient) all the way the date where the staff changes the patient information (end), it will display the date and the exact time. Clicking the patient willl show all of the information in that timeline (the frontend will request of the list of all the patient archives in the patient archives database, the frontend also will send a request from the backend to get that specific patient archive information.)

patient registration:
-this is where it will register new patients or Maternal Registration for already exiting female patient, when the staff clicked save, it will add that new patient/new maternal to the database (the frontend will send a request to the database of the new additional patient or a new maternal registration to the exisiting patient)

settings:
-it will display the staff full name, email address, role, and staff ID ( the frontend will send an request to get the information  of the staff)
-the staff can see their current email at the change email tab, the staff can change their email by putting their new email, verification it by sending a code to the new email so that the staff can enter the code, then after verification and save email, it will change the new email (the frontend will send a new email input to the backend so that the backend will send a verification code to that email, then the frontend will send the verification code input to the backend to check if the code is correct before the the backend will send back the frontend if its correct or no, then the backend will change the email to the new email.)
-the staff can change their password by putting their current password, enter their new password and confirm their new password (just input again their new password) and after that, theyy can save password and the frontend will send a request to the backend to change the password(the frontend will check if the new password is matched with the confirm new password before it will send a new password input to the backend so that the backend will change the password).