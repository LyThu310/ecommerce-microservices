export class User {
  constructor({
    uid = null,
    username,
    password,
    email,
    phone,
    roleid
  }) {
    this.uid = uid;
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.roleid = roleid;
  }
}