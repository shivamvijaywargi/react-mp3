# REACT MP3 / CSV

## Live Demo
https://react-mp3-mm7n.vercel.app/

## Features 
- User can upload single/multiple .mp3/.wav files to the website
- User can then preview the files uploaded to the system
- For mp3 files user can play, pause, stop, and loop the file using the control buttons
- User can upload a CSV file to the system and can preview it as soon as it is uploaded
- User can sort the data in the table
- There are certain validations for both the audio and CSV file
- Audio file must be only .mp3/.wav filetype and must be less than 3mb
- CSV file must contain appropriate required headers and should be less than 200kb
- Most of the errors are handled gracefully with appropriate message
- There is authentication and authorization in the system.
- User can register/login with email and password, Google, and Facebook.

## Improvements
- UI can be greatly improved
- Code can be restructured for better readability and maintainability
- Uploaded files can be stored to a database example firestore so that it can be persisted because as of now it is only in state and will be removed once the page is reloaded
- User logged in state can be identified with the help of firebase by creating a custom hook and calling firebase's function

## Local setup
- Clone the repo in to your system
- cd react-mp3
- pnpm i (or npm i)
- pnpm dev (or npm run dev)
