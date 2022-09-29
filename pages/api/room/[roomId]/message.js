import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4, v4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist

    const result = rooms.find((element) => {
      return element.roomId === roomId;
    });

    if (!result) {
      return res.status(401).json({
        ok: false,
        message: "Invalid room id",
      });
    }
    return res.status(201).json({
      ok: true,
      messages: result.messages,
    });

    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist4
    const result = rooms.find((element) => {
      return element.roomId === roomId;
    });

    if (!result) {
      return res.status(401).json({
        ok: false,
        message: "Invalid room id",
      });
    }

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newData = {
      messageId: v4(),
      text: req.body.text,
      username: user.username,
    };
    result.messages.push(newData);

    writeChatRoomsDB(rooms);
    return res.status(200).json({
      ok: true,
      message: newData,
    });
  }
}
