import React from 'react';
import Table from 'react-bootstrap/Table'
import { AiFillCheckCircle } from 'react-icons/ai'


function Home() {
  return (
      <div className="App">
          <h1 className="App-header">
              <p>Home</p>
          </h1>
          <p>
              Welcome to the T&P bot admin site. This is where you can preform
              certain actions such as looking at play and game data, make
              bot/website suggestions, and upload your own sound clips!
          </p>
          <p>
              This project is a WIP so expect it to change frequently. Please report bugs to Rollin on discord.
          </p>
          <Table className="text-white w-25" size="sm">
              <thead>
                  <td>View sound data</td>
                  <td><AiFillCheckCircle size={35}/></td>
              </thead>
              <thead>
                  <td>Upload sound clips</td>
                  <td><AiFillCheckCircle size={35}/></td>
              </thead>
              <thead>
                  <td>View bot collected data</td>
                  <td></td>
              </thead>
              <thead>
                  <td>Submit suggestions (for now msg Rollin)</td>
                  <td></td>
              </thead>
              <thead>
                  <td>Polish the looks</td>
                  <td></td>
              </thead>
              <thead>
                  <td>Add Discord Auth (following will req this)</td>
                  <td></td>
              </thead>
              <thead>
                  <td>Profile page where you can edit how the bot interacts with you</td>
                  <td></td>
              </thead>
              <thead>
                  <td>Permissions for features</td>
                  <td></td>
              </thead>
          </Table>
      </div>
  );
}

export default Home;
