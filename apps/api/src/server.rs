use std::collections::{HashMap, HashSet};
use uuid::Uuid;

use actix::{dev::MessageResponse, prelude::*};

#[derive(Debug, MessageResponse)]
pub struct WSID(pub Uuid);

#[derive(Message)]
#[rtype(WSID)]
pub struct Connect {
    pub addr: Recipient<Message>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: Uuid,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Join {
    pub id: Uuid,
    pub room: String,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct ClientMessage {
    pub id: Uuid,
    pub msg: String,
    pub room: String,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

/// `ChatServer` manages chat rooms and responsible for coordinating chat session.
///
/// Implementation is very naïve.
#[derive(Debug)]
pub struct WSServer {
    sessions: HashMap<Uuid, Recipient<Message>>,
    rooms: HashMap<String, HashSet<Uuid>>, // room name -> sessions
}

impl WSServer {
    pub fn new() -> WSServer {
        // default room
        let mut rooms = HashMap::new();
        rooms.insert("main".to_owned(), HashSet::new());

        WSServer {
            sessions: HashMap::new(),
            rooms,
        }
    }
}

impl WSServer {
    /// Send message to all users in the room
    fn send_message(&self, room: &str, message: &str, skip_id: Uuid) {
        let Some(sessions) = self.rooms.get(room) else { return; };

        for id in sessions {
            if *id == skip_id { continue; }
            let Some(addr) = self.sessions.get(id) else { continue; };
            addr.do_send(Message(message.to_owned()));
        }
    }
}

/// Make actor from `ChatServer`
impl Actor for WSServer {
    /// We are going to use simple Context, we just need ability to communicate
    /// with other actors.
    type Context = Context<Self>;
}

/// Handler for Connect message.
///
/// Register new session and assign unique id to this session
impl Handler<Connect> for WSServer {
    type Result = WSID;

    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        // notify all users in same room
        self.send_message("main", "Someone joined", Uuid::nil());

        // register session with random id
        let id = Uuid::new_v4();
        self.sessions.insert(id, msg.addr);

        // auto join session to main room
        self.rooms.entry("main".to_owned()).or_default().insert(id);
        
        WSID(id)
    }
}

/// Handler for Disconnect message.
impl Handler<Disconnect> for WSServer {
    type Result = ();

    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        let mut rooms: Vec<String> = Vec::new();

        // remove address
        if self.sessions.remove(&msg.id).is_some() {
            // remove session from all rooms
            for (name, sessions) in &mut self.rooms {
                if sessions.remove(&msg.id) {
                    rooms.push(name.to_owned());
                }
            }
        }

        // remove all empty rooms
        for room in &rooms {
            if let Some(sessions) = self.rooms.get(room) {
                if sessions.is_empty() {
                    self.rooms.remove(room);
                }
            }
        }

        // send message to other users
        for room in rooms {
            self.send_message(&room, "Someone disconnected", Uuid::nil());
        }
    }
}

/// Handler for Message message.
impl Handler<ClientMessage> for WSServer {
    type Result = ();

    fn handle(&mut self, msg: ClientMessage, _: &mut Context<Self>) {
        self.send_message(&msg.room, msg.msg.as_str(), msg.id);
    }
}

/// Join room, send disconnect message to old room
/// send join message to new room
impl Handler<Join> for WSServer {
    type Result = ();

    fn handle(&mut self, msg: Join, _: &mut Context<Self>) {
        let Join { id, room } = msg;
        let mut rooms = Vec::new();

        // remove session from all rooms
        for (n, sessions) in &mut self.rooms {
            if sessions.remove(&id) {
                rooms.push(n.to_owned());
            }
        }

        // remove all empty rooms
        for room in &rooms {
            if let Some(sessions) = self.rooms.get(room) {
                if sessions.is_empty() {
                    self.rooms.remove(room);
                }
            }
        }

        // send message to other users
        for room in rooms {
            self.send_message(&room, "Someone disconnected", Uuid::nil());
        }

        self.rooms.entry(room.clone()).or_default().insert(id);

        self.send_message(&room, "Someone connected", id);
    }
}
