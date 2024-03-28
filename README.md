# Welcome to this Node JS & Express Js BackEnd project

<img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28"><img src="https://emojis.slackmojis.com/emojis/images/1531849430/4246/blob-sunglasses.gif?1531849430" width="28"/>

This project has been set up to help those who are new to **BackEnd** programming with **Javascript** in a **Node Js** environment. It has been organized following a few best practices such as the **MVC** design pattern, the **Camel case** naming convention, etc...

### Note

> This application is a simple blog API with role-based authentication.

## Overview of main technologies used

- **Express Js** : It's a Node Js Framework that helps us quickly set up an **API**. [Express Js Doc](https://expressjs.com/)
- **MongoDB** : This is our document-oriented NoSql database.
- **Passport Js** : It's our authentication middleware that integrates easily with Express Js. [Passport Js Doc](https://www.passportjs.org/)
- **Mongoose** : It's our middleware that makes it easy to manipulate entities in a database. [Mongoose Js Doc](https://mongoosejs.com/)

## Project installation

1.  Installation of dependencies : Open the terminal at the root of the project and type the command `yarn install` .
2.  Rename `sample.env` file to `.env` .
3.  Uncomment **environment variables** in the newly renamed `.env` file.
4.  Replace the value of `MONGOHQ_URL` environment variable in your `.env` file with the link to your **MongoDB database**.
5.  Return to the previously opened terminal and type command `yarn seed`
6.  Launch the project in **Dev mode** by typing the command `yarn dev`

### Note

> You can use this project as a basis exemple for getting started your backEnd
> projects with Node Js & Express Js
