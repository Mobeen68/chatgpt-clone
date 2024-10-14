import express from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import userChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import path from "path";
import url from "url";

const port = process.env.PORT || 3000;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log(error);
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;
  try {
    // Create new chat
    const newChat = new Chat({
      userId: userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const savedChat = await newChat.save();

    // check if user chat exists
    const userChat = await userChats.find({ userId: userId });

    // if not, create new user chat
    if (!userChat.length) {
      const newUserChat = new userChats({
        userId: userId,
        chats: [
          {
            _id: savedChat.id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChat.save();
    } else {
      // if yes, update user chat
      const updatedUserChat = await userChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        },
        { new: true }
      );

      res.status(200).send(newChat._id);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating chat", error);
  }
});

app.get("/api/userChats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chats = await userChats.find({ userId });
    // console.log(chats);

    res.status(200).send(chats[0].chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching user chats", error);
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chats = await Chat.findOne({ _id: req.params.id, userId });
    // console.log(chats);

    res.status(200).send(chats);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching chats", error);
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }], ...(img && { img }) },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      },
      { new: true }
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding conversation", error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.use(express.static(__dirname + "../client/dist"));

app.get("*", (req, res) => {
  res.sendFile(express.static(__dirname + "../client", "index.html"));
});

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
