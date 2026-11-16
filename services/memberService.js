const bcrypt = require('bcryptjs');

class Member {
  constructor(id, firstName, lastName, email, phone, passwordHash, role = 'member') {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    this.role = role;
    this.status = 'active';
    this.createdAt = new Date();
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const members = [];
let nextId = 1;

function findByEmail(email) {
  return members.find(m => m.email === email.trim().toLowerCase());
}

function getAllMembers() {
  return members;
}

async function registerMember({ firstName, lastName, email, phone, password }) {
  if (!firstName || !lastName || !email || !phone || !password) {
    throw new Error('All fields are required.');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  if (findByEmail(email)) {
    throw new Error('An account with that email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const member = new Member(
    nextId++,
    firstName.trim(),
    lastName.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    passwordHash
  );

  members.push(member);
  return member;
}

function findById(id) {
  return members.find(m => m.id === id);
}

async function authenticate(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  const member = findByEmail(email);
  if (!member) {
    throw new Error('Invalid email or password.');
  }
  const matches = await bcrypt.compare(password, member.passwordHash);
  if (!matches) {
    throw new Error('Invalid email or password.');
  }
  return member;
}

module.exports = { Member, registerMember, findByEmail, findById, authenticate, getAllMembers };