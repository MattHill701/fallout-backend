// code to build and initialize DB goes here
const { user } = require("pg/lib/defaults");
const {
  client,
  getAllUsers,
  createUser,
  getUserByUsername
} = require("./functions");



async function dropTables() {
  try {
    console.log("starting to drop tables");
    await client.query(`
    DROP TABLE IF EXISTS users;
    `);

    console.log("finished dropping tables");
  } catch (error) {
    console.log("error building tables");
    throw error;
  }
}

async function buildTables() {
  try {
    console.log("Starting to build tables");
    await client.query(`

      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        info TEXT UNIQUE NOT NULL
      );
    `);

    // build tables in correct order
    console.log("finished building tables");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Trying to create users...");
    const userOne = await createUser(
        `<user>
  <username>matt</username>
  <password>matt</password>
  <characters>
     <character>
       <name>Matt</name>
       <age>20</age> 
       <gender>Male</gender> 
       <special>
         <strength>4</strength>
         <perception>4</perception>
         <endurance>5</endurance>
         <charisma>7</charisma>
         <intelligence>8</intelligence>
         <agility>7</agility>
         <luck>5</luck>
       </special>
       <traits>
         <trait>Small Frame</trait>
         <trait>Fast Shot</trait>
       </traits>
       <skills>
         <skill>Unarmed</skill>
         <skill>Sneak</skill>
         <skill>Speech</skill>
       </skills>
    </character>
  </characters>
</user>`
    );
    const userTwo = await createUser(
        `<user>
  <username>jake</username>
  <password>jake</password>
  <characters>
  </characters>
</user>`
    );
    console.log("Success creating users!");
    return [userOne, userTwo];
  } catch (error) {
    console.error("Error while creating reports!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await buildTables();
    await createInitialUsers();
  } catch (error) {
    console.log("error during rebuildDB");
    throw error;
  }
}


rebuildDB()
  .catch(console.error)
  .finally(() => client.end());