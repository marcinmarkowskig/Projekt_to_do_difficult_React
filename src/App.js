import React, {Component} from 'react';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import { DB_CONFIG } from './Config/config';
import firebase from 'firebase/app'; //wpisuję odgórnie
import 'firebase/database';//wpisuję odgórnie
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('notes');

//We're going to setup the React state of our component.
    this.state = {
      notes: [],
    }
  }

  componentWillMount() {
    const previousNotes = this.state.notes;

    //DateSnapshot
    this.database.on('child_added', snap => {
      previousNotes.push ({
        id: snap.key,
        noteContent: snap.val().noteContent,
      })

      this.setState ({
        notes: previousNotes
      })
    })

    this.database.on('child_removed', snap => {
      for(var i = 0; i < previousNotes.length; i++) {
        if(previousNotes[i].id === snap.key) {
          previousNotes.splice(i,1);
        }
      }

      this.setState ({
        notes: previousNotes
      })
    })
  }

  addNote(note) {
    //push the note onto the notes array
  //  const previousNotes = this.state.notes;
  //  previousNotes.push({ id: previousNotes.length + 1, noteContent: note });
  //  this.setState ({
  //    notes: previousNotes
  //  })
    this.database.push().set({//id ustawi się automatycznie?
      noteContent: note
    });
  }

  removeNote(noteId) {
    this.database.child(noteId).remove();
  }

  render() {
    return (
      <div className="notesWrapper">
        <div className="notesHeader">
          <h1 className="heading">React & Firebase To-Do List</h1>
        </div>
        <div className="notesBody">
          {
            this.state.notes.map((note) => {
              return (
                <Note noteContent={note.noteContent} noteId={note.id} key={note.id} removeNote={this.removeNote}/>
              )
            })
          }
        </div>
        <div className="notesFooter">
          <NoteForm addNote={this.addNote} />
        </div>
      </div>
    );
  }
}

export default App;


//img1 Photo by Matteo Catanese on Unsplash
//img2 Photo by Benjamin Davies on Unsplash
//img 3 Photo by Benjamin Davies on Unsplash
//img4 Photo by Geran de Klerk on Unsplash
