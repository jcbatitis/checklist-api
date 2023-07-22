import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";

admin.initializeApp();
const checklist = express();

const firestore = admin.firestore();
const checklistCollection = firestore.collection("types");
const taskCollection = firestore.collection("tasks");

checklist.get("/GetTypes", async (req, res) => {
  try {
    const snapshot = await checklistCollection.get();

    let types: any = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      types.push({ id, ...data });
    });

    res.json([...types]);
  } catch (error) {
    res.status(500).send("Error finding documents.");
  }
});

checklist.get("/GetType/:id", async (req, res) => {
  try {
    const snapshot = checklistCollection.doc(req.params.id).get();
    const data = (await snapshot).data();
    if (data) {
      res.json({ ...data });
    } else {
      res.status(404).send("No document found.");
    }
  } catch (error) {
    res.status(500).send("Error finding document.");
  }
});

checklist.post("/CreateType", async (req, res) => {
  try {
    const payload = req.body;
    await checklistCollection.doc(payload.id).set(payload);
    const snapshot = checklistCollection.doc(payload.id).get();

    const data = (await snapshot).data();
    if (data) {
      res.json({ ...data });
    } else {
      res.status(404).send("No document found.");
    }
  } catch (error) {
    res.status(500).send("Error creating document.");
  }
});

checklist.put("/UpdateType/:id", async (req, res) => {
  try {
    const reference = checklistCollection.doc(req.params.id);
    const referenceSnapshot = await reference.get();

    if (!referenceSnapshot.exists) {
      res.status(404).send("Type not found.");
    } else {
      const payload = req.body;
      await checklistCollection.doc(req.params.id).update(payload);
      const snapshot = checklistCollection.doc(payload.id).get();

      const data = (await snapshot).data();
      if (data) {
        res.json({ ...data });
      } else {
        res.status(404).send("No document found.");
      }
    }
  } catch (error) {
    res.status(500).send("Error updating document.");
  }
});

checklist.delete("/DeleteType/:id", async (req, res) => {
  try {
    const reference = checklistCollection.doc(req.params.id);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      res.status(404).send("Type not found.");
    } else {
      await reference.delete();
      res.json("OK");
    }
  } catch (error) {
    res.status(500).send("Error deleting document.");
  }
});

checklist.post("/CreateTask", async (req, res) => {
  try {
    const payload = req.body;
    await taskCollection.doc(payload.id).set(payload);
    const snapshot = taskCollection.doc(payload.id).get();

    const data = (await snapshot).data();
    if (data) {
      res.json({ ...data });
    } else {
      res.status(404).send("No document found.");
    }
  } catch (error) {
    res.status(500).send("Error creating document.");
  }
});

checklist.put("/UpdateTask/:id", async (req, res) => {
  try {
    const reference = taskCollection.doc(req.params.id);
    const referenceSnapshot = await reference.get();

    if (!referenceSnapshot.exists) {
      res.status(404).send("Task not found.");
    } else {
      const payload = req.body;
      await taskCollection.doc(req.params.id).update(payload);
      const snapshot = taskCollection.doc(payload.id).get();

      const data = (await snapshot).data();
      if (data) {
        res.json({ ...data });
      } else {
        res.status(404).send("No document found.");
      }
    }
  } catch (error) {
    res.status(500).send("Error updating document.");
  }
});

checklist.delete("/DeleteTask/:id", async (req, res) => {
  try {
    const reference = taskCollection.doc(req.params.id);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      res.status(404).send("Task not found.");
    } else {
      await reference.delete();
      res.json("OK");
    }
  } catch (error) {
    res.status(500).send("Error deleting document.");
  }
});

checklist.get("/GetTask/:id", async (req, res) => {
  try {
    const snapshot = taskCollection.doc(req.params.id).get();
    const data = (await snapshot).data();
    if (data) {
      res.json({ ...data });
    } else {
      res.status(404).send("No document found.");
    }
  } catch (error) {
    res.status(500).send("Error finding document.");
  }
});

checklist.get("/GetTasks", async (req, res) => {
  try {
    const snapshot = await taskCollection.get();

    let types: any = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      types.push({ id, ...data });
    });

    res.json([...types]);
  } catch (error) {
    res.status(500).send("Error finding documents.");
  }
});

checklist.get("/GetTasksByType/:type", async (req, res) => {
  try {
    const snapshot = await taskCollection.get();
    const type = req.params.type;

    let types: any = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      if (data.type === type) {
        types.push({ id, ...data });
      }
    });

    res.json([...types]);
  } catch (error) {
    res.status(500).send("Error finding documents.");
  }
});

exports.Checklist = functions.https.onRequest(checklist);
