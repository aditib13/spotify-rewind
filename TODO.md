# TODO
+ make client id/secret environment variables DONE
- make client id secret reactjs
- multiple years
+ fix uri list DONE
+ error when empty fields DONE
+ error when more genres than num songs DONE
- error: only integer in year num
- style
- refresh token
- change url when on heroku (localhost on here and spotify)
- urls shouldn't be long
- add confirmation page: include link
- fix design
- good website designs with gradients


# how to add package to requirements.txt
- source venv/bin/activate
- pip freeze > requirements.txt

add to requirements somehow
- yarn add react-select
- npm install react-router-dom
- npm install universal-cookie
- npm install react-promise-tracker --save



# bugs
- setAccessToken re-renders the page and doesn't execute the code after it
- global variables outside a function don't seem to get reset if used inside functions


"scripts": {
    "start": "react-scripts start",
    "start-api": "cd backend && venv/bin/flask run",
    "build": "react-scripts build",
    "test": "react-scripts test"š
    "eject": "react-scripts eject"
  },