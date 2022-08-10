const jsdom = require("jsdom");

const { Client } = require("pg");
const DB_NAME = "fallout";
const DB_URL =
  process.env.DATABASE_URL || `postgres://postgres@localhost:5432/${DB_NAME}`;
const client = new Client(DB_URL);

async function createUser(string) {
    try {
      const {
        rows: [users],
      } = await client.query(
        `
      INSERT INTO users(info)
      VALUES ($1)
      RETURNING *
      `,
        [string]
      );
      console.log(users)
      return users;
    } catch (error) {
      throw error;
    }
  }

async function getAllUsers() {
    try {
      const { rows } = await client.query(
        `
        SELECT * FROM users 
      `
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }

async function getUserByUsername(username) {
    try {
      let a
      let count = 0
      const { rows } = await client.query(
        `
        SELECT * FROM users 
      `
      )
      while(rows[count] !== undefined){
       let text = rows[count].info
       let xmlDoc = new jsdom.JSDOM(text);
       if(xmlDoc.window.document.querySelector("username").textContent === username){
        a = rows[count]
       }
       count = count + 1
      }
      console.log(a)
      return a
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(id, string) {
    try {
      const {
        rows: [user],
      } = await client.query(
        `
        UPDATE users 
        SET info=$2 
        WHERE id=$1 
      `,
        [id, string]
      );
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    client,
    getAllUsers,
    createUser,
    getUserByUsername,
    updateUser
  }