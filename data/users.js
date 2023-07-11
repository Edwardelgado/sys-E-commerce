import bcrypt from 'bcryptjs'

const users = [
   {
     name: "Admin",
     email: "admin@example.com",
     password: bcrypt.hashSync("123456",10),
     isAdmin: true,
   },
   {
    name: "Usuario1",
    email: "usuario1@example.com",
    password: bcrypt.hashSync("123456",10),
    },
  ];
  
  export default users;
  