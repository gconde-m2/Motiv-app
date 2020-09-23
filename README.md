# Motiv
## https://ih-motiv-app.herokuapp.com/
![alt text](public/images/Screenshot%202020-09-20%20at%2015.30.48.png?raw=true "Logo Title Text")
- Nombre del proyecto : Motiv
- Version: 0.1.0 (Alpha)
- Autores: Gabriela Casero y Guillermo Conde
- Descripcion: Aplicación que te recuerda tus metas y te motiva a conseguirlas.

# Routes

| Route        | Working | Function                                           |
|--------------|---------|----------------------------------------------------|
| /            | YES     | Landing page/Login                                 |
| /registro    | YES     | Register page/Redirect to login                    |
| /main        | YES     | Main user page / redirect to Goals/Set aim/Profile |
| /main/goals  | HALF    | Where you can see your goals/                      |
| /main/setaim | HALF    | Where you create your goals/                       |
| /main/perfil | HALF    | You can change your profile/goals                  |





## How to install and run it!

- Run `npm i` on the root directory
- Create a `.env` file on the root directory to populate the database (`DB`) and port (`PORT`)
- Run `npm run dev` command on the root directory
