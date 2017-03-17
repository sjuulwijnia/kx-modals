# Developing
Make sure you have linked the dist/ folder that results from running *npm run build* using *npm link*, otherwise the demo (your 'testing grounds') won't be able to run with your latest changes. Don't know how to? Follow the following steps:
* Go to the project root using a command line tool.
* Run *npm run build* and wait for it to complete.
* Navigate to the dist/ folder using *cd dist*.
* Run *npm link* and wait for it to complete.
* Navigate to the project root (use *cd ..*).
* Run *npm link kx-modals* and wait for it to complete.
* You can now use *import { ... } from 'kx-modals';* in the demo files.