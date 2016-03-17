Choosing My Very First Open Source Project
===================

Having never contributed to an open source project before they are initially quite intimidating. I think what I find most intimidating about contributing to open source projects is that they often consist of large communities of people which can make interacting seem daunting, even if everyone is nice.   
	
The open source project I chose is called HospitalRun, it is an electronic medical records, EMR, system meant to help developing countries improve their health care organization. HospitalRun is done in collaboration with CURE International and is used in CURE hospitals. It is a relatively new project, which means the community is smaller, however they have still accomplished a lot. I have worked on EMR systems as a user here in Canada and it really made me realize the importance of having access to a patients medical history, especially if they have had encounters with doctors at different hospital or clinic locations.   

Besides being an interesting project I chose HospitalRun as my open source project for computer science 395 as they have tagged some of their issues with “help wanted” which makes it easy to identify important problem areas. This tag also gives new contributors a good starting point if they are feeling overwhelmed.  Another aspect of the project that made it seem inviting was that the have a Contributing guide, which helps take some of the guess work out of how to be a productive community member, especially if it is your first time participating in an open source project.

I followed the installation instructions found in README.md in the repository.

At step 2.i I needed root access install npm. Subsequently every time I installed something with npm I needed root access, this can be solved by stating at 2.i. 
>That depending on your permission settings installation with `npm install -g` may require root access, if you do require root access you will require it for all subsequent steps that use `npm install -g`

This is a very minor issue and easy to figure out on your own as the command line gives you an error and tells you that you must be in root. They have stated in other rules, steps 3 and 5, that you may need to be in root. This can be misleading so stating it the first time some one encounters  `npm install -g` removes any ambiguity.

I did not run the make commands before I completed the installation. Running make serve even after you followed the earlier instructions while act the same as running  `npm start`. **Article 1a** shows the command line results when the server is running. I thought it nice that they give the build time in the command line as it does take a few seconds. 

The community interacts using the comments section in githubs issues, which is where they assign people issues to fix and also discuss the requirements to determine if it has been fixed. **Article 2a** shows my interaction with them in the comments section as I asked if I could have responsibility for a small design issue. I picked the issue because it did not look too challenging and I did not want to overwhelm myself the first time I contribute. They replied quickly and told me what they expected it to look like once it was fixed. The community also interacts on their own slack channel which has several chats you can follow. Slack is where people ask questions if they are having issues. The community seems very welcoming and I hope to interact with them more as I continue to contribute to the project. 