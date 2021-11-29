import "./App.css";
import React, { useState } from "react";
import { app } from "../src/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  updateDoc,
  deleteDoc,
  deleteField,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

function App() {
  //used to get the firestore database
  const db = getFirestore();
  const [onceRead, setonceRead] = useState(null);
  const [listenerRead, setListenerRead] = useState(null);
  const [allData, setAllData] = useState(null);

  //create software testing document with Id "ST"
  //note: if collection "classes" does not exist then it is created
  //lessons are nested documents
  const setDocumentST = async () => {
    await setDoc(doc(db, "classes", "ST"), {
      name: "Software Testing",
      year: "3",
      lessons: {
        Monday: "8-10",
        Tuesday: "10-13",
        Wednesday: "15-17",
        Thursday: "8-10",
        Friday: "8-10",
      },
    });
  };

  //create mobile development document with Id "MD"
  const setDocumentMD = async () => {
    await setDoc(doc(db, "classes", "MD"), {
      name: "Mobile Development",
      year: "2",
      lessons: {
        Monday: "8-10",
        Tuesday: "10-13",
        Thursday: "8-10",
        Friday: "8-10",
      },
    });
  };

  //update software testing document by adding field "available" with string value "yes"
  const updateDocument = async () => {
    //reference to document
    const stRef = doc(db, "classes", "ST");
    //updating document
    await updateDoc(stRef, {
      available: "yes",
    });
  };

  //update software testing document nested document lessons
  //field "Monday" updated to values "10-12"
  const updateDocumentNested = async () => {
    const stref = doc(db, "classes", "ST");
    await updateDoc(stref, {
      "lessons.Monday": "10-12",
    });
  };

  //delete document Mobile development with id "MD"
  const deleteDocument = async () => {
    await deleteDoc(doc(db, "classes", "MD"));
  };

  //delete field "available" from software testing document
  const deleteFields = async () => {
    //reference to document
    const stRef = doc(db, "classes", "ST");
    //updating document by calling the deleteField method in firebase
    await updateDoc(stRef, {
      available: deleteField(),
    });
  };

  //reading document software testing and updating variable with values
  //no realtime updates
  const readST = async () => {
    //document reference
    const docRef = doc(db, "classes", "ST");
    //get document and store in varaible docSnap
    const docSnap = await getDoc(docRef);

    //if data retrieved varaible onceRead is updated
    if (docSnap) {
      setonceRead(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  //reading software testing document with listener
  //listens to realtime updates
  const readSTListener = () => {
    //document reference
    const ref = doc(db, "classes", "ST");
    //use onSnapshot firebase method and sets data to variable
    onSnapshot(ref, (doc) => {
      console.log("Current data: ", doc.data());
      setListenerRead(doc.data());
    });
  };

  //reading collection "classes" with listener
  //listens to realtime updates
  const readCollectionListener = () => {
    onSnapshot(collection(db, "classes"), (querySnapshot) => {
      const classes = [];
      //iterate through the documents in the collection and adds the classes array
      querySnapshot.forEach((doc) => {
        classes.push(doc.data());
      });
      console.log("Current classes ", classes);
      //sets classes to variable used for displaying
      setAllData(classes);
    });
  };

  return (
    <div className="App">
      <link
        href="https://fonts.googleapis.com/css?family=Inter:100,200,300,regular,500,600,700,800,900"
        rel="stylesheet"
      />
      <header className="App-header">
        <p
          style={{ fontFamily: "Inter", fontWeight: "bold", fontSize: "50px" }}
        >
          Firebase Demo
        </p>
      </header>
      <div id="button-div">
        <div class="crud-container">
          <h2>
            <span class="crud-emphasised-letter">C</span>reate
          </h2>
          <button className="demo-button" onClick={() => setDocumentST()}>
            Add document software testing
          </button>
          <button className="demo-button" onClick={() => setDocumentMD()}>
            Add document Mobile Development
          </button>
        </div>
        <div class="crud-container">
          <h2>
            <span class="crud-emphasised-letter">R</span>ead
          </h2>
          <button className="demo-button" onClick={() => readST()}>
            Read Software Testing document
          </button>
          <button className="demo-button" onClick={() => readSTListener()}>
            Read Software Testing document with listener
          </button>
          <button
            className="demo-button"
            onClick={() => readCollectionListener()}
          >
            Read collection with listener
          </button>
        </div>
        <div class="crud-container">
          <h2>
            <span class="crud-emphasised-letter">U</span>pdate
          </h2>
          <button className="demo-button" onClick={() => updateDocument()}>
            Update document software testing with available yes
          </button>
          <button
            className="demo-button"
            onClick={() => updateDocumentNested()}
          >
            Update nested document of Software testing
          </button>
        </div>
        <div class="crud-container">
          <h2>
            <span class="crud-emphasised-letter">D</span>elete
          </h2>
          <button className="demo-button" onClick={() => deleteDocument()}>
            Delete Mobile development document
          </button>
          <button className="demo-button" onClick={() => deleteFields()}>
            Delete software testing available field
          </button>
        </div>
      </div>
      <div className="d-flex">
        <div className="border">
          <h3 class="output-header">Software Testing document call once</h3>
          <div className="output">
            {onceRead &&
              Object.keys(onceRead)
                .sort()
                .map((key) => {
                  if (key === "lessons" && onceRead["lessons"]) {
                    let object = onceRead["lessons"];
                    return (
                      <div>
                        {Object.keys(object)
                          .sort()
                          .map((date) => {
                            return (
                              <div>
                                <p>
                                  {date}: {object[date]}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    );
                  } else {
                    return (
                      <p>
                        {key}: {onceRead[key]}
                      </p>
                    );
                  }
                })}
          </div>
        </div>
        <div className="border">
          <h3 class="output-header">
            Software Testing document call with listener
          </h3>
          <div className="output">
            {listenerRead &&
              Object.keys(listenerRead)
                .sort()
                .map((key) => {
                  if (key === "lessons") {
                    let object = listenerRead["lessons"];
                    return (
                      <view>
                        {Object.keys(object)
                          .sort()
                          .map((date) => {
                            return (
                              <view>
                                <p>
                                  {date}: {object[date]}
                                </p>
                              </view>
                            );
                          })}
                      </view>
                    );
                  } else {
                    return (
                      <view>
                        <p>
                          {key}: {listenerRead[key]}
                        </p>
                      </view>
                    );
                  }
                })}
          </div>
        </div>
        <div className="border">
          <h3 class="output-header">Collection call with listener</h3>
          <div className="output">
            {allData &&
              Object.keys(allData)
                .sort()
                .map((dataK) => {
                  const data = allData[dataK];
                  return (
                    <div>
                      {Object.keys(data)
                        .sort()
                        .map((key) => {
                          if (key === "lessons") {
                            let object = data["lessons"];
                            return (
                              <view>
                                {Object.keys(object)
                                  .sort()
                                  .map((date) => {
                                    return (
                                      <view>
                                        <p>
                                          {date}: {object[date]}
                                        </p>
                                      </view>
                                    );
                                  })}
                              </view>
                            );
                          } else {
                            return (
                              <p>
                                {key}: {data[key]}
                              </p>
                            );
                          }
                        })}
                      <hr />
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
